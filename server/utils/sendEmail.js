const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If SMTP is not configured, just log to console
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('\n----------------------------------------------------');
        console.log('EMAIL SIMULATION (SMTP not configured in .env):');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message:\n${options.message}`);
        console.log('----------------------------------------------------\n');
        return;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Define the email options
    const mailOptions = {
        from: `NearNest <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Optional HTML version
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
