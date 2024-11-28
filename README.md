# Excel Comparison Tool

## Deskripsi Proyek
Aplikasi ini digunakan untuk membandingkan dua file Excel berdasarkan kolom tertentu. Hasil perbandingan disimpan dalam format CSV di dalam struktur folder tertentu. File CSV hasil perbandingan akan diperbarui secara otomatis jika sudah ada.

## Fitur
- Membandingkan dua file Excel berdasarkan kolom yang dipilih.
- Hasil perbandingan disimpan dalam file CSV.
- Struktur folder tetap untuk setiap kolom.
- Isi file CSV diperbarui jika perbandingan dilakukan ulang.
- Log kesalahan dan hasil penting disimpan di file `app.log`.

## Struktur Folder
- project-folder/
- ├── assets/                           # Folder untuk menyimpan file Excel input
- │   ├── file1.xlsx                    # File Excel pertama untuk dibandingkan
- │   ├── file2.xlsx                    # File Excel kedua untuk dibandingkan
- ├── hasil_compare/                    # Folder utama untuk menyimpan hasil perbandingan
- │   ├── tanggal_modifikasi_jakarta/   # Subfolder untuk kolom "Tanggal Modifikasi Jakarta"
- │   │   └── comparison_result.csv     # Hasil perbandingan kolom ini
- │   ├── activity_type/                # Subfolder untuk kolom "Activity Type"
- │   │   └── comparison_result.csv     # Hasil perbandingan kolom ini
- │   ├── priority_name/                # Subfolder untuk kolom "Priority Name"
- │   │   └── comparison_result.csv     # Hasil perbandingan kolom ini
- │   ├── stock_warehouse_name/         # Subfolder untuk kolom "Stock Warehouse Name"
- │   │   └── comparison_result.csv     # Hasil perbandingan kolom ini
- │   ├── service_point_name/           # Subfolder untuk kolom "Service Point Name"
- │   │   └── comparison_result.csv     # Hasil perbandingan kolom ini
- ├── logs/                             # Folder untuk menyimpan file log
- │   └── app.log                       # File log untuk mencatat kesalahan atau hasil penting
- ├── src/                              # Folder untuk menyimpan kode sumber
- │   └── compare.js                    # Skrip utama untuk menjalankan perbandingan
- ├── README.md                         # Dokumentasi proyek

## Prasyarat
- Node.js (versi terbaru)
- Paket berikut diinstal:
  - `xlsx` untuk membaca file Excel
  - `fs` untuk operasi file dan folder
  - `path` untuk pengelolaan path file dan folder

## Cara Menggunakan

1. **Persiapkan File Excel**  
   Simpan file Excel pertama (`file1.xlsx`) dan file Excel kedua (`file2.xlsx`) ke dalam folder `assets`.

2. **Install Dependencies**  
   Jalankan perintah berikut untuk menginstal semua paket yang diperlukan:
   ```bash
   npm install xlsx fs path

3. **Jalankan Aplikasi**
    Jalankan skrip compare.js dengan perintah berikut:
    ```bash
    node src/compare.js

4. **Hasil Perbandingan**
    Hasil perbandingan akan disimpan di folder hasil_compare dalam subfolder berdasarkan nama kolom. Jika file CSV sudah ada, hasil baru akan ditambahkan ke file yang sama.

5. **Log Kesalahan dan Hasil Penting**
    Jika terjadi kesalahan, cek file log di logs/app.log untuk informasi lebih lanjut.


    Kontribusi
    Jika Anda ingin berkontribusi pada proyek ini:

    Fork repositori ini.
    Buat branch fitur baru (git checkout -b fitur-baru).
    Commit perubahan Anda (git commit -m "Tambah fitur baru").
    Push ke branch Anda (git push origin fitur-baru).
    Buat Pull Request.

Kontak
Untuk pertanyaan atau masalah, hubungi: Bayu Setiawan
📧 bayuaja349@gmail.com
