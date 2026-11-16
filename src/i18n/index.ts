import { createI18n } from 'vue-i18n'

const en = {
  nav: {
    menu: 'Menu',
    template: 'Template',
    dashboard: 'Dashboard',
    content: 'Content',
    posts: 'All Posts',
    create: 'Create Post',
    categories: 'Categories',
    tags: 'Tags',
    media: 'Media Library',
    comments: 'Comments',
    users: 'Users',
    allUsers: 'All Users',
    roles: 'Roles & Permissions',
    appearance: 'Appearance',
    menus: 'Navigation Menus',
    widgets: 'Widgets',
    analytics: 'Analytics',
    settings: 'Settings',
    general: 'General Settings',
    seo: 'SEO Settings',
    social: 'Social Media',
    reading: 'Reading Settings',
    activity: 'Activity Logs',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    loading: 'Loading…',
    empty: 'Nothing here yet.',
    retry: 'Try again',
    confirm: 'Confirm',
    close: 'Close',
  },
  auth: {
    login: 'Sign in',
    email: 'Email',
    password: 'Password',
    forgot: 'Forgot password',
    reset: 'Reset password',
    token: 'Reset token',
    newPassword: 'New password',
    demo: 'Demo password for every account is password.',
  },
}

const id = {
  nav: {
    menu: 'Menu',
    template: 'Template',
    dashboard: 'Dasbor',
    content: 'Konten',
    posts: 'Semua Tulisan',
    create: 'Tulis Baru',
    categories: 'Kategori',
    tags: 'Tag',
    media: 'Pustaka Media',
    comments: 'Komentar',
    users: 'Pengguna',
    allUsers: 'Semua Pengguna',
    roles: 'Peran & Izin',
    appearance: 'Tampilan',
    menus: 'Menu Navigasi',
    widgets: 'Widget',
    analytics: 'Analitik',
    settings: 'Pengaturan',
    general: 'Pengaturan Umum',
    seo: 'Pengaturan SEO',
    social: 'Media Sosial',
    reading: 'Pengaturan Membaca',
    activity: 'Log Aktivitas',
  },
  common: {
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    search: 'Cari',
    loading: 'Memuat…',
    empty: 'Belum ada data.',
    retry: 'Coba lagi',
    confirm: 'Konfirmasi',
    close: 'Tutup',
  },
  auth: {
    login: 'Masuk',
    email: 'Email',
    password: 'Kata sandi',
    forgot: 'Lupa kata sandi',
    reset: 'Atur ulang kata sandi',
    token: 'Token reset',
    newPassword: 'Kata sandi baru',
    demo: 'Kata sandi demo untuk setiap akun adalah password.',
  },
}

const stored = window.localStorage.getItem('cms-locale')
const locale = stored === 'id' || stored === 'en' ? stored : 'en'

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: { en, id },
})

export function setLocale(next: 'en' | 'id') {
  i18n.global.locale.value = next
  window.localStorage.setItem('cms-locale', next)
}
