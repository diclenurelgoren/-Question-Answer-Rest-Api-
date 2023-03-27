const nodemailler = require("nodemailer");

const sendemail = async (mailOptions) => {

    let transporter = nodemailler.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let info = await transporter.sendMail(mailOptions);
    console.log(info);
}

module.exports = sendemail;