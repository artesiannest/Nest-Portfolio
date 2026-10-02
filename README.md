# Portfolio Nestiara Lidya Kakihary

Website HTML, CSS, dan JavaScript vanilla. Tidak memerlukan build, API key, database, atau backend.

## Menjalankan

1. Ekstrak ZIP terlebih dahulu.
2. Buka `index.html` dengan Chrome, Edge, atau Firefox modern.
3. Biarkan struktur folder tetap sama. Semua path aset bersifat relatif.

Website tetap bekerja tanpa koneksi internet. Font Google menggunakan fallback Arial jika internet tidak tersedia; tautan WhatsApp, email, Google Docs, dan demo eksternal memerlukan aplikasi/koneksi yang sesuai. Jangan membuka HTML langsung dari dalam ZIP.

## Struktur

- `index.html`: halaman dan metadata SEO / Open Graph.
- `css/style.css`: tema gelap/terang, tata letak responsive, animasi, dan lightbox.
- `js/data.js`: profil, kontak, pendidikan, pengalaman, sertifikasi, enam sistem, galeri, prototype, riset, dan skenario ide AI.
- `js/main.js`: interaksi halaman, pencarian/filter, navigasi, tema, galeri, dan modal.
- `assets/images/portfolio/`: 91 screenshot PNG dalam dimensi asli serta 91 thumbnail WebP.
- `assets/images/profile/`: favicon; belum menggunakan foto profil karena foto tidak disertakan.
- `assets/documents/resume-nestiara.pdf`: resume sumber.
- `assets/research/`: lima karya utama, presentasi MyKlinik, mind map smart home, dan poster metaverse.

## Mengedit profil, kontak, dan resume

Buka `js/data.js` memakai editor teks. Edit `profile`, `education`, `experience`, `certificates`, dan `skills`. Nama, profesi, deskripsi hero, kontak, pendidikan, dan pengalaman dibaca dari data. Edit `profile.headline` untuk mengganti headline. Frasa “lebih membantu” diberi aksen otomatis jika terdapat di headline.

Nomor `whatsapp` menggunakan format internasional angka saja: `6285117800728`. Jangan menambahkan tanda `+`, spasi, atau nol pertama. Field LinkedIn dan GitHub kosong; isi dengan URL lengkap hanya jika tersedia.

Ganti file `assets/documents/resume-nestiara.pdf` untuk memperbarui resume. Jika mengganti nama atau folder, perbarui `profile.resumeUrl`. Metadata judul dan deskripsi di `<head>` perlu diperbarui manual bila branding berubah. Gunakan alamat hosting final pada `og:url`.

## Mengisi enam dokumentasi Google Docs

Setiap objek `systems` mempunyai `documentationUrl`. Isi enam field tersebut dengan URL asli dokumen masing-masing. Contoh struktur (gunakan URL milik sendiri):

```js
"documentationUrl": ""
```

Langkah akses dokumen:

1. Buka dokumen Google Docs untuk sistem terkait.
2. Klik **Bagikan / Share**.
3. Pada **Akses umum / General access**, pilih **Siapa saja yang memiliki link / Anyone with the link**.
4. Pilih **Pelihat / Viewer**, kemudian salin tautan.
5. Tempel ke `documentationUrl` sistem yang sesuai.
6. Uji tautan dari jendela incognito; pastikan tidak meminta login.

Website menerima URL HTTPS `docs.google.com/document/...`. Kartu membuka tab baru dengan `noopener noreferrer`. Tombol galeri berada di luar anchor dokumentasi. Jika field kosong atau tidak valid, kartu menampilkan **Dokumentasi segera tersedia** tanpa tautan aktif. Website tidak mengubah izin Google Docs; izin diatur di Google Docs.

## Prototype dan source code

Isi `demoUrl` dan `sourceUrl` dengan URL HTTPS asli. Field `accessType` awal adalah `gallery` karena sumber hanya berupa screenshot. Ganti menjadi `open` hanya jika demo telah tersedia untuk publik. Set `requiresLogin` ke `true` untuk demo yang membutuhkan akun, `false` untuk demo tanpa login, atau `null` jika belum diketahui.

