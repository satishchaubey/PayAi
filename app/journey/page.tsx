import { IconCloudDemo } from "@/components/IconCloudDemo";
import styles from "./journey.module.css";

const skills = {
  frontend: ["React.js", "Next.js (App Router)", "TypeScript", "Redux Toolkit", "Redux Thunk", "JavaScript (ES6+)"] ,
  backend: ["FastAPI", "REST APIs", "Node.js", "NestJS"],
  ui: ["Tailwind CSS", "ShadCN UI", "Radix UI", "HTML5", "CSS3", "SCSS", "MUI", "Bootstrap"],
  blockchain: ["Smart Contract Integration", "Wallet Workflows", "BSC Interactions"],
  tools: ["Git", "GitHub", "VS Code", "Postman"],
  ai: ["Prompt Engineering", "LLM Integrations", "GenAI API Integration", "Sarvam API", "NotebookLM API Workflows"]
};

const skillLabels: Record<keyof typeof skills, string> = {
  frontend: "Frontend",
  backend: "Backend",
  ui: "UI & Styling",
  blockchain: "Blockchain",
  tools: "Tools & Platforms",
  ai: "AI & LLM Integrations"
};

const experiences = [
  {
    role: "Software Engineer",
    company: "Plutos One Pvt. Ltd.",
    period: "February 2024 - Present",
    location: "Noida",
    points: [
      "Led frontend development for SaaS and banking platforms using Next.js and React.js.",
      "Developed and optimized 30+ dynamic pages across enterprise applications.",
      "Integrated PayU and Razorpay payment gateways for secure transaction flows.",
      "Built enterprise dashboards including CBMS, EMS, and VMS.",
      "Improved performance by ~20% via caching, optimized API calls, and lazy loading.",
      "Worked in microservices architecture with cross-functional teams."
    ]
  },
  {
    role: "Front-End Developer",
    company: "Speqto Technology Pvt. Ltd.",
    period: "June 2023 - January 2024",
    location: "Noida",
    points: [
      "Built reusable UI components using React.js, Next.js, and Vite.",
      "Implemented secure decentralized wallet features with REST API integration.",
      "Worked on blockchain-based workflows and BSC smart contract interactions.",
      "Ensured cross-browser compatibility, responsiveness, and performance optimization."
    ]
  },
  {
    role: "MERN Stack Intern",
    company: "Techpile Technology Pvt. Ltd.",
    period: "June 2022 - May 2023",
    location: "Lucknow",
    points: [
      "Developed web applications using MongoDB, Express.js, React.js, and Node.js.",
      "Created responsive interactive UIs using React, Redux, and Bootstrap.",
      "Gained hands-on full-stack development experience."
    ]
  }
];

const freelanceWorks = [
  {
    name: "Trading Solutions",
    role: "Modern trading solution platform",
    stack: ["Next.js", "ShadCN", "TailwindCSS", "TypeScript"],
    points: [
      "Focused on speed, responsiveness, and scalability.",
      "Implemented reusable dashboards, trading charts, and portfolio components.",
      "Optimized API integrations for smoother data flow."
    ]
  },
  {
    name: "Bound Finance (Crypto Trading Platform)",
    role: "Frontend for crypto trading platform",
    stack: ["React.js", "Wagmi", "MetaMask", "Web3.js", "TailwindCSS", "Blockchain"],
    points: [
      "Built responsive trading UI with MetaMask integration.",
      "Optimized performance for smooth Web3 interactions."
    ]
  },
  {
    name: "Bound Finance Landing Page",
    role: "Marketing + product landing page",
    stack: ["React.js", "TailwindCSS"],
    points: [
      "Built responsive pixel-perfect UI.",
      "Handled SEO optimization and cross-device responsiveness."
    ]
  },
  {
    name: "Bound Finance Ethereum",
    role: "Ongoing crypto trading module",
    stack: ["React.js", "Wagmi", "Web3.js", "Blockchain"],
    points: [
      "Building secure Ethereum trading workflows.",
      "Adding real-time updates and wallet integration."
    ]
  },
  {
    name: "Udenz Book Appointment",
    role: "Healthcare booking platform",
    stack: ["React.js", "TailwindCSS"],
    points: [
      "Doctor appointment scheduling and prescription management.",
      "Built intuitive and responsive user interface."
    ]
  }
];

export default function JourneyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.cloudSection}>
        <h2>Skill Icon Cloud</h2>
        <IconCloudDemo />
      </section>

      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>Portfolio</span>
          <h1>Satish Kumar Chaubey</h1>
          <p className={styles.title}>Full Stack Developer & Prompt Engineer (React | Next.js | FastAPI | Blockchain | NodeJS | NestJS | LLM APIs)</p>
          <p className={styles.summary}>
            Frontend-heavy Full Stack Developer with 2.9+ years of experience building scalable, high-performance web
            applications. Strong in dashboard engineering, API integration, payment systems, and SaaS/fintech products.
          </p>
          <div className={styles.meta}>
            <span>Ghaziabad, Uttar Pradesh, India</span>
            <span>8299805407</span>
            <span>satishchaubey02@gmail.com</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Technical Skills</h2>
        <div className={styles.skillTree}>
          <div className={styles.treeRoot}>Technical Skills</div>
          <ul className={styles.treeBranches}>
            {(Object.keys(skills) as Array<keyof typeof skills>).map((category) => (
              <li key={category} className={styles.treeNode}>
                <h3>{skillLabels[category]}</h3>
                <ul className={styles.treeLeaves}>
                  {skills[category].map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.experienceSteps}`}>
        <h2>Professional Experience</h2>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <article key={`${exp.company}-${exp.period}`} className={styles.expCard}>
              <span className={styles.stepBadge}>Step {index + 1}</span>
              <header>
                <h3>{exp.role}</h3>
                <strong>{exp.company}</strong>
                <p>{exp.location} | {exp.period}</p>
              </header>
              <ul>
                {exp.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.threeSection}`}>
        <h2>Freelance Works</h2>
        <div className={styles.projects}>
          {freelanceWorks.map((project) => (
            <article key={project.name} className={styles.tiltCard}>
              <h3>{project.name}</h3>
              <p className={styles.projectRole}>{project.role}</p>
              <div className={styles.stackTags}>
                {project.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <ul>
                {project.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.footerGrid}>
        <article>
          <h2>Education</h2>
          <p>Bachelor of Computer Applications (BCA)</p>
          <p>ITM College of Management, Gorakhpur</p>
          <p>2019 - 2021</p>
        </article>
        <article>
          <h2>Certification</h2>
          <p>MERN Stack Developer Certification</p>
        </article>
        <article>
          <h2>Interests</h2>
          <p>Exploring Emerging Technologies, Traveling, Cricket</p>
        </article>
      </section>
    </main>
  );
}
