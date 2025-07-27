# 🏁 Tugas Akhir (TA) - Final Project

**Nama Mahasiswa**: Dafarel Fatih Wirayudha  
**NRP**: 5025211120  
**Judul TA**: Visualisasi Penelusuran Produk Makanan Halal from Farm to Table Berdasarkan Web Teratai Menggunakan React.js dan Cytoscape  
**Dosen Pembimbing**: Ir. Adhatus Solichah Ahmadiyah, S.Kom, M.Sc.  
**Dosen Ko-pembimbing**: Dr. Kelly Rossa Sungkono, S.Kom., M.Kom

---

## 📺 Demo Aplikasi  
Embed video demo di bawah ini (ganti `VIDEO_ID` dengan ID video YouTube Anda):  

[![Demo Aplikasi](https://i.ytimg.com/vi/zIfRMTxRaIs/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)  
*Klik gambar di atas untuk menonton demo*

---

*Konten selanjutnya hanya merupakan contoh awalan yang baik. Anda dapat berimprovisasi bila diperlukan.*

## 🛠 Panduan Instalasi & Menjalankan Software  

### Prasyarat  
- Daftar dependensi (contoh):
  - Node.js v18+
  - MySQL 8.0
  - Git

### Langkah-langkah  
1. **Clone Repository**  
   ```bash
   git clone https://github.com/Informatics-ITS/TA.git
   ```
2. **Instalasi & Konfigurasi Backend**
- Arahkan ke direktori backend.
   ```bash
   cd TA/backend
   ```
- Install dependensi:
   ```bash
   npm install 
   ```
- Salin file .env.example menjadi .env.
- Isi variabel lingkungan di dalam file .env dengan kredensial database MySQL yang ada.
3. **Instalasi & Konfigurasi Frontend**
- Arahkan ke direktori frontend.
   ```bash
   cd TA/frontend
   ```
- Install dependensi:
   ```bash
   npm install 
   ```
- Salin file .env.example menjadi .env.
- Sesuaikan variabel lingkungan di dalam file .env jika diperlukan. Pastikan URL API menunjuk ke backend yang ada.
4. **Jalankan Aplikasi**
- Jalankan server backend dari direktori backend
   ```bash
   npm run dev
   ```
- Jalankan aplikasi frontend di terminal terpisah, dari direktori frontend
   ```bash
   npm run start
   ```
5. Buka browser dan kunjungi: `http://localhost:3000` (sesuaikan dengan port proyek Anda)

---

## 📚 Dokumentasi Tambahan

- [![User Manual]](docs/user_manual.pdf)
- [![Diagram Arsitektur]](docs/arsitektur.png)

---

## ✅ Validasi

Pastikan proyek memenuhi kriteria berikut sebelum submit:
- Source code dapat di-build/run tanpa error
- Video demo jelas menampilkan fitur utama
- README lengkap dan terupdate
- Tidak ada data sensitif (password, API key) yang ter-expose

---

## ⁉️ Pertanyaan?

Hubungi:
- Penulis: [dacukucay@gmail.com]
- Pembimbing Utama: [email@pembimbing]
