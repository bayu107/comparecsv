const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menulis log ke file
function logToFile(message) {
    const logFilePath = path.join(__dirname, '../logs/app.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

// Fungsi untuk membaca file Excel
function readExcelFile(filePath) {
    try {
        return XLSX.readFile(filePath);
    } catch (error) {
        console.error(`Error membaca ${filePath}:`, error);
        logToFile(`Error membaca ${filePath}: ${error.message}`);
        return null;
    }
}

// Fungsi untuk membandingkan dua data berdasarkan kolom tertentu
function compareData(data1, data2, column) {
    let differences = [];
    data1.forEach((row1, index) => {
        const row2 = data2[index];
        if (row2 && row1[column] !== row2[column]) {
            differences.push({
                row: index + 2, // Mengakomodasi header
                file1_value: row1[column],
                file2_value: row2[column],
            });
        }
    });
    return differences;
}

// Fungsi untuk menghitung persentase kecocokan
function calculateMatchPercentage(totalRows, differingRows) {
    return ((totalRows - differingRows) / totalRows) * 100;
}

// Fungsi utama
function compareExcelFiles(file1Path, file2Path) {
    const file1 = readExcelFile(file1Path);
    const file2 = readExcelFile(file2Path);

    if (file1 && file2) {
        const data1 = XLSX.utils.sheet_to_json(file1.Sheets[file1.SheetNames[0]]);
        const data2 = XLSX.utils.sheet_to_json(file2.Sheets[file2.SheetNames[0]]);
        
        const compareColumns = [
            'Tanggal Modifikasi Jakarta',
            'activity_type',
            'priority_name',
            'stock_warehouse_name',
            'service_point_name'
        ];

        compareColumns.forEach(column => {
            const differences = compareData(data1, data2, column);
            const matchPercentage = calculateMatchPercentage(data1.length, differences.length);

            console.log(`Kecocokan untuk kolom ${column}: ${matchPercentage.toFixed(2)}%`);

            if (differences.length > 0) {
                const resultCSV = [
                    `"Perbandingan ${column} - Kecocokan: ${matchPercentage.toFixed(2)}%"`,
                    '"Row","File1_Value","File2_Value"',
                    ...differences.map(diff => `"${diff.row}","${diff.file1_value}","${diff.file2_value}"`)
                ];

                const resultFolder = path.join(__dirname, '../hasil_compare', column.replace(/ /g, '_').toLowerCase());
                if (!fs.existsSync(resultFolder)) {
                    fs.mkdirSync(resultFolder, { recursive: true });
                }

                const outputFileName = path.join(resultFolder, `${new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').substring(0, 15)}_${column.replace(/ /g, '_').toLowerCase()}_comparison.csv`);
                fs.writeFileSync(outputFileName, resultCSV.join('\n'));
                logToFile(`Perbandingan untuk kolom '${column}' selesai. Kecocokan: ${matchPercentage.toFixed(2)}%`);
            }
        });
    } else {
        logToFile("Gagal memuat file Excel.");
    }
}

// Memanggil fungsi utama dengan path file
compareExcelFiles('C:/Users/bayua/OneDrive/Documents/Project/excel-comparison/assets/file1.csv', 'C:/Users/bayua/OneDrive/Documents/Project/excel-comparison/assets/file2.csv');