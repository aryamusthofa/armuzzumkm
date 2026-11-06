# Situs Armuzz Studio

Situs statis sembilan halaman untuk layanan editing foto, video, dan motion. Pengunjung dapat memilih layanan atau paket ke daftar permintaan lokal, mengatur kuantitas, lalu menyiapkan brief kontak. Daftar hanya tersimpan di browser yang sedang dipakai; bukan pemesanan atau penyimpanan server. Bahasa Inggris dan Bahasa Indonesia tersedia.

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
| `kontak.html` | Form brief proyek yang hanya menawarkan kanal kontak yang terkonfigurasi dan valid |

Semua halaman memakai navigasi HTML biasa serta CSS dan JavaScript bersama di dalam `assets/`.

## Empat tema

Pemilih **Theme/Tema** tersedia pada navigasi setiap halaman. Buka pemilih, pilih salah satu tampilan, lalu atur efek antarmuka dan RGB pulse secara terpisah:

| Tema | Karakter |
| --- | --- |
| **Warm Paper** | Identitas awal: hangat, editorial, dan terinspirasi kertas |
| **Deep Dark** | Grafit berlapis dengan aksen hangat yang tenang |
| **Clean Light** | Terang, sederhana, dan mudah dipindai |
| **RGB Pulse** | Permukaan gelap dengan aksen gradasi RGB yang selektif |

Tema pertama kali adalah **Warm Paper**. Tema, efek antarmuka, efek RGB pulse, suara antarmuka, bahasa, dan daftar permintaan menggunakan preferensi browser lokal yang terpisah. Efek, RGB pulse, dan suara nonaktif secara bawaan. Pengaturan `prefers-reduced-motion` selalu menonaktifkan animasi, tetapi tidak mengubah preferensi suara. Tema awal diterapkan oleh `assets/js/theme.js` sebelum stylesheet dimuat. Nilai tema lama (`warm`, `dark`, `light`, `rgb`) tetap dikenali; nilai yang tidak dikenal kembali ke Warm Paper. Jika penyimpanan browser tidak tersedia, situs tetap dapat digunakan tanpa persistensi.

Untuk mengubah palet, edit token CSS di bagian `:root` (Warm Paper) dan aturan `html[data-theme="..."]` pada `assets/css/style.css`. Komponen memakai token seperti `--page`, `--page-raised`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, dan `--accent-hover`. Pertahankan teks, fokus, dan tombol dengan kontras yang memadai. Jangan gunakan gradasi sebagai token warna teks atau latar tombol; `--accent-gradient` hanya untuk detail aksen RGB.

## Menyesuaikan konten

Edit `assets/js/site-config.js` untuk mengubah:

- Nama studio, nama pemilik, peran, bio, dan foto profil.
- Nomor WhatsApp dan email. Konfigurasi saat ini berisi nomor dummy semua-nol yang sengaja tidak diaktifkan. Ganti dengan nomor terverifikasi (digit dengan kode negara) sebelum mengaktifkan WhatsApp; kanal kontak yang kosong atau tidak valid tidak ditawarkan oleh form.
- Jasa, kategori, deskripsi, keluaran, cakupan, dan waktu yang disepakati.
- Data portofolio dan FAQ.
- Paket serta harga contoh dalam IDR dan mata uang lain yang disetel secara terpisah. Angka contoh bukan tarif resmi; minta persetujuan pemilik sebelum dipublikasikan.

Konten terjemahan statis bahasa Inggris/Indonesia berada di `assets/js/translations.js`. Saat menambahkan teks antarmuka, tambahkan kedua bahasanya. Nama dan deskripsi data yang dilokalkan menggunakan objek `{ en: "...", id: "..." }`.

Daftar permintaan disimpan hanya pada `localStorage` browser dengan kunci `studio-order-cart` dan struktur berversi `{ version: 1, items: [...] }`. Setiap item menyimpan jenis, ID dari konfigurasi, dan jumlah; nama serta harga tetap dibaca dari konfigurasi agar tidak menyimpan salinan data yang mudah kedaluwarsa. Format daftar lama berupa array dibaca dan diperbarui ke versi tersebut saat perubahan berikutnya disimpan. Daftar tersinkron antartab pada browser/perangkat yang sama, tetapi bukan pemesanan, bukan penyimpanan server, dan tidak ikut tersedia di perangkat lain. Penambahan, pengosongan, dan perpindahan dari tombol permintaan meminta konfirmasi; notifikasi menyampaikan perubahan serta kegagalan simpan.

