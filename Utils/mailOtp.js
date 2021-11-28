const nodemailer = require("nodemailer");

const sendMail = (mailTo, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: mailTo,
        subject: "Kakeibo OTP",
        html: `<h1>OTP: ${otp}</h1>
        <p>OTP is valid for next 30 minutes.</p>
        <p>Please do not share the OTP or login credentials with anyone.</p>`,
    };

    transporter.sendMail(mailOptions, (error) => {
        error && console.log(error);
    });
};

module.exports = sendMail;
