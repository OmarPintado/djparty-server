import {createTransport} from "nodemailer";

export class MailerService {
    constructor(
        private readonly transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODE_MAILER_USER,
                pass: process.env.NODE_MAILER_PASS
            }
        })
    ) {}

    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: process.env.NODE_MAILER_USER,
            to,
            subject,
            text,
        });
    }
};