require('dotenv').config();
const nodemailer = require('nodemailer');

async function main() {
    console.log('User:', process.env.MAIL_USER);
    // Do not log the full password
    console.log('Pass length:', process.env.MAIL_PASS ? process.env.MAIL_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: process.env.MAIL_USER,
            subject: "Test Email from ORAU Debugger",
            text: "If you receive this, nodemailer is workings.",
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

main();
