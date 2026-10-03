"use strict";

// Membentuk galeri dari nama file 01.png, 02.png, dan seterusnya.
function nestGallery(folder, captions) {
  return captions.map((caption, index) => ({
    src:
      "assets/images/portfolio/" +
      folder +
      "/" +
      String(index + 1).padStart(2, "0") +
      ".png",
    caption: caption
  }));
}

window.PORTFOLIO_DATA = {
  profile: {
    name: "Nestiara Lidya Kakihary",
    nickname: "Nest",
    title:
      "Information Systems Professional | IT Project Manager | Web Developer",
    email: "nestiara19@gmail.com",
    phone: "+62 851 1780 0728",
    whatsapp: "6285117800728",
    location: "Indonesia",
    resumeUrl: "assets/documents/resume-nestiara.pdf",
    website: "https://artesiannest.carrd.co/",
    linkedinUrl: "",
    githubUrl: "",
    headline: "Membangun sistem digital yang lebih membantu pengguna.",
    heroDescription:
      "Saya Nest, seorang profesional Sistem Informasi dengan pengalaman dalam pengembangan web dan pengelolaan proyek IT. Saya menghubungkan kebutuhan pengguna, proses bisnis, dan teknologi melalui sistem yang mudah digunakan.",
    aboutDescription:
      "Pengalaman saya mencakup pengembangan aplikasi web, komunikasi klien, koordinasi tim, dan pengelolaan ruang lingkup proyek. Saya memadukan kemampuan teknis dan analisis proses bisnis untuk menerjemahkan kebutuhan menjadi alur kerja digital yang mudah digunakan."
  },

  education: [
    {
      level: "S1 Sistem Informasi",
      institution: "Universitas Kristen Satya Wacana",
      period: "2017–2021",
      gpa: "3,84 / 4,00",
      thesis:
        "Evaluasi kepuasan pengguna perangkat IoT menggunakan PIECES Framework."
    },
    {
      level: "Magister Sistem Informasi",
      institution: "Universitas Kristen Satya Wacana",
      status: "Mahasiswa"
    }
  ],

  skills: [
    {
      title: "Development",
      items: ["PHP", "HTML", "CSS", "JavaScript"]
    },
    {
      title: "Design",
      items: ["UI/UX Design"]
    },
    {
      title: "Project Management",
      items: [
        "Perencanaan proyek",
        "Koordinasi tim",
        "Scope management",
        "Risk management",
        "Komunikasi klien"
      ]
    },
    {
      title: "System & Business Analysis",
      items: [
        "Process improvement",
        "Business process optimization",
        "Cost-benefit analysis"
      ]
    }
  ],

  experience: [
    {
      period: "Januari 2022–Mei 2026",
      role: "IT Project Manager",
      company: "Simple Code Studio",
      description:
        "Mendirikan dan mengelola studio pengembangan web. Menangani komunikasi klien, perencanaan proyek, koordinasi tim, pengelolaan scope, serta pengawasan kualitas desain dan delivery."
    },
    {
      period: "Juni 2024–Desember 2025",
      role: "Junior Programmer",
      company: "APacead Team SG",
      description:
        "Mengerjakan task pengembangan perangkat lunak untuk proyek klien, berkolaborasi dengan tim, serta membangun dan mengiterasi solusi melalui alur Agile dan sprint."
    },
    {
      period: "September 2020–Maret 2021",
      role: "Information System Intern",
      company: "Universitas Kristen Satya Wacana",
      description:
        "Mendukung pengelolaan website fakultas dan koordinasi pembelajaran daring, termasuk penjadwalan kelas virtual dan perbaikan alur kerja digital."
    }
  ],

  certificates: [
    {
      title: "Foundations of Project Management",
      issuer: "Google · Coursera",
      date: "November 2025"
    },
    {
      title: "Introduction to Cybersecurity Careers",
      issuer: "IBM · Coursera",
      date: "Desember 2025"
    },
    {
      title: "Introduction to Computers and Operating Systems and Security",
      issuer: "Microsoft · Coursera",
      date: "November 2025"
    }
  ],

  systems: [
    {
      id: "accounsaas",
      title: "AccounSaaS — Finance",
      category: "Keuangan dan Akuntansi",
      summary:
        "Sistem pengelolaan keuangan dan pencatatan jurnal dengan dashboard serta fasilitas import dan export Excel.",
      cover: "assets/images/portfolio/accounsaas/01.png",
      gallery: nestGallery("accounsaas", [
        "Dashboard",
        "Dashboard 2",
        "Dashboard 3",
        "Export Excel",
        "Import Excel",
        "Jurnal Umum",
        "Pengaturan import dan export",
        "Tambah Jurnal Baru"
      ]),
      documentationUrl: "",
      demoUrl: "",
      sourceUrl: "",
      accessType: "gallery",
      requiresLogin: null
    },
    {
      id: "sikola",
      title: "SIKOLA — School Management System",
      category: "Manajemen Sekolah",
      summary:
        "Sistem manajemen sekolah untuk mengelola data siswa, guru, absensi, dan inventori.",
      cover: "assets/images/portfolio/sikola/01.png",
      gallery: nestGallery("sikola", [
        "Dashboard SIKOLA",
        "Absensi Siswa 2",
        "Absensi Siswa",
        "Dashboard SIKOLA 2",
        "Dashboard SIKOLA 3",
        "Data Guru",
        "Data Siswa",
        "Manajemen Inventori",
        "Tambah barang"
      ]),
      documentationUrl: "",
      demoUrl: "",
      sourceUrl: "",
      accessType: "gallery",
      requiresLogin: null
    },
    {
      id: "sioptik",
      title: "SiOptik",
      category: "Retail dan Operasional Optik",
      summary:
        "Sistem operasional optik untuk pengelolaan pelanggan, prescription, produk, inventori, transaksi POS, dan laporan.",
      cover: "assets/images/portfolio/sioptik/01.png",
      gallery: nestGallery("sioptik", [
        "Dashboard Admin",
        "Dashboard Admin 2",
        "Data Customer (Customer Details)",
        "Data Customer (Prescription)",
        "Data customer",
        "Data Pos Transaksi (Aksesoris)",
        "Data Pos Transaksi (Lensa)",
        "Data POS Transaksi 2",
        "Data POS Transaksi",
        "Inventori Manajemen 2",
        "Inventori Manajemen",
        "Laporan 2",
        "Laporan",
        "Product",
        "Tambah produk",
        "Tambah stok barang"
      ]),
      documentationUrl: "",
      demoUrl: "",
      sourceUrl: "",
      accessType: "gallery",
      requiresLogin: null
    },
    {
      id: "rental-pro",
      title: "Rental Pro",
      category: "Manajemen Rental Kendaraan",
      summary:
        "Sistem pengelolaan rental kendaraan dengan pencatatan pelanggan, transaksi penyewaan, maintenance, dan laporan.",
      cover: "assets/images/portfolio/rental-pro/01.png",
      gallery: nestGallery("rental-pro", [
        "Dashboard rental",
        "Dashboard Admin 3",
        "Dashboard rental 2",
        "History maintenance",
        "Laporan rental 2",
        "Laporan rental 3",
        "Laporan rental",
        "Manajemen kendaraan 2",
        "Manajemen kendaraan",
        "Manajemen maintenance",
        "Manajemen maintenance 2",
        "Manajemen pelanggan 2",
        "Manajemen pelanggan",
        "Transaksi rental 2",
        "Transaksi rental 3",
        "Transaksi rental"
      ]),
      documentationUrl: "",
      demoUrl: "",
      sourceUrl: "",
      accessType: "gallery",
      requiresLogin: null
    },
    {
      id: "kosthub",
      title: "KostHub — Manajemen Kost",
      category: "Properti dan Hunian",
      summary:
        "Sistem manajemen kost untuk mengelola kamar, penghuni, pembayaran, maintenance, dan laporan operasional.",
      cover: "assets/images/portfolio/kosthub/01.png",
      gallery: nestGallery("kosthub", [
        "Dashboard KostHub",
        "Dashboard KostHub 2",
        "Dashboard KostHub 3",
        "Halaman laporan 2",
        "Halaman laporan 3",
        "Halaman laporan 4",
        "Halaman laporan",
        "Halaman maintenance 2",
        "Halaman maintenance",
        "Halaman rooms 2",
        "Halaman rooms 3",
        "Halaman rooms",
        "Riwayat Pembayaran 2",
        "Riwayat Pembayaran",
        "Tambah ruangan",
        "Tenant-customer 2",
        "Tenant-customer"
      ]),
      documentationUrl: "",
      demoUrl: "",
      sourceUrl: "",
      accessType: "gallery",
      requiresLogin: null
    },
    {
      id: "lms",
      title: "Learning Management System",
      category: "Pembelajaran Digital",
      summary:
        "Sistem pembelajaran digital untuk pengelolaan kursus, materi, diskusi, kuis, ujian, dan hasil pembelajaran.",
      cover: "assets/images/portfolio/lms/01.png",
      gallery: nestGallery("lms", [
        "Dashboard Sistem Manajemen Pembelajaran 1",
        "Bagian diskusi dalam modul pembelajaran 1",
        "Bagian kuis dalam sistem 1",
        "Bagian kuis dalam sistem 2",
        "Bagian unduh materi modul pembelajaran",
        "Dashboard Sistem Manajemen Pembelajaran 2",
        "Dashboard Sistem Manajemen Pembelajaran 3",
        "Form buat kuis baru 1",
        "Form buat kuis baru 2",
        "Form tambah soal",
        "Halaman admin panel 1",
        "Halaman admin panel 2",
        "Halaman hasil kuis atau ujian 1",
        "Halaman hasil kuis atau ujian 2",
        "Halaman hasil kuis atau ujian 3",
        "Halaman hasil kuis atau ujian 4",
        "Halaman kuis dan ujian 1",
        "Halaman kuis dan ujian 2",
        "Halaman kursus 2",
        "Halaman kursus saya 1",
        "Halaman manajemen kuis",
        "Halaman manajemen kursus",
        "Isi modul pembelajaran 1",
        "Isi modul pembelajaran 2",
        "Profil siswa"
      ]),
      documentationUrl: "",
      demoUrl: "",
      sourceUrl: "",
      accessType: "gallery",
      requiresLogin: null
    }
  ],

  research: [
    {
      id: "smart-home-ml-ids",
      topic: "Keamanan IoT",
      type: "Systematic Literature Review",
      title:
        "Literature Review Study: Machine Learning-Based Smart Home Intrusion Detection System with an Edge-Cloud-Hybrid Architecture Approach and Conceptual Comparison with Encryption Methods",
      authors: [
        "Nestiara Lidya Kakihary",
        "Irwan Sembiring",
        "Hindriyanto D. Purnomo"
      ],
      summary:
        "Kajian keamanan smart home IoT yang membandingkan deteksi intrusi berbasis machine learning dengan kriptografi ringan dalam arsitektur edge–cloud hybrid.",
      focus:
        "Kemampuan deteksi serangan, overhead komputasi, latensi, dan efisiensi energi pada perangkat IoT dengan sumber daya terbatas.",
      method:
        "Systematic literature review terhadap artikel periode 2019–2024, dengan perbandingan konseptual ML-based IDS dan lightweight cryptography.",
      detail:
        "Kajian menunjukkan bahwa ML-based IDS berperan sebagai pertahanan aktif untuk mendeteksi serangan jaringan, sedangkan kriptografi ringan melindungi kerahasiaan dan integritas data. Keduanya direkomendasikan sebagai mekanisme yang saling melengkapi dalam strategi keamanan berlapis. Arsitektur edge–cloud hybrid mendukung deteksi cepat di edge serta analisis yang lebih berat di cloud. Temuan berasal dari sintesis literatur, bukan pengujian implementasi sistem baru.",
      documentUrl: "assets/research/smart-home-ml-ids.docx",
      supports: [],
      status: "Naskah riset akademik"
    },
    {
      id: "myklinik-square",
      topic: "Kualitas Sistem",
      type: "Studi Kuantitatif Deskriptif",
      title:
        "MYKLINIK.ID System Quality Analysis Using ISO/IEC 25000 (SQuaRE): A Quantitative Descriptive Study at IsawaBeauty Clinic, Tangerang",
      authors: [
        "Nestiara Lidya Kakihary"
      ],
      summary:
        "Evaluasi kualitas sistem informasi MyKlinik.id pada IsawaBeauty Clinic Tangerang menggunakan kerangka ISO/IEC 25000 (SQuaRE).",
      focus:
        "Kualitas perangkat lunak yang mendukung pendaftaran pasien, rekam medis, transaksi, dan pelaporan operasional klinik.",
      method:
        "Kuantitatif deskriptif melalui kuesioner Likert kepada lima pengguna yang dipilih dengan purposive sampling, kemudian dianalisis menggunakan Quality Index berbobot.",
      detail:
        "Penelitian melibatkan dua staf administrasi, satu perawat, dan dua dokter estetika. Berdasarkan perhitungan dalam naskah, MyKlinik.id memperoleh Quality Index berbobot sebesar 3,79 dari 5,00 dengan kategori Baik. Kesesuaian fungsi, kompatibilitas, dan usability menjadi kekuatan sistem. Rekomendasi perbaikan mencakup keamanan data, efisiensi kinerja, dokumentasi teknis, validasi data, dan pelatihan pengguna. Hasil menggambarkan penilaian lima pengguna pada klinik yang diteliti.",
      documentUrl: "assets/research/myklinik-square.docx",
      supports: [],
      status: "Naskah riset akademik"
    },
    {
      id: "metaverse-slr",
      topic: "Metaverse",
      type: "Systematic Literature Review",
      title:
        "Systematic Literature Review on Metaverse: Basic Concepts and Implications for Business and Technology in Indonesia",
      authors: [
        "Nestiara Lidya Kakihary"
      ],
      summary:
        "Kajian konsep dasar metaverse, teknologi pendukung, serta peluang dan tantangan penerapannya bagi bisnis dan teknologi di Indonesia.",
      focus:
        "Pengalaman imersif, inovasi bisnis, infrastruktur digital, literasi pengguna, privasi, dan keamanan data.",
      method:
        "Systematic literature review dengan sintesis terhadap 14 artikel jurnal sebagaimana dijelaskan dalam naskah.",
      detail:
        "Kajian membahas hubungan metaverse dengan teknologi VR/AR, kecerdasan buatan, blockchain, IoT, dan komputasi terdistribusi. Sintesis literatur mengidentifikasi peluang pengembangan layanan, pemasaran imersif, dan model bisnis digital. Tantangan mencakup kesiapan infrastruktur, literasi pengguna, regulasi, serta perlindungan data. Rekomendasi menekankan peningkatan literasi, penguatan infrastruktur, dan kolaborasi pemerintah, akademisi, serta industri.",
      documentUrl: "assets/research/metaverse-slr.docx",
      supports: [],
      status: "Naskah riset akademik"
    },
    {
      id: "hris-telos-akar-rasa",
      topic: "Kelayakan Sistem",
      type: "Studi Kasus Kualitatif",
      title:
        "Analisis Kelayakan Implementasi Human Resource Information System (HRIS) Menggunakan Pendekatan TELOS: Studi Kasus Akar Rasa Food and Space",
      authors: [
        "Nestiara Lidya Kakihary",
        "Aprilia Christianty Zampi",
        "Theodoxa Davadinata",
        "Eko Purwoko"
      ],
      summary:
        "Analisis kelayakan penerapan HRIS untuk mendukung modernisasi pengelolaan sumber daya manusia pada Akar Rasa Food and Space.",
      focus:
        "Kelayakan teknis, ekonomi, hukum, operasional, dan jadwal implementasi sistem melalui kerangka TELOS.",
      method:
        "Studi kasus dengan pendekatan kualitatif deskriptif melalui observasi, wawancara, dan telaah dokumen.",
      detail:
        "Penelitian berangkat dari pengelolaan SDM yang masih konvensional, termasuk absensi yang terpisah dari penggajian serta administrasi cuti manual. Hasil dalam naskah menunjukkan bahwa implementasi HRIS sangat layak dari aspek ekonomi, operasional, dan jadwal. Aspek teknis serta hukum dinilai layak dengan catatan, terutama terkait keamanan data biometrik dan pelindungan data pribadi. Temuan menjadi dasar pertimbangan bagi manajemen dalam merencanakan adopsi HRIS.",
      documentUrl: "assets/research/hris-telos-akar-rasa.pdf",
      supports: [],
      status: "Naskah riset akademik"
    }
  ],

  // Data kosong untuk kompatibilitas main.js lama.
  // Tidak ditampilkan sebagai fitur atau halaman.
  scenarios: [
    {
      id: "compatibility",
      label: "",
      title: "",
      output: ""
    }
  ]
};
