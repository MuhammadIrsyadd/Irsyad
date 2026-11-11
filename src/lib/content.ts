// All portfolio content lives here so it can be changed without touching
// the components.

export const profile = {
  name: "Muh. Irsyad Dwi Kurniawan",
  shortName: "Muh Irsyad",
  role: "Computer Science Graduate · Full-Stack & Mobile Developer",
  location: "Mojokerto, Indonesia",
  email: "muhammadirsyad258@gmail.com",
  phone: "+62 813-3100-2068",
  linkedin: "https://www.linkedin.com/in/muh-irsyad-dwi-kurniawan/",
  tagline: "Specializing in Web (Laravel, Next.js) and Mobile (Kotlin), with a focus on scalability, efficiency and user-friendly interfaces.",
  summary:
    "Informatics graduate from UPN 'Veteran' Jawa Timur (GPA 3.93/4.00) with hands-on experience building ERP systems (Laravel) and mobile apps (Kotlin). Completed an internship at PT. INKA and intensive training at Bangkit Academy. Skilled in problem-solving, system optimization and collaborative development, delivering digital solutions that are efficient, measurable and impactful.",
  availability: "Open to work & collaboration",
};

export type HighlightItem = {
  icon: string;
  title: string;
  value: string;
  sub: string;
  accent: string;
};

export const overviewHighlights: HighlightItem[] = [
  {
    icon: "school",
    title: "Latest Education",
    value: "Bachelor's in Informatics",
    sub: "UPN 'Veteran' Jawa Timur · GPA 3.93/4.00",
    accent: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  },
  {
    icon: "work",
    title: "Industry Experience",
    value: "IT Intern @ PT. INKA",
    sub: "ERP Development & Bangkit Academy Cohort",
    accent: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
  {
    icon: "emoji_events",
    title: "Latest Achievement",
    value: "2nd Place, Web Competition",
    sub: "HIMATIFTA UNTAG Surabaya",
    accent: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  },
  {
    icon: "terminal",
    title: "Core Skills",
    value: "Web & Mobile Dev",
    sub: "Laravel, Next.js, Kotlin, System Optimization",
    accent: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  },
];

export type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  maxGpa: string;
  thesis: string;
  coursework: string[];
  description: string;
};

export const educationHistory: EducationItem[] = [
  {
    institution: "UPN \"Veteran\" Jawa Timur",
    degree: "Bachelor of Computer Science (Informatics)",
    period: "Sep 2021 – Dec 2025",
    gpa: "3.93",
    maxGpa: "4.00",
    thesis: "Visual Computing",
    coursework: [
      "Advanced Programming",
      "Algorithms and Programming",
      "Interface Design",
      "Object Oriented Programming",
      "Machine Learning",
    ],
    description:
      "Graduated with a Bachelor of Computer Science, Cum Laude (GPA 3.93/4.00). Focused on software engineering, intuitive interface design and visual computing.",
  },
];

export type AwardItem = {
  title: string;
  issuer: string;
  period: string;
  description: string;
  skills: string[];
};

export const awards: AwardItem[] = [
  {
    title: "2nd Place, Web Competition",
    issuer: "HIMATIFTA UNTAG Surabaya",
    period: "March 2022",
    description:
      "Designed and built a responsive company profile website (minimum 3 pages), collaborating as a team to implement an adaptive, interactive interface.",
    skills: ["JavaScript", "CSS3", "Responsive Web Design"],
  },
];

export type JourneyItem = {
  year: string;
  period: string;
  title: string;
  company: string;
  type: string;
  description: string;
  bullets: string[];
  skills: string[];
};

