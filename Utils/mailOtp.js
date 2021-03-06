const nodemailer = require("nodemailer");

const sendMail = (mailTo, otp, path = "user/signup") => {
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
                    Hello!
                </h2>

                <h3 style="text-align: center; font-family: 'Trebuchet MS', sans-serif;font-size: x-large; color: #000; font-weight: 500; margin-top: 30px ">
                    Your One Time Password is
                </h3>
                <h2 style="text-align: center; font-family: 'Trebuchet MS', sans-serif;font-size: xxx-large; background-color: #002E33; color: #fff; font-weight: 900; letter-spacing: 7px; margin: 60px auto 0 auto; width:fit-content; padding: 20px; border-radius:7px;">
                    ${otp}
                </h2>
                <p style="text-align: center; font-family: 'Trebuchet MS', sans-serif; font-size: large; color: #111; margin-top: 30px;">Or click on the link</p>
                <a 
                    href="${
                        process.env.WEBAPP_LINK +
                        `${path}?email=${mailTo}&otp=${otp}`
                    }" 
                    style="text-align: center; font-size: large; color: #002E33;">
                    ${
                        process.env.WEBAPP_LINK +
                        `${path}?email=${mailTo}&otp=${otp}`
                    }
                </a>
                <p style="text-align: center; font-family: 'Trebuchet MS', sans-serif; font-size: medium; color: #666; margin-top: 60px;">
                    OTP is valid for next 30 minutes.
                </p>
                <p style="text-align: center; font-family: 'Trebuchet MS', sans-serif; font-size: medium; color: #666;">
                    Please do not share the OTP or login credentials with anyone.
                </p>
                <p style="text-align: center; font-family: 'Trebuchet MS', sans-serif; font-size: large; color: #002E33; margin-top: 30px;">
                    LinkIt
                </p>
            </div>
        </div>
`;

    const mailOptions = {
        from: "LinkIt <noreply@linkit.com>",
        to: mailTo,
        subject: "LinkIt OTP",
        html: body,
    };

    transporter.sendMail(mailOptions, (error) => {
        error && console.log(error);
    });
};

module.exports = sendMail;
