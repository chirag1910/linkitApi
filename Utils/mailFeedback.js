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

    sendThankyouMail(userEmail, feedback);
};

const sendThankyouMail = (userEmail, feedback) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const body = `
        <div style="text-align: center;">
            <div style="text-align: center;margin: auto;padding: 50px 30px; width: 80%; max-width:500px; background-color:rgb(0, 138, 153, 0.1); border-radius: 10px;">
                <h2 style="text-align: center; font-family: 'Trebuchet MS', sans-serif;font-size: xx-large; color: #002E33; font-weight: 600; letter-spacing: 3px;">
                    Thanks for your feedback!
                </h2>

                <h3 style="text-align: center; font-family: 'Trebuchet MS', sans-serif;font-size: x-large; color: #000; font-style: italic; margin-top: 50px ">
                    '''${feedback}'''
                </h3>
                <p style="text-align: center; font-family: 'Trebuchet MS', sans-serif;font-size: medium; color: #666; margin-top: 50px ">
                    We will try to respond to your query within 24 hours.
                </p>
                <p style="text-align: center; font-family: 'Trebuchet MS', sans-serif;font-size: large; color: #002E33; margin-top: 30px;">
                    LinkIt
                </p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: "LinkIt <noreply@linkit.com>",
        to: userEmail,
        subject: "Thank you for your feedback | LinkIt",
        text: body,
    };

    transporter.sendMail(mailOptions, (error) => {
        error && console.log(error);
    });
};

module.exports = sendMail;