export const journey: JourneyItem[] = [
  {
    year: "2024",
    period: "Feb 2024 – Jul 2024",
    title: "Information Technology Intern",
    company: "PT. INKA (Persero)",
    type: "Internship",
    description:
      "Developed and maintained the company's ERP web application with Laravel to improve operational efficiency.",
    bullets: [
      "Developed and maintained the company's ERP web application using the Laravel framework.",
      "Worked with cross-functional teams to design and implement user-friendly web interfaces.",
      "Optimized system features to make daily operations more efficient and easier for end users.",
      "Assisted with debugging, troubleshooting and fixing live system modules.",
      "Communicated effectively within the team to ensure all project requirements were implemented correctly.",
    ],
    skills: ["Laravel", "PHP", "ERP Systems", "Troubleshooting", "Cross-Functional Team"],
  },
  {
    year: "2023–2024",
    period: "Aug 2023 – Jan 2024",
    title: "Mobile Development Cohort",
    company: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka",
    type: "Independent Study",
    description:
      "Intensive, industry-scale Android development training backed by Google.",
    bullets: [
      "Learned and applied modern Kotlin fundamentals, the SOLID paradigm and Jetpack Compose.",
      "Built Android apps progressively through the Beginner, Fundamental and Intermediate levels.",
      "Applied Clean Architecture principles and RESTful API integration.",
    ],
    skills: ["Kotlin", "Jetpack Compose", "Android Studio", "SOLID Paradigm", "REST APIs"],
  },
  {
    year: "2021–Present",
    period: "2021 – Present",
    title: "Full-Stack & Creative Development",
    company: "Independent & Open Source Exploration",
    type: "Projects & Exploration",
    description:
      "Ongoing exploration in building modern web apps, a desktop simulator and interactive interface design.",
    bullets: [
      "Built personal projects such as Liquid Glass OS with Next.js, Framer Motion and Tailwind CSS.",
      "Explored modern frontend integration, REST APIs, state management and high-end visual design.",
    ],
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
];

export type OrganizationItem = {
  period: string;
  role: string;
  organization: string;
  bullets: string[];
  highlights?: string;
};

export const organizations: OrganizationItem[] = [
  {
    period: "Feb 2023 – May 2024",
    role: "Head of Event Division",
    organization: "Veteran Esports",
    bullets: [
      "Led and supervised 8 division members in planning, delegating and running all events.",
      "Oversaw 4 large-scale events and 5 activity programs, and evaluated committee performance and event outcomes.",
    ],
    highlights: "Led an event division at a regional, inter-university scale.",
  },
  {
    period: "Apr 2022 – Feb 2023",
    role: "Staff of Communication and Information",
    organization: "HIMATIFA (Informatics Student Association)",
    bullets: [
      "Created creative content, feed posts and informative stories for HIMATIFA's official Instagram account.",
      "Managed social media publishing and actively handled student interactions and questions.",
    ],
    highlights: "Managed visual communication and social media for the student association.",
  },
  {
    period: "Dec 2021 – Jan 2023",
    role: "Staff of Event Division",
    organization: "Veteran Esports",
    bullets: [
      "Responsible for running activities smoothly and supporting the event chair at every event.",
      "Trusted as the main PIC for the major M4 World Championship Watch Party.",
    ],
  },
];

export type CommitteeItem = {
  period: string;
  role: string;
  event: string;
  organizer: string;
  description: string;
  impact: string;
};

export const committees: CommitteeItem[] = [
  {
    period: "Sep 2023 – Nov 2023",
    role: "Steering Committee",
    event: "VESDL Season 3",
    organizer: "Veteran Esports",
    description: "Provided supervision and strategic direction to the event chair when technical issues came up.",
    impact: "Successfully ran a 5-day hybrid event with 100 participants across 4 game titles.",
  },
  {
    period: "May 2023 – Aug 2023",
    role: "Steering Committee",
    event: "Veteran East Java",
    organizer: "Veteran Esports",
    description: "Guided and monitored the event chair and the full committee for an offline East Java-wide tournament.",
    impact: "The event ran smoothly at BG Junction Surabaya with 160 participants (32 MLBB team slots).",
  },
  {
    period: "Jan 2023 – Feb 2023",
    role: "Steering Committee",
    event: "Doran Goes To Campus",
    organizer: "Veteran Esports",
    description: "Gave strategic guidance on planning, execution and evaluation of the event with the client.",
    impact: "Met the client's (Doran Gadget) event targets in 1 day with 160 participants.",
  },
  {
    period: "Oct 2023 – Nov 2023",
    role: "Staff Logistic",
    event: "PMCC 2023 (PUBG Mobile)",
    organizer: "Veteran Esports & Tencent Indonesia",
    description: "Prepared all logistics, stage setup, technical equipment and participant registration data.",
    impact: "The tournament and workshop ran smoothly with 80 participants, attended in person by Tencent Indonesia.",
  },
  {
    period: "Dec 2022 – Jan 2023",
    role: "PIC (Person In Charge)",
    event: "M4 Watch Party",
    organizer: "Veteran Esports & Moonton",
    description: "Acted as liaison between Moonton and the committee to align on regulations and venue readiness.",
    impact: "Successfully ran for 2 days at Hotel Harris, targeting 100 participants per day with a core team of 5.",
  },
  {
    period: "Nov 2022",
    role: "Head of Publication & Documentation",
    event: "Sapa Desa",
    organizer: "HIMATIFA",
    description: "Led photo/video documentation and publication materials during a community service program.",
    impact: "Publications went out on schedule and the program was fully documented.",
  },
  {
    period: "Jul 2022 – Aug 2022",
    role: "Publication & Documentation Staff",
    event: "Hampers HIMATIFA",
    organizer: "HIMATIFA",
    description: "Designed Instagram feed posts, merchandise and promotional videos for gift hampers with the team.",
    impact: "Raised awareness and supported smooth sales of the hamper packages.",
  },
];

// Design values (optional)
export const values = [
  {
    icon: "straighten",
    title: "Precision & Performance",
    description: "Careful architecture, clean code and efficient optimization on both web and mobile.",
  },
  {
    icon: "speed",
    title: "Scalable Solutions",
    description: "Building systems that are ready to grow and easy to maintain long term.",
  },
  {
    icon: "magic_button",
    title: "User Experience",
    description: "Interfaces that are intuitive and comfortable for end users.",
  },
  {
    icon: "hub",
    title: "Team Collaboration",
    description: "Active communication and cross-functional teamwork to hit project goals.",
  },
];

export type Skill = {
  category: string;
  items: string[];
};

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5/CSS3"],
  },
  {
    category: "Backend & ERP",
    items: ["Laravel", "PHP", "MySQL", "RESTful API", "System Optimization", "Blade"],
  },
  {
    category: "Mobile Development",
    items: ["Kotlin", "Jetpack Compose", "Android Studio", "MVVM Clean Architecture", "Retrofit", "SOLID Paradigm"],
  },
  {
    category: "Interactive & Canvas",
    items: ["HTML5 Canvas 2D", "Web Audio API", "Game Physics", "PWA", "GSAP"],
  },
  {
    category: "Tooling & Workflow",
    items: ["Git", "GitHub", "Figma", "Vite", "Vercel", "Cross-Functional Team"],
  },
];

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  url?: string;
  repo?: string;
  accent: "amber" | "violet" | "cyan" | "emerald" | "rose";
  image?: string;
  category?: string;
};

