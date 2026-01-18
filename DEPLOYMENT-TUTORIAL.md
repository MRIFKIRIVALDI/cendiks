# Tutorial Deploy Cendiks ke Vercel

Panduan lengkap untuk deploy website Cendiks ke Vercel menggunakan GitHub.

## 📋 Persiapan

### 1. Pastikan Repository GitHub Sudah Siap
- Repository sudah di-push ke GitHub
- Branch `main` berisi kode terbaru
- File-file konfigurasi sudah ada:
  - `package.json`
  - `vercel.json`
  - `requirements.txt`
  - Folder `api/` dengan serverless functions

### 2. Akun yang Dibutuhkan
- Akun GitHub (sudah ada)
- Akun Vercel (daftar di [vercel.com](https://vercel.com))

## 🚀 Langkah-langkah Deployment

### Langkah 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Langkah 2: Login ke Vercel
```bash
vercel login
```
- Ikuti instruksi untuk login dengan akun Vercel Anda

### Langkah 3: Deploy dari GitHub (Metode 1 - Recommended)
1. Buka [vercel.com](https://vercel.com)
2. Klik **"Import Project"**
3. Pilih **"From Git Repository"**
4. Connect ke akun GitHub Anda
5. Pilih repository `cendiks`
6. Konfigurasi project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (biarkan default)
   - **Build Command**: `echo "No build needed"`
   - **Output Directory**: `./`
7. Klik **"Deploy"**

### Langkah 4: Deploy dari Terminal (Metode 2 - Alternative)
```bash
# Masuk ke direktori project
cd path/to/your/cendiks/project

# Deploy
vercel

# Ikuti prompt:
# - Link to existing project? N
# - What's your project's name? cendiks
# - In which directory is your code located? ./
# - Want to override settings? N
```

## ⚙️ Konfigurasi Environment Variables (Opsional)

Jika menggunakan database eksternal atau secrets:

1. Di dashboard Vercel, pilih project
2. Klik **"Settings"** tab
3. Klik **"Environment Variables"**
4. Tambahkan variables:
   - `SECRET_KEY`: Django secret key untuk production
   - `DATABASE_URL`: URL database PostgreSQL (jika menggunakan)

## 🔍 Verifikasi Deployment

### 1. Cek Status Deploy
- Di dashboard Vercel, lihat status deployment
- Tunggu hingga status berubah ke "Ready"

### 2. Test Website
- Kunjungi URL yang diberikan Vercel (contoh: `https://cendiks.vercel.app`)
- Test halaman-halaman berikut:
  - Halaman utama (`/`)
  - Halaman login (`/pages/login.html`)
  - Halaman register (`/pages/register.html`)
  - Halaman sesi pembelajaran (`/pages/sessions.html`)

### 3. Test API Endpoints
Gunakan curl atau browser untuk test API:

```bash
# Test login API
curl -X POST https://cendiks.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Test register API
curl -X POST https://cendiks.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123","password_confirm":"test123"}'
```

## 🛠️ Troubleshooting

### Error: "No such file or directory: 'requirements.txt'"
- Pastikan file `requirements.txt` ada di root directory
- Pastikan format file benar

### Error: "Module not found"
- Cek apakah semua dependencies tercantum di `requirements.txt`
- Untuk Django, pastikan versi kompatibel dengan Vercel Python runtime

### Error: "Build failed"
- Cek log build di dashboard Vercel
- Pastikan `vercel.json` konfigurasi benar
- Cek apakah ada syntax error di Python files

### API Tidak Berfungsi
- Pastikan file di folder `api/` menggunakan format Vercel Python functions
- Cek apakah `handler` function ada di setiap file
- Test locally dengan `vercel dev`

## 📁 Struktur File yang Penting

```
cendiks/
├── api/
│   ├── login.py      # Serverless function untuk login
│   └── register.py   # Serverless function untuk register
├── pages/            # Halaman HTML static
├── css/              # Stylesheet
├── js/               # JavaScript files
├── cendiks_django/   # Source Django (untuk reference)
├── package.json      # Konfigurasi Node.js
├── vercel.json       # Konfigurasi Vercel
├── requirements.txt  # Dependencies Python
└── index.html        # Halaman utama
```

## 🔄 Update Deployment

### Otomatis (dari GitHub)
Setiap push ke branch `main` akan otomatis redeploy.

### Manual Redeploy
1. Di dashboard Vercel
2. Pilih project
3. Klik **"Deployments"** tab
4. Klik **"Redeploy"** pada deployment terbaru

## 📊 Monitoring

### 1. Analytics
- Vercel menyediakan analytics gratis
- Lihat di **"Analytics"** tab di dashboard

### 2. Logs
- Lihat logs deployment di **"Functions"** tab
- Lihat real-time logs dengan `vercel logs`

## 🎯 Tips Optimalisasi

1. **Performance**: Gunakan CDN Vercel untuk assets static
2. **Security**: Selalu gunakan HTTPS (Vercel otomatis)
3. **SEO**: Pastikan meta tags di HTML sudah optimal
4. **Database**: Untuk production, gunakan PostgreSQL atau database cloud

## 📞 Support

Jika mengalami masalah:
1. Cek dokumentasi Vercel: https://vercel.com/docs
2. Lihat issues di GitHub repository
3. Contact tim support Vercel

---

**Selamat! Website Cendiks Anda sekarang sudah live di Vercel! 🎉**
