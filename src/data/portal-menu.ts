import { FiArchive as Archive, FiBookOpen as BookOpen, FiRss as Rss, FiShoppingBag as ShoppingBag, FiUsers as Users } from "react-icons/fi";
import { GiBrain as Brain } from "react-icons/gi";
import { RiChatHeartLine as MessageCircleHeart } from "react-icons/ri";

export const portalMenu = [
  {
    title: "Profil HIMATIKA",
    description: "Kenali sejarah, visi, misi, dan struktur organisasi.",
    icon: BookOpen,
    href: "/tentang-kami",
  },
  {
    title: "Divisi",
    description: "Jelajahi bidang dan divisi yang menggerakkan organisasi.",
    icon: Users,
    href: "/divisi",
  },
  {
    title: "Blog",
    description: "Informasi terkini dan cerita seputar mahasiswa matematika.",
    icon: Rss,
    href: "/blog",
  },
  {
    title: "MathQuiz",
    description: "Uji kemampuan matematikamu lewat kuis interaktif.",
    icon: Brain,
    href: "/mathquiz",
  },
  {
    title: "RAMA",
    description: "Rumah Aspirasi Mahasiswa Matematika.",
    icon: MessageCircleHeart,
    href: "/anggota/rama",
  },
  {
    title: "Arsip",
    description: "Dokumen dan publikasi organisasi.",
    icon: Archive,
    href: "/arsip",
  },
  {
    title: "Koperasi",
    description: "Layanan koperasi mahasiswa.",
    icon: ShoppingBag,
    href: "/anggota/koperasi",
  },
] as const;