export const projects: Project[] = [
  {
    id: "tarot",
    name: "Arcana Mystica — Tarot Divination",
    tagline: "Modern Digital Divination & Tarot Exploration Platform",
    description:
      "An interactive modern divination platform that blends classic symbolism with an aesthetic, immersive digital interface. Features Daily Readings, a range of card Spreads, a complete encyclopedia of card meanings, a personal reflection journal, and cosmic alignments with zodiac constellations.",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Lucide Icons"],
    url: "https://tarot.muhirsyad.my.id",
    accent: "violet",
    image: "/images/projects/tarot.webp",
    category: "Interactive Web",
  },
  {
    id: "gigizi",
    name: "GIGIZI — Nutrition at Your Fingertips",
    tagline: "Nutrition Calculator & Digital Kitchen for Indonesian Food",
    description:
      "A practical nutrition calculator and education app tailored to local Indonesian food (Warteg, Tempe, Rendang and more). Features real-time calorie and macronutrient tracking, personalized daily recommendations, a 'Battle Gizi' comparison tool and an 'Apotek Alami' encyclopedia of natural remedies.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "PWA", "Web Vitals"],
    url: "https://gigizi.muhirsyad.my.id",
    accent: "emerald",
    image: "/images/projects/gigizi.webp",
    category: "Health & Utility",
  },
  {
    id: "2048",
    name: "QuadFuse 2048 ARCADE",
    tagline: "Cyberpunk / Synthwave Edition of the Classic 2048 Puzzle",
    description:
      "The 2048 number puzzle with a retro Synthwave and Cyberpunk arcade feel. Includes smooth swipe and keyboard (WASD / arrow) controls, move Undo, timer and move tracking, synthesized sound effects via the Web Audio API, and a locally saved leaderboard.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Web Audio API", "LocalStorage"],
    url: "https://2048.muhirsyad.my.id",
    accent: "cyan",
    image: "/images/projects/2048.webp",
    category: "Web Arcade Game",
  },
  {
    id: "brickbreaker",
    name: "Retro Bounce: The 25th Chamber",
    tagline: "Neon Retro Brick Breaker Arcade with 25 Stages",
    description:
      "A classic brick breaker arcade game in a modern retro style with 25 challenging levels. Built on Canvas 2D with ball bounce physics, dynamic neon explosion particles, varied brick durability, multi-frequency synthesized audio and Hi-Score tracking.",
    tech: ["React", "HTML5 Canvas 2D", "Web Audio API", "Game Physics"],
    url: "https://brickbreaker.muhirsyad.my.id",
    accent: "rose",
    image: "/images/projects/brickbreaker.webp",
    category: "Web Arcade Game",
  },
  {
    id: "penalty",
    name: "PenaltyZone — Soccer Penalty Shootout",
    tagline: "Interactive 2.5D Soccer Penalty Simulator",
    description:
      "An interactive soccer penalty shootout mini-game with swipe-to-shoot controls. Includes a dynamic goalkeeper, an animated crowd simulation, score and remaining-attempt tracking, and an end-of-game star rating.",
    tech: ["Vanilla JavaScript", "HTML5 Canvas", "Physics Engine", "CSS Animations"],
    url: "https://penalty.muhirsyad.my.id",
    accent: "emerald",
    image: "/images/projects/penalty.webp",
    category: "Mini-Game",
  },
  {
    id: "skyrise",
    name: "SKYRISE — Tower Stacker",
    tagline: "Build Your Legacy, One Floor at a Time",
    description:
      "A vertical arcade game about stacking the floors of a tower, testing your timing and focus. Features automatic block trimming when a placement is off, combo streak multipliers, floor height records and interactive audio.",
    tech: ["Vite", "React", "TypeScript", "Tailwind CSS", "Tabler Icons"],
    url: "https://skyrise.muhirsyad.my.id",
    accent: "amber",
    image: "/images/projects/skyrise.webp",
    category: "Web Arcade Game",
  },
  {
    id: "liquid-glass-os",
    name: "Liquid Glass Portfolio OS",
    tagline: "An interactive macOS desktop simulation: this portfolio website.",
    description:
      "A portfolio website wrapped as a desktop environment, complete with a window system, dock magnification, an interactive CLI terminal, Spotlight search (Ctrl+K) and liquid glass materials. Built from scratch with Next.js, Framer Motion and Zustand.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
    url: "https://muhirsyad.my.id",
    repo: "https://github.com/MuhammadIrsyadd/Irsyad",
    accent: "amber",
    image: "/images/projects/portfolio.webp",
    category: "Portfolio & OS Simulator",
  },
  {
    id: "inka-erp",
    name: "Enterprise ERP System — PT. INKA",
    tagline: "ERP system for the largest train manufacturer in Southeast Asia.",
    description:
      "Developed and maintained a Laravel-based ERP web application supporting the operations of PT. INKA (Persero). Covered user-friendly interface design, system module optimization, debugging and troubleshooting, and cross-division collaboration to keep operations efficient for end users.",
    tech: ["Laravel", "PHP", "MySQL", "REST API", "Blade"],
    accent: "violet",
    category: "Enterprise System",
  },
  {
    id: "bangkit-android",
    name: "Bangkit Capstone — Android Mobile App",
    tagline: "An industry-scale Android app from intensive training by Google, Tokopedia, Gojek & Traveloka.",
    description:
      "Built Android apps progressively from Beginner to Intermediate level as part of the Bangkit Academy 2023 program, applying Kotlin, Jetpack Compose, MVVM Clean Architecture and RESTful API integration, with an emphasis on the SOLID paradigm and measurable code quality.",
    tech: ["Kotlin", "Jetpack Compose", "Android Studio", "Retrofit", "MVVM"],
    accent: "cyan",
    category: "Mobile App",
  },
  {
    id: "web-competition",
    name: "Company Profile Website — 2nd Place",
    tagline: "A responsive company profile website, award winner at the HIMATIFTA UNTAG Surabaya Web Competition.",
    description:
      "Designed and built a responsive company profile website of at least 3 pages for a regional web competition, collaborating as a team on an adaptive, interactive and accessible interface. Won 2nd place among participants from across Surabaya.",
    tech: ["JavaScript", "CSS3", "HTML5", "Responsive Design"],
    accent: "amber",
    category: "Web Competition",
  },
];

