// Semua konten portofolio dipusatkan di sini supaya gampang diganti
// tanpa menyentuh komponen. Isi placeholder di bawah — tinggal edit
// teks & data-nya sesuai dirimu.

export const profile = {
  name: "Muh Irsyad",
  role: "Creative Developer",
  location: "Indonesia",
  email: "muhammadirsyad258@gmail.com",
  tagline: "Merakit interface yang terasa hidup, satu piksel pada satu waktu.",
  availability: "Terbuka untuk kolaborasi & freelance",
};

export const journey = [
  {
    year: "Sekarang",
    title: "Membangun proyek personal & eksperimen UI",
    description:
      "Fokus eksplorasi interaksi non-generic — animasi, material kaca, dan detail kecil yang bikin produk terasa 'dibuat oleh manusia', bukan template.",
  },
  {
    year: "Sebelumnya",
    title: "Belajar & mengasah fundamental",
    description:
      "Membangun kebiasaan menulis kode yang rapi, mempelajari desain sistem, dan mencoba banyak stack front-end sampai ketemu yang paling nyaman.",
  },
  {
    year: "Awal mula",
    title: "Jatuh cinta sama layar yang bisa 'diajak ngobrol'",
    description:
      "Ketertarikan ke teknologi berawal dari rasa penasaran: gimana caranya sebuah layar bisa terasa responsif dan menyenangkan untuk disentuh.",
  },
];

export const values = [
  {
    icon: "straighten",
    title: "Presisi Piksel",
    description:
      "Detail kecil — spacing, easing, sudut lengkung — diperlakukan serius karena itu yang paling terasa oleh pengguna.",
  },
  {
    icon: "speed",
    title: "Performa Dulu",
    description:
      "Animasi secantik apa pun percuma kalau patah-patah. GPU-friendly, 60fps jadi standar minimum.",
  },
  {
    icon: "magic_button",
    title: "Kesenangan Taktis",
    description:
      "Interaksi yang punya 'rasa' — micro-feedback yang bikin orang mau klak-klik lebih lama dari yang seharusnya.",
  },
  {
    icon: "hub",
    title: "Sistem, Bukan Sekadar Halaman",
    description:
      "Setiap komponen dibangun supaya reusable dan konsisten, bukan tempelan satu kali pakai.",
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
    id: "project-two",
    name: "Nama Proyek #2",
    tagline: "Ringkasan singkat satu baris tentang proyek ini.",
    description:
      "Ganti deskripsi ini dengan cerita singkat tentang masalah yang diselesaikan, keputusan desain yang menarik, dan hasil akhirnya.",
    tech: ["React", "Node.js"],
    accent: "violet",
  },
  {
    id: "project-three",
    name: "Nama Proyek #3",
    tagline: "Ringkasan singkat satu baris tentang proyek ini.",
    description:
      "Ganti deskripsi ini dengan cerita singkat tentang masalah yang diselesaikan, keputusan desain yang menarik, dan hasil akhirnya.",
    tech: ["TypeScript", "Tailwind CSS"],
    accent: "cyan",
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
