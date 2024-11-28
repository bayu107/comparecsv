const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Membaca file Excel pertama dan kedua
let file1, file2;

// Fungsi untuk menulis log ke file hanya untuk error dan hasil penting
function logToFile(message) {
    const logFilePath = path.join(__dirname, '../logs/app.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

// Membaca file pertama dan kedua dengan log kesalahan
try {
    console.log("Membaca file1.xlsx...");
    file1 = XLSX.readFile('C:/Users/bayua/OneDrive/Documents/Project/excel-comparison/assets/file1.xlsx');
} catch (error) {
    console.error("Error membaca file1.xlsx:", error);
    logToFile("Error membaca file1.xlsx: " + error.message);
}

try {
    console.log("Membaca file2.xlsx...");
    file2 = XLSX.readFile('C:/Users/bayua/OneDrive/Documents/Project/excel-comparison/assets/file2.xlsx');
} catch (error) {
    console.error("Error membaca file2.xlsx:", error);
    logToFile("Error membaca file2.xlsx: " + error.message);
}

// Jika pembacaan file berhasil
if (file1 && file2) {
    // Mengambil sheet pertama dari masing-masing file
    const sheet1 = file1.Sheets[file1.SheetNames[0]];
    const sheet2 = file2.Sheets[file2.SheetNames[0]];

    // Mengonversi sheet menjadi JSON (array of objects)
    const data1 = XLSX.utils.sheet_to_json(sheet1);
    const data2 = XLSX.utils.sheet_to_json(sheet2);

    console.log('Data file1 dan file2 berhasil dimuat.');

    // Memilih kolom-kolom yang akan dibandingkan
    const compareColumns = [
        'Tanggal Modifikasi Jakarta',
        'activity_type',
        'priority_name',
        'stock_warehouse_name',
        'service_point_name'
    ];

    // Fungsi untuk membandingkan data berdasarkan kolom yang dipilih
    const compareRows = (row1, row2, column) => {
        if (row1[column] !== row2[column]) {
            return {
                column,
                file1_value: row1[column],
                file2_value: row2[column]
            };
        }
        return null;
    };

    // Fungsi untuk menghitung persentase kecocokan
    const calculateMatchPercentage = (totalRows, differingRows) => {
        return ((totalRows - differingRows) / totalRows) * 100;
    };

    // Menyimpan hasil perbandingan dalam objek per kolom
    let columnResults = {};

    // Membuat folder untuk menyimpan hasil perbandingan CSV jika belum ada
    const resultFolder = path.join(__dirname, '../hasil_compare');
    if (!fs.existsSync(resultFolder)) {
        fs.mkdirSync(resultFolder);
    }

    // Memproses perbandingan untuk setiap kolom
    compareColumns.forEach(column => {
    console.log(`Membandingkan kolom: ${column}`);
    let differences = [];
    let differingRows = 0;

    // Menyimpan hasil perbandingan untuk setiap baris
    data1.forEach((row1, index1) => {
        const row2 = data2[index1]; // Asumsi baris yang dibandingkan berada pada posisi yang sama
        if (row2) {
            const diff = compareRows(row1, row2, column);
            if (diff) {
                differences.push({ diff, index1 });
                differingRows++;
            }
        }
    });

    const matchPercentage = calculateMatchPercentage(data1.length, differingRows);
    columnResults[column] = { differences, matchPercentage };

    // Log hasil perbandingan di console
    console.log(`Kecocokan untuk kolom ${column}: ${matchPercentage.toFixed(2)}%`);

    // Menyimpan hasil perbandingan ke dalam file CSV untuk setiap kolom yang dibandingkan
    let resultCSV = [
        `"Perbandingan ${column} - Kecocokan: ${matchPercentage.toFixed(2)}%"` // Menambahkan tanda kutip untuk memastikan format yang benar
    ];
    if (differences.length > 0) {
        resultCSV.push('"Row","File1_Value","File2_Value"'); // Tambahkan tanda kutip pada header
        differences.forEach(({ diff, index1 }) => {
            // Menggunakan index1 + 2 untuk mengakomodasi baris pertama sebagai header
            resultCSV.push(`"${index1 + 2}","${diff.file1_value}","${diff.file2_value}"`);
        });
    }

    // Menentukan path output file di folder hasil_compare
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[-:]/g, '').replace('T', '-').substring(0, 15);
    const columnFolderPath = path.join(resultFolder, column.replace(/ /g, '_').toLowerCase());

    // Membuat subfolder untuk kolom jika belum ada
    if (!fs.existsSync(columnFolderPath)) {
        fs.mkdirSync(columnFolderPath);
    }

    const outputFileName = path.join(columnFolderPath, `${formattedDate}_${column.replace(/ /g, '_').toLowerCase()}_comparison.csv`);
    fs.writeFileSync(outputFileName, resultCSV.join('\n'));

    // Hanya menulis log untuk file perbandingan yang memiliki perbedaan
    if (matchPercentage !== 100) {
        logToFile(`Perbandingan untuk kolom '${column}' selesai. Kecocokan: ${matchPercentage.toFixed(2)}%`);
    }
});

} else {
    logToFile("Gagal memuat file Excel.");
}
