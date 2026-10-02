// Semua konten portofolio dipusatkan di sini supaya gampang diganti
// tanpa menyentuh komponen. Isi placeholder di bawah — tinggal edit
// teks & data-nya sesuai dirimu.

export const profile = {
  name: "Muh. Irsyad Dwi Kurniawan",
  shortName: "Muh Irsyad",
  role: "Computer Science Graduate · Full-Stack & Mobile Developer",
  location: "Mojokerto, Indonesia",
  email: "muhammadirsyad258@gmail.com",
  phone: "+62 813-3100-2068",
  linkedin: "https://www.linkedin.com/in/muh-irsyad-dwi-kurniawan/",
  tagline: "Spesialisasi Web (Laravel, Next.js) & Mobile (Kotlin). Mengutamakan skalabilitas, efisiensi, dan antarmuka ramah pengguna.",
  summary:
    "Lulusan S1 Informatika UPN 'Veteran' Jawa Timur (IPK 3.93/4.00) dengan pengalaman praktis dalam pengembangan sistem ERP (Laravel) dan aplikasi mobile (Kotlin). Memiliki rekam jejak magang di PT. INKA serta pelatihan intensif di Bangkit Academy. Terampil dalam problem-solving, optimasi sistem, dan pengembangan kolaboratif untuk menghadirkan solusi digital yang efisien, terukur, dan berdampak.",
  availability: "Terbuka untuk peluang kerja & kolaborasi",
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
    title: "Pendidikan Terakhir",
    value: "S1 Informatika",
    sub: "UPN 'Veteran' Jawa Timur · IPK 3.93/4.00",
    accent: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  },
  {
    icon: "work",
    title: "Pengalaman Industri",
    value: "IT Intern @ PT. INKA",
    sub: "Pengembangan ERP & Bangkit Academy Cohort",
    accent: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
  {
    icon: "emoji_events",
    title: "Prestasi Terkini",
    value: "Juara 2 Web Competition",
    sub: "HIMATIFTA UNTAG Surabaya",
    accent: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  },
  {
    icon: "terminal",
    title: "Keahlian Utama",
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
    degree: "Bachelor of Computer Science (S1 Informatika)",
    period: "Sept 2021 – Des 2025",
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
      "Menyelesaikan studi Sarjana Komputer dengan predikat Dengan Pujian (Cumlaude, IPK 3.93/4.00). Mendalami rekayasa perangkat lunak, perancangan antarmuka intuitif, dan komputasi visual.",
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
    title: "Juara 2 Web Competition",
    issuer: "HIMATIFTA UNTAG Surabaya",
    period: "Maret 2022",
    description:
      "Merancang dan mengembangkan website profil perusahaan responsif (minimum 3 halaman). Berkolaborasi dalam tim menangani implementasi coding antarmuka yang adaptif dan interaktif.",
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
    period: "Feb 2024 – Juli 2024",
    title: "Information Technology Intern",
    company: "PT. INKA (Persero)",
    type: "Internship",
    description:
      "Pengembangan dan pemeliharaan aplikasi web ERP perusahaan dengan framework Laravel untuk efisiensi operasional.",
    bullets: [
      "Mengembangkan dan memelihara aplikasi web ERP perusahaan menggunakan framework Laravel.",
      "Berkolaborasi dengan tim lintas fungsi untuk merancang dan mengimplementasikan antarmuka web yang user-friendly.",
      "Mengoptimalkan fitur sistem demi meningkatkan efisiensi dan kemudahan operasional pengguna akhir.",
      "Membantu proses debugging, troubleshooting, dan perbaikan modul-modul sistem berjalan.",
      "Menjalin komunikasi efektif dalam tim guna memastikan seluruh kebutuhan proyek terimplementasi dengan tepat.",
    ],
    skills: ["Laravel", "PHP", "ERP Systems", "Troubleshooting", "Cross-Functional Team"],
  },
  {
    year: "2023–2024",
    period: "Agu 2023 – Jan 2024",
    title: "Mobile Development Cohort",
    company: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka",
    type: "Studi Independen",
    description:
      "Pelatihan intensif pengembangan aplikasi mobile Android berskala industri yang didukung oleh Google.",
    bullets: [
      "Mempelajari dan menerapkan fundamental pemrograman modern Kotlin, SOLID Paradigm, dan Jetpack Compose.",
      "Membangun aplikasi Android secara bertahap: level Beginner, Fundamental, hingga Intermediate.",
      "Menerapkan prinsip arsitektur perangkat lunak yang bersih (Clean Architecture) dan integrasi RESTful API.",
    ],
    skills: ["Kotlin", "Jetpack Compose", "Android Studio", "SOLID Paradigm", "REST APIs"],
  },
  {
    year: "2021–Sekarang",
    period: "2021 – Sekarang",
    title: "Full-Stack & Creative Development",
    company: "Independent & Open Source Exploration",
    type: "Proyek & Eksplorasi",
    description:
      "Eksplorasi berkesinambungan dalam membangun aplikasi web modern, desktop simulator, dan desain antarmuka interaktif.",
    bullets: [
      "Membangun proyek personal seperti Liquid Glass OS dengan Next.js, Framer Motion, dan Tailwind CSS.",
      "Mengeksplorasi integrasi modern frontend, REST API, state management, dan estetika visual tingkat tinggi.",
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
    period: "Feb 2023 – Mei 2024",
    role: "Head of Event Division",
    organization: "Veteran Esports",
    bullets: [
      "Memimpin dan mengawasi 8 anggota divisi dalam perencanaan, pembagian tanggung jawab, dan pelaksanaan seluruh event.",
      "Memonitor jalannya 4 event berskala besar dan 5 agenda kegiatan, serta mengevaluasi performa panitia dan capaian acara.",
    ],
    highlights: "Kepemimpinan divisi event berskala regional & lintas universitas.",
  },
  {
    period: "Apr 2022 – Feb 2023",
    role: "Staff of Communication and Information",
    organization: "HIMATIFA (Himpunan Mahasiswa Informatika)",
    bullets: [
      "Merancang konten kreatif, feeds, dan stories informatif untuk akun media sosial resmi Instagram HIMATIFA.",
      "Mengelola publikasi media sosial dan aktif melayani interaksi maupun pertanyaan dari mahasiswa.",
    ],
    highlights: "Manajemen komunikasi visual & media sosial himpunan jurusan.",
  },
  {
    period: "Des 2021 – Jan 2023",
    role: "Staff of Event Division",
    organization: "Veteran Esports",
    bullets: [
      "Bertanggung jawab atas kelancaran berbagai agenda kegiatan dan mendampingi ketua pelaksana di setiap acara.",
      "Dipercaya menjadi PIC utama untuk agenda besar M4 World Championship Watch Party.",
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
    period: "Sept 2023 – Nov 2023",
    role: "Steering Committee",
    event: "VESDL Season 3",
    organizer: "Veteran Esports",
    description: "Supervisi dan arahan strategis kepada ketua pelaksana saat menghadapi kendala teknis.",
    impact: "Sukses menyelenggarakan hybrid event 5 hari dengan 100 peserta dari 4 cabang game.",
  },
  {
    period: "Mei 2023 – Agu 2023",
    role: "Steering Committee",
    event: "Veteran East Java",
    organizer: "Veteran Esports",
    description: "Mengarahkan dan memonitor ketua pelaksana serta seluruh panitia dalam turnamen offline se-Jawa Timur.",
    impact: "Event berlangsung lancar di BG Junction Surabaya, diikuti 160 peserta (32 slot tim MLBB).",
  },
  {
    period: "Jan 2023 – Feb 2023",
    role: "Steering Committee",
    event: "Doran Goes To Campus",
    organizer: "Veteran Esports",
    description: "Memberikan panduan strategis dalam perencanaan, eksekusi, dan evaluasi kegiatan bersama klien.",
    impact: "Sukses memenuhi target event klien (Doran Gadget) dalam 1 hari dengan 160 peserta.",
  },
  {
    period: "Okt 2023 – Nov 2023",
    role: "Staff Logistic",
    event: "PMCC 2023 (PUBG Mobile)",
    organizer: "Veteran Esports & Tencent Indonesia",
    description: "Mempersiapkan seluruh kebutuhan logistik, tata panggung, sarana teknis, serta data registrasi peserta.",
    impact: "Event turnamen & workshop berjalan lancar dengan 80 peserta, dihadiri langsung oleh Tencent Indonesia.",
  },
  {
    period: "Des 2022 – Jan 2023",
    role: "PIC (Person In Charge)",
    event: "M4 Watch Party",
    organizer: "Veteran Esports & Moonton",
    description: "Liaison antara Moonton dan panitia untuk memastikan keselarasan regulasi dan kesiapan venue.",
    impact: "Event berjalan sukses di Hotel Harris selama 2 hari dengan target 100 peserta per hari bersama tim inti 5 orang.",
  },
  {
    period: "Nov 2022",
    role: "Head of Pubdok",
    event: "Sapa Desa",
    organizer: "HIMATIFA",
    description: "Memimpin dokumentasi foto/video dan materi publikasi selama kegiatan pengabdian masyarakat.",
    impact: "Distribusi publikasi berjalan teratur dan terdokumentasi lengkap.",
  },
  {
    period: "Juli 2022 – Agu 2022",
    role: "Staff Pubdok",
    event: "Hampers HIMATIFA",
    organizer: "HIMATIFA",
    description: "Merancang desain feed Instagram, merchandise, dan video promosi hampers bersama tim.",
    impact: "Peningkatan awareness dan kelancaran penjualan paket hampers.",
  },
];

// Nilai filosofis desain (opsional / pelengkap)
export const values = [
  {
    icon: "straighten",
    title: "Presisi & Performa",
    description: "Detail arsitektur, clean code, serta optimasi efisiensi pada sisi web maupun mobile.",
  },
  {
    icon: "speed",
    title: "Solusi Skalabel",
    description: "Membangun sistem yang siap berkembang dan mudah dipelihara jangka panjang.",
  },
  {
    icon: "magic_button",
    title: "User Experience",
    description: "Antarmuka yang intuitif dan nyaman digunakan oleh pengguna akhir.",
  },
  {
    icon: "hub",
    title: "Kolaborasi Tim",
    description: "Komunikasi aktif dan kerja sama lintas fungsi untuk mencapai target proyek.",
  },
];

export type Skill = {
  category: string;
  items: string[];
};

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Interaksi & Animasi",
    items: ["Framer Motion", "GSAP", "CSS Animations", "Canvas/WebGL dasar"],
  },
  {
    category: "Tooling",
    items: ["Git", "Figma", "Vite", "Vercel", "ESLint/Prettier"],
  },
  {
    category: "Belajar Sekarang",
    items: ["Three.js", "React Three Fiber", "Shader (GLSL) dasar"],
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
  accent: "amber" | "violet" | "cyan";
};

export const projects: Project[] = [
  {
    id: "liquid-glass-os",
    name: "Liquid Glass Portfolio OS",
    tagline: "Portofolio ini sendiri — simulasi desktop macOS.",
    description:
      "Website portofolio yang dibungkus sebagai desktop environment lengkap dengan window system, dock magnify, dan material liquid glass. Dibangun dari nol dengan Next.js, Framer Motion, dan Zustand.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"],
    accent: "amber",
  },
  {
    id: "inka-erp",
    name: "Enterprise ERP System — PT. INKA",
    tagline: "Sistem ERP perusahaan manufaktur kereta api terbesar di Asia Tenggara.",
    description:
      "Pengembangan dan pemeliharaan aplikasi web ERP berbasis Laravel untuk mendukung operasional PT. INKA (Persero). Mencakup perancangan antarmuka user-friendly, optimasi modul sistem, debugging & troubleshooting, serta kolaborasi lintas divisi untuk memastikan efisiensi operasional pengguna akhir.",
    tech: ["Laravel", "PHP", "MySQL", "REST API", "Blade"],
    accent: "violet",
  },
  {
    id: "bangkit-android",
    name: "Bangkit Capstone — Android Mobile App",
    tagline: "Aplikasi Android skala industri hasil pelatihan intensif Google, Tokopedia, Gojek & Traveloka.",
    description:
      "Membangun aplikasi Android secara bertahap dari level Beginner hingga Intermediate sebagai bagian dari program Bangkit Academy 2023. Menerapkan Kotlin, Jetpack Compose, MVVM Clean Architecture, dan integrasi RESTful API. Menekankan prinsip SOLID Paradigm dan kualitas kode yang terukur.",
    tech: ["Kotlin", "Jetpack Compose", "Android Studio", "Retrofit", "MVVM"],
    accent: "cyan",
  },
  {
    id: "web-competition",
    name: "Company Profile Website — Juara 2",
    tagline: "Website profil perusahaan responsif pemenang Web Competition HIMATIFTA UNTAG Surabaya.",
    description:
      "Merancang dan mengembangkan website profil perusahaan responsif minimal 3 halaman dalam kompetisi web tingkat regional. Berkolaborasi dalam tim untuk mengimplementasikan antarmuka yang adaptif, interaktif, dan memenuhi standar aksesibilitas. Berhasil meraih Juara 2 dari peserta se-Surabaya.",
    tech: ["JavaScript", "CSS3", "HTML5", "Responsive Design"],
    accent: "amber",
  },
];

