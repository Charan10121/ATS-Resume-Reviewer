import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileText, Github, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, RefreshCw, Layers, Sliders, X
} from 'lucide-react';
import { SUPPORTED_ROLES } from '../data/roles.ts';
import { SAMPLE_RESUMES, SampleResume } from '../data/sampleResumes.ts';

interface ResumeInputProps {
  onAnalyze: (payload: {
    resumeText: string;
    pdfBase64?: string;
    targetRole: string;
    customJobDescription?: string;
    githubUser?: string;
  }) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({ onAnalyze, isLoading, loadingStep }) => {
  const [selectedRole, setSelectedRole] = useState<string>('backend_engineer');
  const [customJobDescription, setCustomJobDescription] = useState<string>('');
  const [githubUser, setGithubUser] = useState<string>('');
  const [inputTab, setInputTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  
  const [resumeText, setResumeText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; base64?: string; isPdf: boolean } | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('senior-backend');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt');

    if (!isPdf && !isText) {
      // If docx or other, we still read as text or base64
      setErrorMessage('Tip: For best accuracy, upload PDF or TXT/Markdown, or paste text directly.');
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    if (isPdf) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUploadedFile({
          name: file.name,
          size: fileSizeStr,
          base64,
          isPdf: true,
        });
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
        setUploadedFile({
          name: file.name,
          size: fileSizeStr,
          isPdf: false,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const loadSample = (sample: SampleResume) => {
    setSelectedSampleId(sample.id);
    setSelectedRole(sample.roleId);
    setGithubUser(sample.githubUser);
    setResumeText(sample.content);
    setUploadedFile(null);
    setInputTab('paste');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const hasText = resumeText.trim().length > 30;
    const hasPdf = uploadedFile?.isPdf && uploadedFile?.base64;

    if (!hasText && !hasPdf) {
      setErrorMessage('Please either upload a resume file (PDF/Text) or paste your resume content.');
      return;
    }

    try {
      await onAnalyze({
        resumeText: resumeText.trim(),
        pdfBase64: uploadedFile?.base64,
        targetRole: selectedRole,
        customJobDescription: selectedRole === 'custom_role' ? customJobDescription : undefined,
        githubUser: githubUser.trim(),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze resume. Please verify input.');
    }
  };

  const currentRoleObj = SUPPORTED_ROLES.find(r => r.id === selectedRole) || SUPPORTED_ROLES[0];

  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm shadow-2xl p-6 sm:p-8 mb-10 text-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Role Configuration */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
            <div>
              <label className="text-xs font-black tracking-[0.25em] uppercase text-white/50 flex items-center gap-2.5">
                <span className="w-5 h-5 bg-white text-black font-black text-[11px] flex items-center justify-center">1</span>
                <span>Select Target Engineering Role</span>
              </label>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mt-1">
                Target Benchmark
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Quick Samples:</span>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_RESUMES[0])}
                className="text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white hover:text-black text-white/80 border border-white/15 transition-all"
              >
                Senior OSS
              </button>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_RESUMES[1])}
                className="text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white hover:text-black text-white/80 border border-white/15 transition-all"
              >
                Mid Fullstack
              </button>
              <button
                type="button"
                onClick={() => loadSample(SAMPLE_RESUMES[2])}
                className="text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white hover:text-black text-white/80 border border-white/15 transition-all"
              >
                Junior / Grad
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SUPPORTED_ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`text-left p-3 rounded-sm border transition-all ${
                  selectedRole === role.id
                    ? 'border-white bg-white text-black shadow-lg'
                    : 'border-white/10 hover:border-white/30 text-white/70 bg-black/40 hover:bg-white/5'
                }`}
              >
                <div className={`text-xs font-black uppercase tracking-tight truncate ${selectedRole === role.id ? 'text-black' : 'text-white'}`}>
                  {role.title}
                </div>
                <div className={`text-[10px] mt-1 line-clamp-1 font-mono uppercase tracking-wide ${selectedRole === role.id ? 'text-black/70' : 'text-white/40'}`}>
                  {role.focusAreas}
                </div>
              </button>
            ))}
          </div>

          {selectedRole === 'custom_role' && (
            <div className="mt-4">
              <label className="text-[11px] font-black tracking-[0.2em] uppercase text-white/60 mb-2 block">
                Paste Custom Job Description or Key Requirements
              </label>
              <textarea
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                placeholder="Paste requirements, stack expectations, or job posting text here..."
                rows={3}
                className="w-full text-xs font-mono p-3 rounded-sm border border-white/20 bg-black/60 text-white placeholder-white/30 focus:outline-none focus:border-white"
              />
            </div>
          )}
        </div>

        {/* Step 2: GitHub Profile Enrichment (HackerRank Feature) */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3">
            <div>
              <label className="text-xs font-black tracking-[0.25em] uppercase text-white/50 flex items-center gap-2.5">
                <span className="w-5 h-5 bg-white text-black font-black text-[11px] flex items-center justify-center">2</span>
                <span className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  GitHub Signal Enrichment
                </span>
                <span className="text-[9px] px-2 py-0.5 border border-white/20 text-white/60 rounded-full font-bold">
                  OPTIONAL
                </span>
              </label>
              <p className="text-xs text-white/40 mt-0.5">
                Automatically verify commits, public repos, and stars to substaniate OSS & project claims
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 font-mono text-xs">
              github.com/
            </div>
            <input
              type="text"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value.replace(/^https?:\/\/github\.com\//, ''))}
              placeholder="username (e.g. torvalds)"
              className="w-full text-xs py-3 pl-28 pr-4 rounded-sm border border-white/20 bg-black/60 text-white placeholder-white/30 focus:outline-none focus:border-white font-mono transition-all"
            />
          </div>
        </div>

        {/* Step 3: Resume Input */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
            <div>
              <label className="text-xs font-black tracking-[0.25em] uppercase text-white/50 flex items-center gap-2.5">
                <span className="w-5 h-5 bg-white text-black font-black text-[11px] flex items-center justify-center">3</span>
                <span>Provide Your Resume</span>
              </label>
              <h3 className="text-xl font-black uppercase tracking-tight text-white mt-1">
                Upload or Paste Document
              </h3>
            </div>

            {/* Input tabs with Bold Typography */}
            <div className="inline-flex p-1 bg-black border border-white/20 rounded-sm">
              <button
                type="button"
                onClick={() => setInputTab('upload')}
                className={`px-3.5 py-1.5 text-xs font-black tracking-[0.15em] uppercase transition-all flex items-center gap-1.5 ${
                  inputTab === 'upload'
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload PDF
              </button>

              <button
                type="button"
                onClick={() => setInputTab('paste')}
                className={`px-3.5 py-1.5 text-xs font-black tracking-[0.15em] uppercase transition-all flex items-center gap-1.5 ${
                  inputTab === 'paste'
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Paste Markdown
              </button>

              <button
                type="button"
                onClick={() => setInputTab('samples')}
                className={`px-3.5 py-1.5 text-xs font-black tracking-[0.15em] uppercase transition-all flex items-center gap-1.5 ${
                  inputTab === 'samples'
                    ? 'bg-white text-black'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Samples
              </button>
            </div>
          </div>

          {/* TAB 1: File Upload */}
          {inputTab === 'upload' && (
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
                accept=".pdf,.txt,.md,.docx,application/pdf,text/plain"
                className="hidden"
              />

              {!uploadedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-white bg-white/10'
                      : 'border-white/20 hover:border-white bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="w-12 h-12 bg-white text-black rounded-full mx-auto flex items-center justify-center mb-4 font-black">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-base font-black uppercase tracking-tight text-white">
                    Select Resume PDF or Drag & Drop File
                  </p>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 mt-1">
                    Native PDF parsing with page & section layout evaluation
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 border border-white/20 rounded-full text-white/70">
                      Multi-Page Extract
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 border border-white/20 rounded-full text-white/70">
                      ATS Format Check
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-sm border-l-4 border-emerald-500 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-black font-black flex items-center justify-center text-xs">
                      {uploadedFile.isPdf ? 'PDF' : 'DOC'}
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-tight text-white flex items-center gap-2">
                        <span>{uploadedFile.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-[11px] font-mono text-white/40">
                        {uploadedFile.size} • Ready for ATS rubric grading
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold tracking-[0.1em] uppercase px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black rounded-sm border border-white/20 transition-all"
                    >
                      Change File
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        setResumeText('');
                      }}
                      className="p-1.5 rounded-sm text-white/40 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Textarea Paste */}
          {inputTab === 'paste' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
                <span>Markdown or Plaintext</span>
                <span>{resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : 'Empty'}</span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your complete resume markdown or text here (experience, skills, projects, open source, education)..."
                rows={11}
                className="w-full text-xs font-mono p-4 rounded-sm border border-white/20 bg-black/70 text-white placeholder-white/30 focus:outline-none focus:border-white leading-relaxed"
              />
            </div>
          )}

          {/* TAB 3: Preloaded Samples */}
          {inputTab === 'samples' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_RESUMES.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => loadSample(sample)}
                  className={`p-4 rounded-sm border cursor-pointer transition-all ${
                    selectedSampleId === sample.id && resumeText === sample.content
                      ? 'border-l-4 border-l-white bg-white/10 border-white/30'
                      : 'border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/5'
                  }`}
                >
                  <div className="text-sm font-black uppercase tracking-tight text-white mb-1">
                    {sample.name}
                  </div>
                  <div className="text-xs font-bold text-white/50 mb-3">
                    {sample.title}
                  </div>
                  <div className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/15 text-white/70">
                    {sample.expectedScoreProfile}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="p-4 bg-white/5 border-l-4 border-rose-500 text-white text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
        )}

        {/* Action Button & Loading Feedback */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/50">
            {uploadedFile ? (
              <span className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4" /> Ready to review {uploadedFile.name}
              </span>
            ) : resumeText.trim().length > 50 ? (
              <span className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4" /> {resumeText.trim().split(/\s+/).length} words ready for review
              </span>
            ) : (
              <span className="uppercase tracking-widest text-[10px] text-white/40">Provide your resume file or text above to begin</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-4 rounded-sm font-black text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2.5 shadow-2xl ${
              isLoading
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white text-black hover:invert cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>{loadingStep || 'Evaluating with Hiring Agent...'}</span>
              </>
            ) : (
              <>
                <span>Run Hiring Agent ATS Review</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
