const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SMTP Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // SMTP server (e.g., Gmail SMTP)
    port: 465, // SMTP port (587 for TLS or 465 for SSL)
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER, // Replace with your SMTP email
        pass: process.env.EMAIL_PASS, // Replace with your SMTP email password or app-specific password
    }
});

// API Route to Send OTP Email
app.post('/send-otp', async (req, res) => {
    const { email, otp } = req.body;

    const mailOptions = {
        from: 'pavan.test03@gmail.com', // Sender address
        to: email, // Receiver's email
        subject: 'Your OTP for Password Reset', // Email subject
        text: `Your OTP is: ${otp}. Use this to reset your password.`, // Plain text body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send email' });
    }
});

// API Route to Send PNR Email
app.post('/send-pnr', async (req, res) => {
    const { email, pnr, name, trainName, trainNumber, travelDate, source, destination } = req.body;

    const mailOptions = {
        from: 'pavan.test03@gmail.com',
        to: email,
        subject: 'Your Train Ticket & PNR Confirmation',
        text: `Dear ${name},\n\nYour ticket has been booked successfully!\n\nPNR: ${pnr}\nTrain: ${trainName} (${trainNumber})\nDate: ${travelDate}\nFrom: ${source}\nTo: ${destination}\n\nPlease keep this PNR for future reference.\n\nThank you for booking with us!`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('PNR Email sent: ' + info.response);
        res.status(200).send({ message: 'PNR email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send PNR email' });
    }
});

// API Route to Send Cancellation Email
app.post('/send-cancel', async (req, res) => {
    const { email, name, pnr, trainName, trainNumber, travelDate, source, destination } = req.body;

    const mailOptions = {
        from: 'pavan.test03@gmail.com',
        to: email,
        subject: 'Your Train Ticket Cancellation Confirmation',
        text: `Dear ${name},\n\nYour booking has been cancelled.\n\nPNR: ${pnr}\nTrain: ${trainName} (${trainNumber})\nDate: ${travelDate}\nFrom: ${source}\nTo: ${destination}\n\nIf this was a mistake or you have questions, please contact support.\n\nThank you.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Cancellation Email sent: ' + info.response);
        res.status(200).send({ message: 'Cancellation email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send cancellation email' });
    }
});

// API Route to Send Package Booking Receipt Email
app.post('/send-package-receipt', async (req, res) => {
    const { email, name, packageName, travelDate, persons, price, bookingId, days, totalPersons } = req.body;

    const mailOptions = {
        from: 'pavan.test03@gmail.com',
        to: email,
        subject: 'Your Package Booking Receipt',
        text: `Dear ${name},\n\nYour package booking is confirmed!\n\nBooking ID: ${bookingId}\nPackage: ${packageName}\nTravel Date: ${travelDate}\nPersons: ${persons}\nDays: ${days}\nPrice: ${price}\n\nThank you for booking with us!`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Package Receipt Email sent: ' + info.response);
        res.status(200).send({ message: 'Package receipt email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to send package receipt email' });
    }
});

// Start the Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