export type Social = {
  id: "linkedin" | "instagram" | "github";
  label: string;
  handle: string;
  /** Leave empty until you drop in your real profile URL — an invented
   *  username could point to a stranger's real account, so this stays
   *  blank (shown as "belum diisi" in the UI) instead of guessing. */
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
    title: "Kenapa portofolio ini dibungkus jadi 'desktop OS'?",
    problem:
      "Portofolio developer kebanyakan bentuknya sama: hero besar, 3 kartu fitur, testimonial. Susah dibedakan satu sama lain, dan gampang dilupakan begitu tab-nya ditutup.",
    approach:
      "Daripada halaman yang di-scroll, aku bikin simulasi desktop macOS penuh — window system, dock magnify, material liquid glass, sampai boot & lock screen. Setiap bagian portofolio jadi 'aplikasi' yang dibuka sendiri, bukan section yang dilewatin.",
    result:
      "Hasilnya jadi sesuatu yang orang mau eksplorasi, bukan cuma scroll cepat lalu pergi. Detail interaksi — dock magnify, animasi genie saat window ditutup, avatar yang bereaksi — jadi bagian dari cerita, bukan dekorasi tempelan.",
    tags: ["Next.js", "Framer Motion", "Zustand", "Design System"],
  },
  {
    id: "inka-erp-story",
    projectId: "inka-erp",
    title: "Belajar apa dari mengerjakan ERP perusahaan BUMN skala besar?",
    problem:
      "PT. INKA adalah produsen kereta api terbesar di Asia Tenggara. Sistem ERP yang digunakan harus menangani operasional lintas divisi dengan data yang kompleks dan pengguna dari berbagai latar belakang teknis. Tantangannya: bagaimana membangun fitur baru tanpa merusak modul lain yang sudah berjalan, sekaligus membuat antarmuka yang mudah dipakai oleh pengguna non-teknis?",
    approach:
      "Bergabung sebagai IT Intern dan langsung terlibat di development cycle nyata. Setiap fitur baru diawali dengan pemahaman kebutuhan pengguna akhir, lalu dirancang antarmukanya sebelum masuk ke koding. Debugging dilakukan secara sistematis dengan menelusuri log dan isolasi modul. Komunikasi rutin dengan tim lintas fungsi jadi kunci agar implementasi sesuai kebutuhan bisnis.",
    result:
      "Berhasil mengoptimalkan beberapa modul sistem yang sebelumnya memiliki bottleneck performa. Antarmuka yang dirancang ulang terbukti lebih intuitif berdasarkan feedback pengguna. Pengalaman ini mengajarkan pentingnya dokumentasi kode dan komunikasi teknis yang jelas dalam tim besar.",
    tags: ["Laravel", "PHP", "ERP", "Team Collaboration", "System Optimization"],
  },
  {
    id: "bangkit-android-story",
    projectId: "bangkit-android",
    title: "Dari nol ke Intermediate Android Developer dalam 6 bulan di Bangkit Academy.",
    problem:
      "Bangkit Academy adalah program intensif 6 bulan yang dirancang Google, Tokopedia, Gojek, dan Traveloka untuk mencetak developer siap industri. Tantangannya bukan sekadar belajar syntax Kotlin, tapi memahami cara membangun aplikasi yang benar-benar scalable, maintainable, dan sesuai standar industri dalam waktu yang sangat terbatas.",
    approach:
      "Mulai dari fundamental Kotlin modern, lalu secara bertahap membangun pemahaman tentang Jetpack Compose, MVVM Clean Architecture, dan integrasi REST API dengan Retrofit. Setiap materi langsung dipraktikkan dalam proyek nyata. Prinsip SOLID diterapkan konsisten agar kode mudah diuji dan dikembangkan.",
    result:
      "Berhasil menyelesaikan program dengan status lulus dan memperoleh sertifikasi resmi Bangkit Academy. Capstone Project tim berhasil dibangun dan dipresentasikan kepada panel reviewer dari Google dan mitra industri.",
    tags: ["Kotlin", "Jetpack Compose", "Clean Architecture", "SOLID", "Teamwork"],
  },
  {
    id: "web-competition-story",
    projectId: "web-competition",
    title: "Juara 2 Web Competition: Pelajaran dari kompetisi pertama.",
    problem:
      "Kompetisi Web HIMATIFTA UNTAG Surabaya mengharuskan peserta membangun website profil perusahaan responsif minimal 3 halaman dalam waktu terbatas. Tantangannya: bagaimana membuat website yang tidak hanya fungsional tapi juga secara visual unggul dan memberikan user experience yang baik?",
    approach:
      "Tim langsung menyepakati pembagian tugas yang jelas. Kami prioritaskan mobile-first responsive design karena juri akan menguji di berbagai perangkat. Setiap halaman diiterasi beberapa kali berdasarkan saling review antar anggota tim.",
    result:
      "Berhasil meraih Juara 2 dari seluruh peserta kompetisi. Pengalaman ini menjadi fondasi penting dalam memahami kolaborasi tim, manajemen waktu dalam tekanan, dan cara membuat keputusan desain yang cepat namun tepat.",
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
