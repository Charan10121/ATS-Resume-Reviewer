export interface SampleResume {
  id: string;
  name: string;
  title: string;
  expectedScoreProfile: string;
  githubUser: string;
  roleId: string;
  content: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'senior-backend',
    name: 'Alex Rivera (Senior Backend / Distributed Systems)',
    title: 'Senior Backend Engineer • 6 Yrs Exp • High OSS & Scale',
    expectedScoreProfile: 'Score: ~92/120 (Strong Pass, Major OSS PRs, High Concurrency)',
    githubUser: 'alexrivera-dev',
    roleId: 'backend_engineer',
    content: `# Alex Rivera
San Francisco, CA • alex.rivera@example.com • github.com/alexrivera-dev • linkedin.com/in/alexrivera-eng

## Professional Summary
Senior Distributed Systems Engineer with 6+ years of experience designing and operating high-throughput microservices handling 45,000+ QPS. Active open-source contributor to Apache Kafka ecosystem and Go gRPC tooling. Proven expertise in distributed consensus, database query optimization, and zero-downtime migrations.

## Technical Skills
- Languages: Go (Golang), Python, TypeScript, SQL, Bash, C++
- Distributed Systems: Apache Kafka, RabbitMQ, gRPC, Protocol Buffers, Raft Consensus
- Databases & Storage: PostgreSQL, Redis, Elasticsearch, DynamoDB, CockroachDB
- Infrastructure & Cloud: Kubernetes (EKS), Docker, Terraform, AWS, Prometheus, Datadog

## Work Experience

### Staff Backend Engineer | CloudScale Networks (2022 - Present)
- Architected and deployed an event-driven telemetry ingest pipeline processing 50M+ events/day using Go and Kafka, reducing 99th percentile end-to-end latency from 420ms to 65ms.
- Spearheaded database partitioning and connection pooling refactor across 12-node PostgreSQL cluster, eliminating deadlocks and decreasing query timeouts by 94%.
- Led zero-downtime migration of 40+ microservices from legacy EC2 instances to Kubernetes clusters managed via Terraform and ArgoCD.
- Mentored a distributed team of 8 backend engineers; established rigorous RFC process and automated Chaos Engineering drills resulting in 99.995% service uptime over 18 months.

### Senior Software Engineer | Datasync Labs (2019 - 2022)
- Designed distributed rate-limiting middleware in Go backed by Redis sliding window algorithms, safeguarding public APIs against 15+ DDoS attempts without service degradation.
- Implemented real-time analytics aggregation engine indexing 3TB of log streams daily into Elasticsearch, cutting customer investigation time by 60%.
- Authored custom Prometheus exporter for internal cache synchronization metrics, leading to proactive discovery of 5 critical memory leak regressions before production release.

## Open Source Contributions & Community
- **Apache Kafka (Go client)**: Authored PR #1428 resolving consumer group rebalance timeout race condition under network partitions; merged and released in v1.8.
- **grpc-go ecosystem**: Contributed connection pooling retry backoff enhancements with 450+ GitHub stars; active maintainer of 'go-resilient-client' (1,200+ stars).
- Speaker at GopherCon 2023 on "Zero-Allocation Serialization in High-Throughput Pipelines".

## Projects
- **RaftKV (github.com/alexrivera-dev/raft-kv)**: Distributed consistent key-value store built in Go implementing the Raft consensus algorithm from scratch with dynamic membership changes, snapshotting, and linearizable reads. Deployed on multi-region AWS nodes with automated Jepsen tests passing.
- **LogStream-CLI**: High-speed terminal log parser capable of analyzing 5GB gzip logs in under 1.8 seconds utilizing SIMD JSON routines and parallel worker pools.

## Education
B.S. in Computer Science • University of California, Berkeley (2015 - 2019)
`
  },
  {
    id: 'mid-fullstack',
    name: 'Jordan Chen (Mid Full Stack Engineer)',
    title: 'Full Stack Engineer • 3 Yrs Exp • React, Node.js & Postgres',
    expectedScoreProfile: 'Score: ~72/120 (Pass / Meets Bar, Good Projects, Needs OSS boost)',
    githubUser: 'jordanchen',
    roleId: 'fullstack_engineer',
    content: `# Jordan Chen
Seattle, WA • jordan.chen@example.com • github.com/jordanchen • linkedin.com/in/jordanchen-swe

## Professional Summary
Full Stack Software Engineer with 3 years of production experience building responsive SaaS web applications and REST APIs using React, TypeScript, Node.js, and PostgreSQL. Passionate about clean code, component-driven UI, and test-driven development.

## Technical Skills
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux Toolkit, React Query
- Backend: Node.js, Express, NestJS, RESTful APIs, GraphQL
- Databases: PostgreSQL, Prisma ORM, MongoDB, Redis
- Tools & DevOps: Git, Docker, Jest, Cypress, GitHub Actions, AWS S3/EC2

## Work Experience

### Software Engineer | NovaTech Solutions (2022 - Present)
- Developed customer-facing dashboard features in React and TypeScript for B2B analytics platform utilized by 12,000 monthly active businesses.
- Built reusable modular design system component library with Tailwind CSS and Radix UI, standardizing UI across 4 internal engineering teams and reducing page load times by 28%.
- Designed and maintained 15+ REST endpoints in NestJS and PostgreSQL, integrating Stripe payment webhooks for multi-tier subscription billing with 99.9% webhook delivery reliability.
- Wrote automated unit and end-to-end test suites using Jest and Cypress, elevating overall test coverage from 45% to 82%.

### Junior Web Developer | Beacon Creative Media (2021 - 2022)
- Collaborated with UX designers to translate Figma mockups into pixel-perfect responsive web pages using React and Next.js.
- Integrated third-party headless CMS (Strapi) and optimized image delivery pipeline via Cloudinary, decreasing First Contentful Paint (FCP) from 3.2s to 1.1s.
- Automated deployment workflows using GitHub Actions to deploy pull-request preview environments on Vercel.

## Projects
- **DevBoard Kanban**: Real-time collaborative project management tool built with Next.js, Node.js, Socket.io, and PostgreSQL. Features drag-and-drop task boards, role-based permissions, and live presence indicators. Hosted on Render with 300+ active user registrations.
- **CodeSnippet Manager**: Open-source browser extension for developers to search and categorize syntax snippets with syntax highlighting and keyboard navigation.

## Education
B.S. in Software Engineering • University of Washington (2017 - 2021)
`
  },
  {
    id: 'junior-dev',
    name: 'Taylor Brooks (Junior / New Grad)',
    title: 'Associate Developer • Academic Projects • Needs ATS & Metric Optimization',
    expectedScoreProfile: 'Score: ~48/120 (Leaning Reject, Buzzwords without metrics, 0 OSS)',
    githubUser: 'taylorbrooks',
    roleId: 'backend_engineer',
    content: `# Taylor Brooks
Austin, TX • taylor.brooks@example.com • github.com/taylorbrooks

## Objective
Motivated computer science graduate seeking an entry-level software engineer role where I can utilize my extensive programming knowledge in Python, Java, C++, React, Node, AWS, Machine Learning, and Blockchain to deliver high impact software solutions.

## Skills
- Programming Languages: Python, Java, C, C++, JavaScript, TypeScript, HTML, CSS, SQL, R, Go, Rust
- Frameworks & Libraries: React, Node.js, Express, Django, Flask, Spring Boot, PyTorch, TensorFlow
- Cloud & Technologies: AWS, Docker, Kubernetes, Git, Jenkins, Kafka, MongoDB, Postgres, GraphQL, Web3

## Experience

### Software Engineering Intern | Acme Digital (Summer 2023)
- Worked with the engineering team to build web application features.
- Responsible for fixing bug tickets in Jira and participating in daily agile standup meetings.
- Assisted senior engineers in writing Python scripts to process database records.
- Utilized Git for version control and submitted pull requests for code reviews.

### IT Student Assistant | University Tech Services (2022 - 2023)
- Maintained lab computers and assisted students with hardware and software troubleshooting.
- Managed user accounts and handled active directory tickets.

## Academic Projects
- **E-Commerce Web Application**: Built an online shopping website using React, Node.js, and MongoDB where users can view products and add items to cart.
- **Machine Learning Sentiment Classifier**: Created a sentiment analysis script using Python and scikit-learn to classify customer reviews into positive and negative categories.
- **Personal Portfolio Website**: Designed a personal website showcasing projects and resume using HTML, CSS, and JavaScript.

## Education
Bachelor of Science in Computer Science
University of Texas at Austin (Graduated May 2024) • GPA: 3.6/4.0
`
  }
];
