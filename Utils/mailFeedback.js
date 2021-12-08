const nodemailer = require("nodemailer");

const sendMail = (userEmail, feedback) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: "LinkIt <noreply@linkit.com>",
        to: process.env.FEEDBACK_EMAIL,
        subject: `Feedback | ${userEmail}`,
        text: feedback,
    };

    transporter.sendMail(mailOptions, (error) => {
        error && console.log(error);
    });
};

module.exports = sendMail;
