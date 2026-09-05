import { RoleConfig } from '../types.ts';

export const SUPPORTED_ROLES: RoleConfig[] = [
  {
    id: 'backend_engineer',
    title: 'Backend Engineer',
    description: 'Specializes in distributed systems, concurrency, APIs, relational & NoSQL databases, and low-latency microservices.',
    keySignals: ['Distributed systems', 'High concurrency', 'DB query optimization', 'Microservices', 'Docker/Kubernetes', 'Redis/Kafka'],
    focusAreas: 'Production scale (QPS, throughput, latency), database schema design, caching strategies, and concurrency patterns.',
    criteriaNotes: 'High weighting on production telemetry, database bottleneck resolution, and open source infrastructure libraries.'
  },
  {
    id: 'frontend_engineer',
    title: 'Frontend Engineer',
    description: 'Specializes in modern web applications, state management, browser performance, accessibility, and UI component architecture.',
    keySignals: ['React / Vue / Next.js', 'TypeScript', 'Web Vitals & Performance', 'Design Systems', 'State Management', 'Cross-browser rendering'],
    focusAreas: 'Client-side performance, Core Web Vitals optimization, state synchronization, test coverage, and design system creation.',
    criteriaNotes: 'High weighting on component architecture, client-side caching, bundle optimization, and interactive UX proofs.'
  },
  {
    id: 'fullstack_engineer',
    title: 'Full Stack Engineer',
    description: 'Bridges user interfaces, server-side APIs, database architecture, and deployment pipelines from end-to-end.',
    keySignals: ['Full-lifecycle development', 'API & Frontend integration', 'Database migrations', 'Cloud deployments', 'System observability'],
    focusAreas: 'End-to-end delivery speed, robust REST/GraphQL APIs, clean separation of concerns, and full product ownership.',
    criteriaNotes: 'Balanced scoring across front-end responsiveness and resilient backend data pipelines.'
  },
  {
    id: 'ai_ml_engineer',
    title: 'AI / Machine Learning Engineer',
    description: 'Focuses on LLMs, agentic workflows, embeddings, vector search, PyTorch/TensorFlow, model fine-tuning, and MLOps pipelines.',
    keySignals: ['LLM Orchestration / RAG', 'PyTorch / HuggingFace', 'Vector Databases', 'Model evaluation / benchmarks', 'Model serving / quantization'],
    focusAreas: 'Production LLM inference latency, context window optimization, precision/recall metrics, and scalable data preprocessing.',
    criteriaNotes: 'High weighting on non-wrapper AI architectures, custom fine-tuning, and reproducible benchmark evaluations.'
  },
  {
    id: 'devops_sre',
    title: 'DevOps / Site Reliability Engineer',
    description: 'Specializes in infrastructure as code, continuous integration/delivery, container orchestration, monitoring, and 99.99% uptime.',
    keySignals: ['Kubernetes / Terraform', 'CI/CD Pipelines', 'Prometheus / Grafana', 'Chaos engineering & incident response', 'Cloud Security'],
    focusAreas: 'Infrastructure scalability, mean time to recovery (MTTR), zero-downtime deployments, and automated scaling policies.',
    criteriaNotes: 'High weighting on real-world outage mitigation, multi-region failover, and automated provisioning.'
  },
  {
    id: 'custom_role',
    title: 'Custom Job Description',
    description: 'Evaluate your resume against a custom role or specific job posting criteria.',
    keySignals: ['Custom requirements', 'Job description match', 'Domain-specific qualifications'],
    focusAreas: 'Matches candidate achievements directly to the provided target job description.',
    criteriaNotes: 'Custom rubric weighting adjusted based on the job description you paste.'
  }
];
