const nodemailer = require("nodemailer");

const sendMail = (mailTo, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: mailTo,
        subject: "Kakeibo OTP to reset password",
        html: `<h1>${otp}</h1><h2> is your OTP to reset Kakeibo password</h2>
        <p>OTP is valid for next 30 minutes</p>
        <p>Please do not share the OTP or login credentials with anyone.</p>`,
    };

    transporter.sendMail(mailOptions, (error) => {
        error && console.log(error);
    });
};

module.exports = sendMail;
