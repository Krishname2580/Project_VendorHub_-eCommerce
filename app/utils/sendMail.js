const nodemailer = require("nodemailer");

class SendMail {

    async sendMail(to, subject, html) {

        try {

            const transporter = nodemailer.createTransport({

                host: process.env.EMAIL_HOST,

                port: process.env.EMAIL_PORT,

                secure: false,

                auth: {

                    user: process.env.EMAIL_USER,

                    pass: process.env.EMAIL_PASS

                }

            });

            const mailOptions = {

                from: `"VendorHub" <${process.env.EMAIL_FROM}>`,

                to,

                subject,

                html

            };

            const info = await transporter.sendMail(mailOptions);

            console.log("Email Sent Successfully");
            console.log(info.messageId);

            return info;

        } catch (error) {

            console.log("Email Error:", error);

            throw error;

        }

    }

}

module.exports = new SendMail();