Toggle **Interface effects**, **RGB pulse animation**, dan **UI sounds** adalah switch terpisah: posisi kiri berarti mati, kanan berarti hidup. Semuanya mati saat penggunaan pertama dan pilihannya disimpan di browser. Efek antarmuka mencakup reveal saat menggulir, feedback klik, dan transisi dialog; konten tetap tampil jika efek mati atau `IntersectionObserver` tidak tersedia. Preferensi pengurangan gerakan sistem menonaktifkan animasi. Suara UI berupa nada singkat yang baru dimainkan setelah toggle suara diaktifkan dan pengguna berinteraksi; suara tidak diputar otomatis. **Background music / Musik latar** memiliki tombol putar/jeda terpisah yang mati setiap kali halaman dimuat ulang. Musik ambient sintetis dibuat di browser tanpa file eksternal, mulai hanya setelah tombol ditekan, dan berhenti saat dijeda atau tab disembunyikan.

Folder `armuzzumkm-main/` dan `armuzzumkm(referensikedua)/` adalah salinan referensi dan dikecualikan dari keluaran situs melalui `_config.yml`. Atur direktori publikasi ke root situs ini; jangan menerbitkan folder salinan tersebut sebagai halaman tambahan.

Untuk mengganti gambar profil, letakkan aset yang boleh digunakan di `assets/images/profile/` dan perbarui `ownerImage`. Gambar konsep berada di `assets/images/projects/`; ganti aset dan perbarui jalurnya pada data `portfolio`. Video opsional memakai MP4. Karya yang tersedia saat ini adalah ilustrasi konsep, bukan proyek klien.

## Menjalankan secara lokal

Tidak diperlukan instalasi paket atau proses build. Dari folder proyek, jalankan:

```powershell
python -m http.server 5500
```

Buka `http://localhost:5500` di browser. Alternatifnya, buka folder melalui VS Code dan gunakan ekstensi Live Server.

Jalankan pemeriksaan struktur dan konfigurasi dengan `node --test tests/site-smoke.test.js`.

## Pemeriksaan tema dan aksesibilitas

1. Hapus nilai `studio-theme` dari penyimpanan situs untuk mencoba kunjungan pertama; Warm Paper seharusnya terpilih.
2. Pilih setiap tema dan periksa beranda, jasa, portofolio/dialog, paket, form, FAQ, dan profil.
3. Buka halaman lain dan muat ulang untuk memastikan tema tetap terpilih.
4. Ganti bahasa setelah memilih tema; bahasa dan tema seharusnya tidak saling mengubah.
5. Uji pemilih dengan keyboard, sentuhan, zoom, dan pengaturan `prefers-reduced-motion`.
6. Gunakan mode perangkat browser pada lebar ponsel kecil dan pastikan tidak ada gulir horizontal.

Transisi memakai CSS singkat dan tidak menjalankan animasi latar terus-menerus. Preferensi pengurangan gerakan dihormati. Situs menggunakan pengguliran browser normal; kelancaran dan frekuensi gambar aktual bergantung pada perangkat, browser, refresh layar, dan kondisi sistem. Proyek ini tidak menjanjikan 90 atau 120 FPS.

## Publikasi dan batasan

Folder ini dapat diterbitkan pada host statis dengan mempertahankan struktur berkas dan jalur relatifnya. Sebelum tayang, konfirmasikan nama bisnis, tarif, lingkup, waktu pengerjaan, revisi, kanal kontak, tautan sosial, materi dan hak penggunaan portofolio, serta musik/aset berlisensi. Harga dan karya yang tampil sekarang ditandai sebagai contoh; jangan menganggap angka, waktu, atau ketentuan layanan sebagai penawaran final sebelum disetujui pemilik. Form statis tidak menyimpan atau mengirim data ke server; pelanggan meninjau lalu mengirim pesan melalui kanal yang dikonfigurasi. Daftar permintaan dan masukan hanya disiapkan lokal; sistem pembayaran, penyimpanan order, dan pengelolaan konten memerlukan layanan/backend terpisah.
