const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const emailConfig = require('../config/emailConfig');

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: false, // Gunakan false untuk port 587 (gunakan true untuk port 465 untuk SSL)
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  },
  tls: {
    rejectUnauthorized: false // Menangani masalah sertifikat TLS (gunakan dengan hati-hati)
  }
});

async function sendEmail() {
  try {
    // Email details
    const mailOptions = {
      from: emailConfig.user,
      to: emailConfig.to,
      subject: 'Hasil Perbandingan Excel',
      text: 'Silakan temukan hasil perbandingan Excel terlampir.',
      attachments: [
        {
          filename: 'comparison_output.csv',
          path: path.join(__dirname, '../assets/comparison_output.csv')
        }
      ]
    };

    // Memastikan file ada sebelum mencoba mengirim email
    if (!fs.existsSync(path.join(__dirname, '../assets/comparison_output.csv'))) {
      throw new Error('File comparison_output.csv tidak ditemukan!');
    }

    // Kirim email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email terkirim: ' + info.response);
  } catch (error) {
    console.error('Gagal mengirim email:', error);
  }
}

sendEmail();