export type Social = {
  id: "linkedin" | "instagram" | "github";
  label: string;
  handle: string;
  /** Leave empty until you drop in your real profile URL — an invented
   *  username could point to a stranger's real account, so this stays
   *  blank (shown as "not set" in the UI) instead of guessing. */
  url: string;
};

export const socials: Social[] = [
  { id: "github", label: "GitHub", handle: "@muhammadirsyadd", url: "https://github.com/MuhammadIrsyadd" },
  { id: "linkedin", label: "LinkedIn", handle: "Muh. Irsyad", url: "https://www.linkedin.com/in/muh-irsyad-dwi-kurniawan/" },
  { id: "instagram", label: "Instagram", handle: "@irsyad_dwi", url: "https://www.instagram.com/irsyad_dwi/" },
];

export type CaseStudy = {
  id: string;
  projectId: string; // matches a Project.id in `projects` above
  title: string;
  problem: string;
  approach: string;
  result: string;
  tags: string[];
};

// Placeholder case studies — swap these in for the real story behind each
// project (what was the actual problem, why you made the decisions you
// made, what changed as a result). This is usually what convinces a
// recruiter or client more than the finished screenshot does.
export const caseStudies: CaseStudy[] = [
  {
    id: "liquid-glass-os-story",
    projectId: "liquid-glass-os",
    title: "Why is this portfolio wrapped as a 'desktop OS'?",
    problem:
      "Most developer portfolios look the same: a big hero, 3 feature cards, testimonials. They're hard to tell apart and easy to forget the moment the tab closes.",
    approach:
      "Instead of a scrolling page, I built a full macOS desktop simulation: window system, dock magnification, liquid glass materials, even a boot and lock screen. Each part of the portfolio is an 'app' you open yourself, not a section you scroll past.",
    result:
      "The result is something people want to explore rather than skim and leave. Interaction details like dock magnification, the genie animation and the reactive avatar are part of the story, not decoration.",
    tags: ["Next.js", "Framer Motion", "Zustand", "Design System"],
  },
  {
    id: "inka-erp-story",
    projectId: "inka-erp",
    title: "What did I learn from working on a large state-owned company's ERP?",
    problem:
      "PT. INKA is the largest train manufacturer in Southeast Asia. Its ERP has to handle cross-division operations with complex data and users from many technical backgrounds. The challenge: how do you build new features without breaking modules already in use, while keeping the interface easy for non-technical users?",
    approach:
      "I joined as an IT Intern and worked directly in the real development cycle. Each new feature started with understanding end users' needs, then interface design, then code. Debugging was systematic, tracing logs and isolating modules. Regular communication with cross-functional teams was key to matching implementation with business needs.",
    result:
      "Optimized several system modules that previously had performance bottlenecks. User feedback showed the redesigned interfaces were more intuitive. The experience taught me the importance of code documentation and clear technical communication in a large team.",
    tags: ["Laravel", "PHP", "ERP", "Team Collaboration", "System Optimization"],
  },
  {
    id: "bangkit-android-story",
    projectId: "bangkit-android",
    title: "From zero to Intermediate Android Developer in 6 months at Bangkit Academy.",
    problem:
      "Bangkit Academy is an intensive 6-month program designed by Google, Tokopedia, Gojek and Traveloka to produce industry-ready developers. The challenge wasn't just learning Kotlin syntax, but understanding how to build apps that are truly scalable, maintainable and up to industry standards in very limited time.",
    approach:
      "I started with modern Kotlin fundamentals, then gradually built up Jetpack Compose, MVVM Clean Architecture and REST API integration with Retrofit. Every topic was put into practice in real projects, and SOLID principles were applied consistently to keep code easy to test and extend.",
    result:
      "Completed the program and earned the official Bangkit Academy certification. The team's Capstone Project was built and presented to a review panel from Google and industry partners.",
    tags: ["Kotlin", "Jetpack Compose", "Clean Architecture", "SOLID", "Teamwork"],
  },
  {
    id: "gigizi-story",
    projectId: "gigizi",
    title: "Making everyday Indonesian nutrition practical with GIGIZI.",
    problem:
      "Most calorie and nutrition trackers are built around Western food databases, making it tedious for Indonesians to log everyday meals like Warteg dishes, Tempe, Soto or Rendang.",
    approach:
      "I built GIGIZI as a fast, PWA-ready web application centered on local Indonesian dishes. Beyond macro calculation, I added interactive features like 'Battle Gizi' to compare two foods head-to-head and 'Apotek Alami' for traditional herbal insights.",
    result:
      "Delivered a responsive, mobile-friendly nutrition companion with instant client-side search, high Core Web Vitals scores and zero friction for daily meal planning.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "PWA", "Health Tech"],
  },
  {
    id: "tarot-story",
    projectId: "tarot",
    title: "Designing an atmospheric, tactile digital reading experience in Arcana Mystica.",
    problem:
      "Digital divination and card apps often feel flat and mechanical—just random number generators behind a button—losing the sense of ritual and visual symbolism.",
    approach:
      "Using Next.js and Framer Motion, I choreographed card shuffling, flip physics, multi-card spread layouts and a searchable encyclopedia of card meanings paired with a local reflection journal.",
    result:
      "Created an immersive, cohesive web experience that showcases advanced UI choreography, state transitions and thematic design consistency.",
    tags: ["Next.js", "React", "Framer Motion", "Interactive UI", "Design"],
  },
  {
    id: "2048-story",
    projectId: "2048",
    title: "Reimagining 2048 as a zero-asset Synthwave arcade cabinet.",
    problem:
      "How do you make a classic number puzzle feel like a tactile retro arcade cabinet on both desktop keyboards and mobile touchscreens without bloating the bundle with audio files?",
    approach:
      "I wrote a deterministic grid reducer with full undo history, paired touch swipe detection with WASD/arrow controls, and synthesized every merge and combo sound effect in real time using the browser's Web Audio API.",
    result:
      "An instant-loading arcade game with 60fps tile animations, synthesized retro audio and persistent local high-score leaderboards.",
    tags: ["React", "TypeScript", "Web Audio API", "Game Logic", "Tailwind CSS"],
  },
  {
    id: "brickbreaker-story",
    projectId: "brickbreaker",
    title: "Building a 25-stage Canvas 2D physics & particle engine in Retro Bounce.",
    problem:
      "DOM-based animations struggle when dozens of bricks, multi-ball collisions and hundreds of neon explosion particles update simultaneously every frame.",
    approach:
      "I implemented a custom requestAnimationFrame game loop on HTML5 Canvas 2D with swept collision detection, variable brick durability across 25 handcrafted stages, particle emitters and multi-frequency Web Audio synth feedback.",
    result:
      "Smooth 60fps arcade gameplay across 25 progressive stages with responsive paddle physics and zero external game-engine dependencies.",
    tags: ["HTML5 Canvas 2D", "React", "Game Physics", "Web Audio API"],
  },
  {
    id: "web-competition-story",
    projectId: "web-competition",
    title: "2nd Place at a Web Competition: lessons from my first contest.",
    problem:
      "The HIMATIFTA UNTAG Surabaya Web Competition required participants to build a responsive company profile website of at least 3 pages in limited time. The challenge: how do you make a site that isn't just functional, but also stands out visually and offers a good user experience?",
    approach:
      "The team agreed on a clear division of tasks right away. We prioritized mobile-first responsive design because the judges would test on various devices. Each page went through several iterations based on reviews between team members.",
    result:
      "We won 2nd place among all participants. The experience became an important foundation for understanding teamwork, managing time under pressure and making design decisions that are both fast and sound.",
    tags: ["JavaScript", "CSS3", "Responsive Design", "Team Collaboration"],
  },
];

export const terminalSkillDump = `$ whoami
${profile.name.toLowerCase().replace(/\s+/g, "-")}

$ cat role.txt
${profile.role} — ${profile.tagline}

$ ls skills/
${skills.map((s) => s.category.toLowerCase().replace(/\s+/g, "-")).join("  ")}

$ cat contact.txt
email:   ${profile.email}
status:  ${profile.availability}
`;
