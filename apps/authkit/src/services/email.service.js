import nodemailer from 'nodemailer'

export default class EmailService {
    constructor() {


        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: parseInt(process.env.MAIL_PORT, 10) === 465, // true for SSL (465), false for STARTTLS (587/2525)
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            connectionTimeout: 5000,  // fail fast after 5s instead of hanging
            greetingTimeout: 5000,
            socketTimeout: 10000,
        })
    }

    async sendMail(to, subject, html) {
        return await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject,
            html,
        })
    }
}