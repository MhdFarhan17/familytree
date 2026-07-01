"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "en" | "id";

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

export const translations: Translations = {
  appTitle: { en: "SIRGA", id: "SIRGA" },
  home: { en: "Home", id: "Beranda" },
  about: { en: "About App", id: "Tentang Aplikasi" },
  admin: { en: "Admin Dashboard", id: "Dasbor Admin" },
  searchPlaceholder: {
    en: "Search family member...",
    id: "Cari anggota keluarga...",
  },
  born: { en: "Born", id: "Lahir" },
  died: { en: "Died", id: "Meninggal" },
  unknown: { en: "Unknown", id: "Tdk diketahui" },
  unknownRoot: { en: "Unknown (Root)", id: "Tidak diketahui (Root)" },
  noDataAdmin: {
    en: "No family member data yet. Please add a new member.",
    id: "Belum ada data anggota keluarga. Silakan tambah anggota baru.",
  },
  deceased: { en: "Deceased", id: "Almarhum" },
  deceasedShort: { en: "Dec", id: "Alm" },
  parents: { en: "Parents", id: "Orang Tua" },
  spouse: { en: "Spouse", id: "Pasangan" },
  children: { en: "Children", id: "Anak-anak" },
  editPropose: { en: "Edit / Propose Changes", id: "Edit / Ajukan Perubahan" },
  close: { en: "Close", id: "Tutup" },
  membersList: { en: "Members List", id: "Daftar Anggota" },
  membersDesc: {
    en: "All members of the SIRGA extended family.",
    id: "Semua anggota keluarga besar SIRGA.",
  },
  searchMember: { en: "Search member...", id: "Cari anggota..." },
  searchFamily: { en: "Search family...", id: "Cari keluarga..." },
  notFound: { en: "Not found.", id: "Tidak ditemukan." },
  noMembersFound: {
    en: "No members found.",
    id: "Tidak ada anggota yang ditemukan.",
  },
  joinFamily: { en: "Join Family", id: "Gabung Keluarga" },
  login: { en: "Login", id: "Masuk" },
  logout: { en: "Logout", id: "Keluar" },
  themeMenu: { en: "Theme", id: "Tema" },
  languageSelector: { en: "Language", id: "Bahasa" },
  dark: { en: "Dark", id: "Gelap" },
  light: { en: "Light", id: "Terang" },

  aboutTitle: { en: "About SIRGA", id: "Tentang SIRGA" },
  aboutDesc: {
    en: "SIRGA stands for SILSILAH KELUARGA (Family Tree). As an IT Enthusiast, I wanted to make it easy for myself and others to view our family tree, which is why I built this web application.",
    id: "SIRGA merupakan singkatan dari SILSILAH KELUARGA. Sebagai seorang IT Enthusiast, saya ingin agar saya sendiri maupun orang lain dapat dengan mudah melihat silsilah keluarga, maka dari itu saya membuat aplikasi web ini.",
  },
  howToUse: { en: "How to Use", id: "Cara Menggunakan" },
  navigation: { en: "Navigation", id: "Navigasi" },
  zooming: { en: "Zooming", id: "Zooming" },
  memberDetail: { en: "Member Details", id: "Detail Anggota" },
  instruction1: {
    en: "Drag the screen to move around the tree.",
    id: "Geser layar untuk bergerak di sekitar pohon.",
  },
  instruction2: {
    en: "Use mouse wheel or pinch to zoom in and out.",
    id: "Gunakan roda mouse atau cubit untuk memperbesar dan memperkecil.",
  },
  instruction3: {
    en: "Click on any person to see their detailed information and relationships.",
    id: "Klik pada siapa saja untuk melihat informasi rinci dan hubungan mereka.",
  },

  developedBy: { en: "Developed By", id: "Dikembangkan Oleh" },
  itEnthusiast: {
    en: "IT Enthusiast & Developer",
    id: "Penggiat IT & Pengembang",
  },
  developerDesc: {
    en: "B.Eng in Electrical Engineering, Diponegoro University (Information Technology focus). Dedicated to building useful and accessible applications.",
    id: "Lulusan S1 Electrical Engineering Universitas Diponegoro (Konsentrasi Teknologi Informasi). Berdedikasi untuk membangun aplikasi yang bermanfaat dan mudah digunakan.",
  },
  madeWith: { en: "Made with", id: "Dibuat dengan" },
  forFamily: { en: "for the Family", id: "untuk Keluarga" },

  adminDashboard: { en: "Admin Dashboard", id: "Dasbor Admin" },
  familyMembers: { en: "Family Members", id: "Anggota Keluarga" },
  addMember: { en: "Add Member", id: "Tambah Anggota" },
  addMemberNew: { en: "Add New Member", id: "Tambah Anggota Baru" },
  editMember: { en: "Edit Member", id: "Edit Anggota" },
  editModeActive: { en: "Edit Mode Active", id: "Mode Edit Aktif" },
  none: { en: "None", id: "Tidak ada" },
  addMemberDesc: {
    en: "Fill out the information below to add a new family member.",
    id: "Lengkapi informasi di bawah ini untuk menambahkan anggota keluarga baru.",
  },
  editMemberDesc: {
    en: "Update the information below for this family member.",
    id: "Perbarui informasi di bawah ini untuk anggota keluarga ini.",
  },
  delete: { en: "Delete", id: "Hapus" },
  actions: { en: "Actions", id: "Aksi" },
  saveChanges: { en: "Save Changes", id: "Simpan Perubahan" },
  cancel: { en: "Cancel", id: "Batal" },
  back: { en: "Back", id: "Kembali" },

  personalInfo: { en: "Personal Info", id: "Informasi Pribadi" },
  profilePhoto: { en: "Profile Photo", id: "Foto Profil" },
  uploadPhotoInfo: {
    en: "Upload a clear face photo (Max 2MB).",
    id: "Upload foto wajah yang jelas (Maks 2MB).",
  },
  chooseDevice: { en: "Choose from Device", id: "Pilih dari Perangkat" },
  pasteUrl: { en: "Or paste URL link...", id: "Atau tempel link URL..." },
  fullName: { en: "Full Name", id: "Nama Lengkap" },
  nickname: { en: "Nickname", id: "Nama Panggilan" },
  gender: { en: "Gender", id: "Gender" },
  male: { en: "Male", id: "Laki-laki" },
  female: { en: "Female", id: "Perempuan" },

  lifeEvent: { en: "Life Event", id: "Riwayat Hidup" },
  birthDate: { en: "Birth Date", id: "Tanggal Lahir" },
  deathDate: { en: "Death Date (Optional)", id: "Tanggal Wafat (Opsional)" },
  leaveEmpty: {
    en: "Leave empty if exact date is unknown.",
    id: "Kosongkan jika tidak tahu tanggal pastinya.",
  },
  livingStatus: { en: "Living Status", id: "Status Hidup" },
  alive: { en: "Alive", id: "Masih Hidup" },

  familyRelations: { en: "Family Relationships", id: "Hubungan Keluarga" },
  father: { en: "Father", id: "Ayah (Father)" },
  mother: { en: "Mother", id: "Ibu (Mother)" },
  spouseLabel: { en: "Spouse", id: "Pasangan (Spouse)" },
  unknownPerson: { en: "-- Unknown --", id: "-- Tidak Diketahui --" },
  notMarried: {
    en: "-- Not Married / None --",
    id: "-- Belum Menikah / Tidak Ada --",
  },

  confirmDelete: {
    en: "Are you sure you want to delete",
    id: "Apakah Anda yakin ingin menghapus",
  },
  actionCannotBeUndone: {
    en: "This action cannot be undone.",
    id: "Tindakan ini tidak dapat dibatalkan.",
  },
  noData: { en: "No family members yet.", id: "Belum ada anggota keluarga." },
  loading: { en: "Loading...", id: "Memuat..." },
  uploadSuccess: {
    en: "Photo uploaded successfully!",
    id: "Foto berhasil diunggah!",
  },
  uploadFailed: { en: "Failed to upload photo", id: "Gagal mengunggah foto" },
  uploadRequire: {
    en: "You must select an image file.",
    id: "Anda harus memilih file gambar.",
  },
  addFailed: {
    en: "Failed to add member. Check your Supabase connection.",
    id: "Gagal menambah anggota. Periksa koneksi Supabase Anda.",
  },
  addSuccess: {
    en: "Member added successfully!",
    id: "Anggota berhasil ditambahkan!",
  },
  editSuccess: {
    en: "Member updated successfully!",
    id: "Anggota berhasil diperbarui!",
  },
  deleteSuccess: {
    en: "Member deleted successfully!",
    id: "Anggota berhasil dihapus!",
  },

  loginTitle: { en: "Welcome, Family!", id: "Selamat Datang, Keluarga!" },
  loginDesc: {
    en: "Log in to view and contribute to our family tree.",
    id: "Masuk untuk melihat dan berkontribusi pada silsilah keluarga kita.",
  },
  emailOrUsername: { en: "Email / Username", id: "Email / Nama Pengguna" },
  password: { en: "Password", id: "Kata Sandi" },
  loginNow: { en: "Login Now", id: "Masuk Sekarang" },
  notRegistered: {
    en: "Not registered in the family tree?",
    id: "Belum terdaftar di silsilah?",
  },
  accountInfo: { en: "Account Credentials", id: "Informasi Akun" },
  confirmPassword: { en: "Confirm Password", id: "Konfirmasi Kata Sandi" },
  placeholderConfirm: {
    en: "Re-enter your password",
    id: "Masukkan ulang kata sandi",
  },
  passwordMismatch: {
    en: "Passwords do not match",
    id: "Kata sandi tidak cocok",
  },
  passwordLength: {
    en: "Password must be at least 6 characters",
    id: "Kata sandi minimal 6 karakter",
  },

  logoutConfirmTitle: { en: "Logout Confirmation", id: "Konfirmasi Keluar" },
  logoutConfirmMsg: {
    en: "Are you sure you want to log out from your account?",
    id: "Apakah Anda yakin ingin keluar dari akun Anda?",
  },
  logoutSuccess: { en: "Logged out successfully", id: "Berhasil keluar" },
  loginSuccess: {
    en: "Login successful! Welcome back.",
    id: "Login berhasil! Selamat datang kembali.",
  },
  loginFailed: {
    en: "Login failed. Please check your email and password.",
    id: "Login gagal. Periksa kembali email dan kata sandi Anda.",
  },
  loginAdminSuccess: {
    en: "Admin access granted.",
    id: "Akses Admin diberikan.",
  },

  registerTitle: {
    en: "Register as Contributor",
    id: "Daftar sebagai Kontributor",
  },
  contributor: { en: "Contributor", id: "Kontributor" },
  developerAdmin: { en: "Developer Admin", id: "Developer Admin" },
  secretKey: { en: "Secret Key", id: "Kunci Rahasia" },
  authorizeAccess: { en: "Authorize Access", id: "Otorisasi Akses" },
  wrongKey: { en: "Wrong secret key!", id: "Kunci rahasia salah!" },
  developerAccess: { en: "Developer Access", id: "Akses Developer" },

  registerTitle: { en: "Family Registration", id: "Pendaftaran Keluarga" },
  registerDesc: {
    en: "Fill in your details to join the SIRGA system.",
    id: "Lengkapi data untuk bergabung ke dalam sistem SIRGA.",
  },
  personalData: { en: "Personal Data", id: "Data Pribadi" },
  step: { en: "Step", id: "Langkah" },
  birthPlace: { en: "Birth Place", id: "Tempat Lahir" },
  fatherName: { en: "Father's Name", id: "Nama Ayah" },
  motherName: { en: "Mother's Name", id: "Nama Ibu" },
  didYouMean: { en: "Did you mean", id: "Maksud Anda" },
  yesCorrect: { en: "Yes, Correct", id: "Ya, Benar" },
  newFamilyStatus: { en: "New Family Status", id: "Status Keluarga Baru" },
  marriedCheck: { en: "I am married", id: "Saya sudah menikah" },
  spouseName: { en: "Spouse's Name", id: "Nama Suami / Istri" },
  hasChildrenCheck: { en: "I have children", id: "Saya sudah memiliki anak" },
  childrenList: { en: "List of Children", id: "Daftar Anak" },
  addChild: { en: "Add Another Child", id: "Tambah Anak Lainnya" },
  continueBtn: { en: "Continue", id: "Lanjutkan" },
  finishRegister: { en: "Finish Registration", id: "Selesaikan Pendaftaran" },
  alreadyHaveAccount: {
    en: "Already have an account?",
    id: "Sudah punya akun?",
  },
  loginHere: { en: "Login here", id: "Login di sini" },
  registerSuccess: {
    en: "Registration Successful!",
    id: "Pendaftaran Berhasil!",
  },
  registerSuccessDesc: {
    en: "Your data is being processed by the system. Redirecting to login page...",
    id: "Data Anda sedang diproses oleh sistem. Mengarahkan ke halaman login...",
  },
  placeholderEmail: { en: "Enter your email", id: "Masukkan email Anda" },
  placeholderPassword: { en: "••••••••", id: "••••••••" },
  placeholderKey: {
    en: "Enter key (hint: admin123)",
    id: "Masukkan kunci (hint: admin123)",
  },
  placeholderFullName: {
    en: "Example: Muhammad Farhan",
    id: "Contoh: Muhammad Farhan",
  },
  placeholderBirthPlace: { en: "Example: Jakarta", id: "Contoh: Jakarta" },
  placeholderFather: { en: "Type father's name...", id: "Ketik nama Ayah..." },
  placeholderMother: { en: "Type mother's name...", id: "Ketik nama Ibu..." },
  placeholderSpouse: {
    en: "Enter spouse's name...",
    id: "Masukkan nama pasangan...",
  },
  placeholderChild: { en: "Child name #", id: "Nama Anak ke-" },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "id" : "en"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