Tanpa `demoUrl`, **Coba Prototype** nonaktif. Galeri selalu dapat dibuka. Tanpa `sourceUrl`, tidak ada tautan source code. Jangan memasukkan password atau token ke data frontend.

## Galeri screenshot

Setiap sistem mempunyai `cover` dan array `gallery` yang berisi `src` serta `caption`. Pertahankan thumbnail WebP dengan nama dasar yang sama seperti PNG karena kartu dan strip thumbnail menggunakannya. Galeri penuh menampilkan PNG dengan `object-fit: contain`. Semua 91 gambar tetap tersedia; gambar tidak dipotong pada tampilan penuh.

Caption dirapikan berdasarkan nama file dan halaman yang terlihat. Galeri mendukung tombol sebelumnya/berikutnya, panah keyboard, Escape, swipe horizontal, nomor gambar, thumbnail, dan pengembalian fokus.

Salinan publik menyamarkan beberapa nama dan pola kontak/alamat yang terdeteksi secara otomatis. File sumber lampiran tidak ditimpa. Penyaringan otomatis belum merupakan jaminan audit privasi lengkap; tinjau screenshot publik sebelum membagikannya secara terbuka.

## Riset

Edit array `research`: judul, penulis, fokus, metode, jenis karya, ringkasan, uraian, dokumen, materi pendukung, dan status. Versi revisi dipilih untuk smart home serta metaverse; versi lama tidak ditampilkan sebagai karya terpisah. MyKlinik adalah objek evaluasi riset. Odoo tetap proposal penelitian, tanpa klaim hasil empiris. HRIS merupakan karya bersama. Status publikasi tidak disimpulkan dari template jurnal.

PDF/PNG dapat dibaca di tab baru. DOCX/PPTX diunduh atau dibuka oleh aplikasi sesuai pengaturan browser. Konversi ke PDF dapat dilakukan kemudian bila menginginkan pembaca dokumen yang konsisten di browser.

## Ide AI

Bagian AI memakai respons ilustratif lokal di `scenarios`. Tidak ada model AI, pemrosesan akun, atau API yang aktif. Jangan menghapus label **Ide pengembangan** dan **Simulasi lokal** sebelum fitur AI benar-benar diintegrasikan.

## Hosting statis

Unggah seluruh isi folder yang berisi `index.html` ke direktori publik hosting. Jangan hanya mengunggah HTML. Tidak diperlukan perintah build atau server database. Untuk GitHub Pages, letakkan folder/aset di root sumber Pages dan pilih branch/folder tersebut di pengaturan Pages. Untuk hosting cPanel, unggah ke direktori domain yang sesuai, umumnya `public_html`.

Pratinjau yang dibuat melalui ChatGPT bersifat privat pada saat pembuatan. Mengunggah source ini ke hosting lain tidak mengubah tautan Carrd lama. Integrasi Carrd tidak dilakukan.

## Verifikasi dan batasan

Pemeriksaan yang dilakukan: syntax JavaScript, struktur HTML dan ID, path semua screenshot/thumbnail/resume/dokumen, jumlah 6 sistem/91 screenshot/5 karya, dan kesesuaian dimensi screenshot dengan sumber. Breakpoint desktop/tablet/mobile dan prefers-reduced-motion diimplementasikan pada CSS.

Pengujian browser interaktif dan inspeksi visual desktop/mobile belum dilakukan karena sarana preview browser untuk HTML statis tidak tersedia dalam sesi ini. Jadi menu, tema, filter, dialog, swipe, fokus, dan tampilan responsive masih perlu diperiksa di browser pengguna.

Daftar pemeriksaan di browser:

- Desktop: header, hero, kartu, semua bagian, dan mode terang/gelap.
- Mobile (375–430 px): tidak ada overflow, menu bisa dibuka/ditutup.
- Cari `rental`; filter kategori; kosongkan pencarian; cek kondisi tanpa hasil.
- Buka setiap galeri, klik thumbnail, gunakan panah/Escape, cek swipe dan fokus kembali.
- Filter riset dan buka setiap modal, dokumen, serta materi pendukung.
- Unduh/buka resume; cek email dan WhatsApp.
- Isi satu Google Docs asli lalu cek klik kartu membuka tab baru dan tombol screenshot tetap hanya membuka galeri.
- Tab semua kontrol; uji pembesaran teks dan prefers-reduced-motion.

Tautan Google Docs, demo, dan source code belum diberikan dan belum diverifikasi. URL Carrd tidak berhasil dibaca melalui pencarian web; konten website dibuat berdasarkan lampiran.

## Animasi

Hero muncul berurutan, orbit bergerak perlahan, label fokus melayang, kartu muncul saat discroll, hover mengangkat kartu, serta dialog dan gambar memakai transisi lembut. Tombol bintang **✦** di header menjeda/mengaktifkan gerakan dan menyimpan preferensi di perangkat. Pengaturan **prefers-reduced-motion** otomatis menonaktifkan animasi. Tidak ada library animasi atau API tambahan.

## Konsep Kamar Nest — versi interaktif

Halaman pertama sekarang berupa kamar bergaya ilustrasi 2D dengan tiga aset orisinal: latar kamar, karakter Nestiara, dan handphone. Karakter memakai hoodie hitam, celana panjang putih, kacamata, dan rambut panjang. Karya ilustrasi dibuat melalui ImageGen, kemudian digunakan sebagai lapisan visual halaman. Prompt inti: kamar navy hangat dengan mading di kiri, rak riset di kanan, meja kayu; karakter perempuan berambut panjang berkacamata duduk mengetik; handphone dengan tampilan panggilan masuk.

Navigasi:

- Klik **Mading Portfolio**: membuka halaman enam sistem. Mading menampilkan thumbnail screenshot asli.
- Klik **Riset Akademik** pada rak buku: membuka karya akademik.
- Klik karakter atau bubble **Berkenalan dengan Nestiara**: membuka halaman tentang, pendidikan, pengalaman, dan resume.
- Klik **Handphone**: membuka halaman kontak.
- Klik **Kembali ke Kamar** di halaman konten: kembali ke kamar dan mengembalikan fokus ke objek pemicu.
- Menu atas dan empat tombol di bawah kamar menyediakan alternatif navigasi, terutama di ponsel.

Website menggunakan hash (`#portfolio`, `#riset`, `#tentang`, `#kontak`), sehingga halaman langsung dan tombol Back/Forward browser dapat digunakan tanpa pengaturan server. Konten ditampilkan sebagai halaman terpisah di dalam HTML yang sama; tidak perlu build. GitHub Pages tetap mendukung struktur ini.

Animasi kamar mencakup gerakan lembut karakter, bubble, handphone bergetar, gelombang dering, cahaya lampu, dan partikel. Tombol **✦** menjeda animasi. Tidak menggunakan klaim animasi karakter frame-by-frame; karakter berupa ilustrasi yang digerakkan sebagai satu lapisan.

Suara dering **nonaktif saat membuka website**. Klik **Suara: Nonaktif** di bawah kamar untuk mengaktifkan nada dering sintetis ringan. Suara hanya berjalan ketika kamar sedang terbuka dan tab aktif. Klik lagi untuk mematikan. Suara memerlukan browser yang mendukung Web Audio.

Berkas tambahan: `css/room.css`, `js/room.js`, dan `assets/images/room/`. Tetap upload semua berkas dan folder pada direktori yang sama dengan `index.html`. File `.nojekyll` membantu GitHub Pages menyajikan aset statis tanpa pengolahan Jekyll.

Pemeriksaan versi ini mencakup path aset, alpha transparan karakter/handphone, syntax JavaScript, struktur HTML, dan pengujian logika pergantian halaman melalui simulasi DOM. Inspeksi visual dan interaksi browser desktop/mobile belum dilakukan; sarana browser preview untuk HTML statis tidak tersedia dalam sesi ini.
