Product Requirements Document (PRD)
Nama Produk: Sistem Inventaris Aset & Lab Berbasis QR Code
Versi: 1.0

1. Ringkasan Eksekutif
Aplikasi web ini adalah sistem manajemen inventaris modern yang dirancang khusus untuk pencatatan, pelacakan, dan pelaporan aset fisik (seperti PC, router, switch) serta barang habis pakai di lingkungan lab atau infrastruktur IT. Sistem ini memanfaatkan QR Code dinamis untuk mempercepat identifikasi barang di lapangan. Terdapat portal publik interaktif tanpa login yang memungkinkan pengguna ruangan (seperti siswa) melaporkan kerusakan secara mandiri, serta fitur dynamic theming agar tampilan aplikasi dapat disesuaikan dengan identitas visual institusi.

2. Tujuan Produk
Sentralisasi Data Aset: Menciptakan satu sumber kebenaran (single source of truth) terkait spesifikasi, lokasi, dan status setiap barang.

Pelacakan Siklus Hidup & Audit: Mengetahui rekam jejak perangkat sejak pertama kali didata, dipindahkan antar lab/ruangan, hingga mengalami kerusakan atau perbaikan.

Desentralisasi Pelaporan: Mempercepat respons maintenance berkat adanya laporan instan dari pengguna di lapangan melalui scan QR.

Fleksibilitas Branding: Memungkinkan admin untuk mengubah warna dan identitas aplikasi secara mandiri tanpa harus mengubah source code.

3. Target Pengguna (User Personas)
Administrator: Memiliki kontrol absolut terhadap sistem. Bertugas mengatur data master (kategori, daftar lokasi), manajemen user (menambah teknisi), serta mengelola pengaturan tema dan branding aplikasi.

Toolman / Teknisi: Pengelola operasional harian. Bertugas menginput aset baru, mencetak QR code massal, memperbarui status barang, memindahkan lokasi aset, serta merespons laporan kerusakan dari pengguna.

Siswa / Pengguna Ruangan (Publik): Pengguna akhir yang berinteraksi tanpa otentikasi. Menggunakan smartphone untuk memindai QR code guna melihat identitas perangkat atau melaporkan kendala teknis.

4. Kebutuhan Fungsional Utama (Functional Requirements)
A. Manajemen Katalog & Aset
Pencatatan Barang Tetap: Modul untuk mencatat perangkat keras (PC, Monitor, Mikrotik, dll) dengan detail spesifikasi, status, dan lokasi saat ini.

Pencatatan Consumables: Modul khusus untuk mengelola barang habis pakai (kabel UTP, konektor, baut) yang dilengkapi dengan Threshold Alert (peringatan visual di dashboard jika stok menipis).

Manajemen Hierarki Data: Pengaturan dinamis untuk mengelompokkan kategori barang dan titik penempatannya.

B. Modul QR Code Dinamis
Generator Otomatis (URL-Based): Sistem menghasilkan QR code yang terhubung ke URL unik (UUID) untuk setiap barang.

Cetak Massal (Bulk Print): Antarmuka yang memungkinkan teknisi memilih banyak barang sekaligus, lalu mengekspor QR code ke dalam satu file PDF berformat grid yang siap dicetak ke kertas stiker label.

C. Portal Publik & Ticketing (Hasil Scan QR)
Halaman Read-Only Mobile First: Menampilkan informasi perangkat secara responsif di layar ponsel.

Data Hiding: Menyembunyikan informasi sensitif (harga beli, IP address, kredensial) dari tampilan publik.

Form Lapor Kendala: Tombol interaktif bagi pengguna untuk mengirimkan laporan (Nama Pelapor, Kelas, Deskripsi Kendala) yang langsung masuk ke dashboard teknisi.

Keamanan Anti-Spam (Rate Limiting): Membatasi jumlah pengiriman form dari satu IP Address dalam rentang waktu tertentu untuk mencegah laporan fiktif/spam.

D. Audit Trail (Log Riwayat)
Pencatatan Otomatis: Sistem merekam secara kronologis setiap perubahan atribut krusial pada aset (seperti perpindahan ruangan atau perubahan status dari "Tersedia" menjadi "Maintenance").

Detail Log: Menampilkan informasi mengenai apa yang diubah, waktu kejadian, dan siapa akun yang melakukan perubahan.

E. Pengaturan Sistem & Tema (Admin Only)
Dynamic Theming (White-labeling): Panel pengaturan di mana Admin dapat mengubah nama institusi, logo, dan Warna Utama (Primary Color).

Real-time Update: Perubahan warna akan langsung diterapkan secara global ke seluruh komponen aplikasi (tombol, header, menu) tanpa perlu deployment ulang.

5. Kebutuhan Antarmuka (UI/UX)
Design Language: Mengusung filosofi Clean and Modern. Penggunaan white space yang seimbang dan tipografi yang jelas untuk meminimalisir kelelahan visual saat melihat tabel data yang padat.

Komponen UI: Menggunakan shadcn/ui untuk konsistensi desain tingkat tinggi pada elemen data table (dengan fitur search, filter, sort, pagination), form, modal/dialog, dan dropdown.

Micro-interactions & Animasi: Mengintegrasikan Framer Motion untuk menghadirkan animasi transisi halaman yang mulus dan feedback visual (seperti indikator loading atau success state).

Adaptabilitas Tema: Dibangun menggunakan pendekatan CSS Variables agar warna utama dapat di- inject dari database. Aplikasi juga harus mendukung mode gelap (Dark Mode Ready).

6. Spesifikasi Teknis (Tech Stack & Infrastruktur)
Frontend Interface: React.js

Styling & UI Library: Tailwind CSS, shadcn/ui, Framer Motion

Backend & API Routing: Laravel (PHP)

Frontend-Backend Bridge: Inertia.js (menjadikan aplikasi berjalan sebagai Single Page Application)

Database: PostgreSQL atau MySQL

Deployment Architecture (Rekomendasi):

Aplikasi, Web Server (Nginx/Apache), dan Database dibungkus dalam Docker Containers.

Dijalankan di atas environment virtualisasi Proxmox (menggunakan LXC atau VM) berbasis Ubuntu Server untuk isolasi sistem, kemudahan scaling, dan kemudahan backup.

7. Batasan Sistem (Out of Scope)
Tidak ada Monitoring Jaringan Otomatis: Sistem murni digunakan untuk pencatatan administratif. Tidak ada fitur integrasi hardware (seperti SNMP) untuk mengecek status online/offline perangkat secara real-time.

Tidak ada Modul Akuntansi: Tidak mencakup perhitungan penyusutan nilai aset finansial (depresiasi harga).