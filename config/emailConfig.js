const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup transporter untuk nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Ganti dengan SMTP server yang Anda gunakan, misalnya Gmail
    auth: {
        user: process.env.EMAIL_USER,  // Mengambil email pengirim dari .env
        pass: process.env.EMAIL_PASS   // Mengambil password dari .env
    }
});

// Fungsi untuk mengirim email dengan lampiran
function sendEmailWithAttachment(attachmentFiles) {
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Menggunakan email pengirim dari .env
        to: process.env.EMAIL_TO,      // Menggunakan email penerima dari .env
        subject: 'Hasil Perbandingan Excel',
        text: 'Berikut adalah hasil perbandingan file Excel Anda.',
        attachments: attachmentFiles.map(file => ({
            filename: path.basename(file),
            path: file
        }))
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Gagal mengirim email:', error);
        } else {
            console.log('Email terkirim: ' + info.response);
        }
    });
}

module.exports = sendEmailWithAttachment;
