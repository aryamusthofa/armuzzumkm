# Situs Armuzz Studio

Situs statis sembilan halaman untuk layanan editing foto dan video. Pengunjung dapat melihat jasa, contoh konsep visual, estimasi paket, proses kerja, FAQ, profil editor, dan menyiapkan brief kontak. Bahasa Inggris dan Bahasa Indonesia tersedia; pilihan bahasa dan tema disimpan secara terpisah.

## Halaman

| Berkas | Isi |
| --- | --- |
| `index.html` | Beranda, contoh konsep, jasa pilihan, paket, dan alur kerja |
| `layanan.html` | Katalog jasa foto dan video |
| `portfolio.html` | Galeri konsep dengan filter dan dialog detail |
| `paket.html` | Contoh paket dan estimasi yang dapat diedit |
| `proses.html` | Tahapan brief hingga penyerahan hasil |
| `tentang.html` | Pendekatan dan prinsip kerja |
| `biodata.html` | Profil editor dan tautan publik |
| `faq.html` | Jawaban tentang brief, estimasi, revisi, dan hasil |
| `kontak.html` | Form brief yang menyiapkan pesan WhatsApp/email bila dikonfigurasi |

Semua halaman memakai navigasi HTML biasa serta CSS dan JavaScript bersama di dalam `assets/`.

## Empat tema

Pemilih **Theme/Tema** tersedia pada navigasi setiap halaman. Buka pemilih, lalu pilih salah satu tampilan:

| Tema | Karakter |
| --- | --- |
| **Warm Paper** | Identitas awal: hangat, editorial, dan terinspirasi kertas |
| **Deep Dark** | Grafit berlapis dengan aksen hangat yang tenang |
| **Clean Light** | Terang, sederhana, dan mudah dipindai |
| **RGB Pulse** | Permukaan gelap dengan aksen gradasi RGB yang selektif |

Tema pertama kali adalah **Warm Paper**. Tema yang dipilih disimpan pada `localStorage` dengan kunci `studio-theme`; pilihan bahasa memakai kunci terpisah, `studio-language`. Tema awal diterapkan oleh `assets/js/theme.js` sebelum stylesheet dimuat untuk mengurangi kilatan tampilan yang salah. Nilai tema lama (`warm`, `dark`, `light`, `rgb`) tetap dikenali; nilai yang tidak dikenal kembali ke Warm Paper. Jika penyimpanan browser tidak tersedia, situs tetap dapat digunakan dengan tema bawaan.

Untuk mengubah palet, edit token CSS di bagian `:root` (Warm Paper) dan aturan `html[data-theme="..."]` pada `assets/css/style.css`. Komponen memakai token seperti `--page`, `--page-raised`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, dan `--accent-hover`. Pertahankan teks, fokus, dan tombol dengan kontras yang memadai. Jangan gunakan gradasi sebagai token warna teks atau latar tombol; `--accent-gradient` hanya untuk detail aksen RGB.

## Menyesuaikan konten

Edit `assets/js/site-config.js` untuk mengubah:

- Nama studio, nama pemilik, peran, bio, dan foto profil.
- Nomor WhatsApp dan email. Nomor WhatsApp harus berisi digit dengan kode negara; email dan tautan sosial harus benar-benar aktif sebelum situs diterbitkan.
- Jasa, kategori, deskripsi, keluaran, cakupan, dan waktu yang disepakati.
- Data portofolio dan FAQ.
- Paket serta harga contoh dalam IDR dan mata uang lain yang disetel secara terpisah. Angka contoh bukan tarif resmi; minta persetujuan pemilik sebelum dipublikasikan.

Konten terjemahan statis bahasa Inggris/Indonesia berada di `assets/js/translations.js`. Saat menambahkan teks antarmuka, tambahkan kedua bahasanya. Nama dan deskripsi data yang dilokalkan menggunakan objek `{ en: "...", id: "..." }`.

Untuk mengganti gambar profil, letakkan aset yang boleh digunakan di `assets/images/profile/` dan perbarui `ownerImage`. Gambar konsep berada di `assets/images/projects/`; ganti aset dan perbarui jalurnya pada data `portfolio`. Video opsional memakai MP4. Karya yang tersedia saat ini adalah ilustrasi konsep, bukan proyek klien.

## Menjalankan secara lokal

Tidak diperlukan instalasi paket atau proses build. Dari folder proyek, jalankan:

```powershell
python -m http.server 5500
```

Buka `http://localhost:5500` di browser. Alternatifnya, buka folder melalui VS Code dan gunakan ekstensi Live Server.

## Pemeriksaan tema dan aksesibilitas

1. Hapus nilai `studio-theme` dari penyimpanan situs untuk mencoba kunjungan pertama; Warm Paper seharusnya terpilih.
2. Pilih setiap tema dan periksa beranda, jasa, portofolio/dialog, paket, form, FAQ, dan profil.
3. Buka halaman lain dan muat ulang untuk memastikan tema tetap terpilih.
4. Ganti bahasa setelah memilih tema; bahasa dan tema seharusnya tidak saling mengubah.
5. Uji pemilih dengan keyboard, sentuhan, zoom, dan pengaturan `prefers-reduced-motion`.
6. Gunakan mode perangkat browser pada lebar ponsel kecil dan pastikan tidak ada gulir horizontal.

Transisi memakai CSS singkat dan tidak menjalankan animasi latar terus-menerus. Preferensi pengurangan gerakan dihormati. Situs menggunakan pengguliran browser normal; kelancaran dan frekuensi gambar aktual bergantung pada perangkat, browser, refresh layar, dan kondisi sistem. Proyek ini tidak menjanjikan 90 atau 120 FPS.

## Publikasi dan batasan

Folder ini dapat diterbitkan pada GitHub Pages atau host statis lain dengan mempertahankan struktur berkas dan jalur relatifnya. Sebelum tayang, konfirmasikan nama bisnis, tarif, kanal kontak, tautan sosial, materi portofolio, serta kebijakan waktu dan revisi. Form statis tidak menyimpan atau mengirim data ke server; pelanggan meninjau lalu mengirim pesan melalui aplikasi WhatsApp/email yang dikonfigurasi. Sistem pembayaran, penyimpanan order, dan pengelolaan konten memerlukan layanan/backend terpisah.
