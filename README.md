<div align="center">
  
  <img src="https://j.top4top.io/p_38195t90r1.jpg" alt="Foxxy Logo" width="180" style="border-radius: 50%;">
  
  # FOXXYPORTOFOLIO
  
  ### Personal Portfolio & Super App
  
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  
  *Portofolio personal + kumpulan tools lengkap dalam satu website*

</div>

---

## 📖 Tentang Proyek

**FoxxyPortofolio** adalah website portofolio personal yang dirancang untuk menjadi pusat dari semua aktivitas digital. Dari memperkenalkan diri, menjual produk & jasa, hingga menyediakan berbagai tools bermanfaat — semuanya ada di sini.

Website ini terinspirasi dari desain modern seperti [Asuma.my.id](https://www.asuma.my.id/) dengan sentuhan personal khas **Foxxy**.

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|-------|-----------|
| 🏠 **Landing Page** | Halaman utama dengan video hero, profil, jam digital, info baterai & CPU |
| 🛒 **Store** | Jual APK premium (Netflix, Capcut, Canva, dll) + jasa edit |
| 🤖 **Sewa Bot** | Halaman profesional "Foxxy Ai-MD" (1000+ fitur, 100+ penyewa) |
| 👥 **Komunitas** | Rules join + link ke SCK & grup WhatsApp |
| 🛠️ **Tools Lengkap** | Downloader, stalking, check, web maker, trading, device info |
| 🔐 **Admin Panel** | Custom semua link (WA, Telegram, QRIS, API, dll) |

---

## 🛠️ Daftar Tools

| No | Tools | Fungsi |
|----|-------|--------|
| 1 | TikTok Downloader | No watermark, MP3, caption, info video |
| 2 | Pinterest Downloader | Download video/foto |
| 3 | YouTube Downloader | MP3/MP4 downloader |
| 4 | Instagram Downloader | Postingan, reels, status, MP3, MP4, caption |
| 5 | Stalk TikTok | Followers, like, following, foto profil, dll |
| 6 | Stalk Instagram | Informasi akun Instagram |
| 7 | Stalk ML | ID, hero fav, rank, kolektor |
| 8 | Stalk FF | Informasi akun Free Fire |
| 9 | Check Website | Cek malware/ransomware/keylogger |
| 10 | Check File | Cek virus di APK/ZIP/MP4/MP3/JPG |
| 11 | Web Maker | Copy website → download zip + struktur |
| 12 | Web Request | Request fitur website (tema mirip link) |
| 13 | Trading | Pantau saham, crypto, meme coin |
| 14 | Mata Uang | Konversi mata uang asing ke Rupiah |
| 15 | Device Info | Cek RAM, storage, baterai, CPU, Antutu, Hz |

---

## 🔧 Teknologi yang Digunakan

<div align="center">
  
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
  
</div>

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** Vercel (Free Tier)
- **Storage:** LocalStorage (data tersimpan di browser)
- **API:** BotCahx, TikWM, PinDown, dll

---

## 🏗️ Struktur Folder

foxxy-portofolio/
├── index.html                 # Halaman utama
├── css/
│   └── style.css              # Styling dark theme + neon
├── js/
│   ├── config.js              # Semua link & API (bisa di-custom via admin)
│   ├── main.js                # Fungsi global (clock, battery, CPU, scroll)
│   ├── auth.js                # Login developer
│   ├── admin.js               # Simpan/load setting
│   └── tools.js               # Semua fungsi tools
├── pages/
│   ├── store.html             # Store APK + jasa
│   ├── bot-sewa.html          # Sewa bot Foxxy Ai-MD
│   ├── komunitas.html         # Rules join
│   ├── tentang-komunitas.html # Deskripsi grup
│   ├── tools.html             # Pusat tools
│   ├── tools-tiktok.html
│   ├── tools-pinterest.html
│   ├── tools-youtube.html
│   ├── tools-instagram.html
│   ├── tools-stalk-.html     # Stalking
│   ├── tools-check-.html     # Check web & file
│   ├── tools-web-*.html       # Web maker
│   ├── tools-trading.html
│   ├── tools-mata-uang.html
│   └── tools-device.html
├── admin/
│   └── developer.html         # Panel admin
├── assets/
│   ├── images/                # Profile, logo
│   ├── videos/                # Hero video
│   └── qris/                  # QRIS donasi
├── .vercel.json               # Konfigurasi Vercel
└── README.md                  # Dokumentasi

---

## 🔐 Akun Default Admin

| Username | Password | Role |
|----------|----------|------|
| `foxxy` | `foxxy2026` | Developer |

> ⚠️ **Catatan:** Username & password bisa diubah di halaman developer setelah login.

---

## ⚙️ Customization

### Via Halaman Developer

Setelah login, lo bisa custom:

| Kategori | Item yang bisa diubah |
|----------|----------------------|
| **Profil** | Foto profil (link), logo (link), video hero (link), judul website |
| **Sosial Media** | WhatsApp (nomor), Telegram (link), TikTok, GitHub, Gmail |
| **Komunitas** | Grup WhatsApp (link), website sekte (link) |
| **Donasi** | QRIS (link gambar) |
| **Downloader** | Link fallback TikTok, Pinterest, YouTube, Instagram |
| **API** | API URL + API Key (Pinterest, TikTok, dll) |

### Via File `config.js`

Semua setting default ada di `js/config.js`. Bisa diubah manual sebelum deploy.

---

## 🚀 Deployment ke Vercel

### Langkah-langkah:

1. **Upload ke GitHub**
   bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/foxxyoffc/foxxy-portofolio.git
   git push -u origin main

2. Deploy ke Vercel
   · Buka vercel.com
   · Login dengan GitHub
   · Klik Add New → Project
   · Pilih repository foxxy-portofolio
   · Framework Preset: Other
   · Klik Deploy
3. Selesai! Website live di https://foxxy-portofolio.vercel.app

---

📱 Responsive Design

Device Tampilan
💻 Desktop Optimal (1200px+)
📟 Tablet Menyesuaikan (768px - 1199px)
📱 Mobile Full responsive (< 768px)

---

📞 Kontak

Kontak Informasi
📧 Email foxxy@example.com
📱 WhatsApp +62 819-9714-9736
💬 Telegram @foxxyoffc
🎵 TikTok @foxxyoffc
🐙 GitHub foxxyoffc

---

📄 Lisensi

Copyright © 2026 FoxxyOffc/FoxxyPrst

---

<div align="center">

Website Code by Foxxy 

"Build with passion, serve with quality."

---

https://img.shields.io/github/stars/foxxyoffc/foxxy-portofolio?style=social
https://img.shields.io/github/forks/foxxyoffc/foxxy-portofolio?style=social

</div>
