import nodemailer from "nodemailer";

import { generateVerificationEmailTemplate } from "@/hooks/template-message";

import { generatePasswordResetEmailTemplate } from "@/hooks/template-message";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const { html, text } = generateVerificationEmailTemplate(otp);

    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject: "Welcome to Jelajah Kode! Email Verification Code",
      html,
      text,
    });
  }

  async sendPasswordResetEmail(to: string, otp: string): Promise<void> {
    const { html, text } = generatePasswordResetEmailTemplate(otp);

    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject: "Password Reset Code",
      text,
      html,
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject,
      text,
      html,
    });
  }
}

let emailService: EmailService | null = null;

function getEmailService(): EmailService {
  if (!emailService) {
    if (!process.env.EMAIL_ADMIN || !process.env.EMAIL_PASS_ADMIN) {
      throw new Error(
        "Email service not configured. Please set EMAIL_ADMIN and EMAIL_PASS_ADMIN environment variables."
      );
    }

    const emailServiceConfig: EmailConfig = {
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_ADMIN || "",
        pass: process.env.EMAIL_PASS_ADMIN || "",
      },
    };

    emailService = new EmailService(emailServiceConfig);
  }

  return emailService;
}

export { EmailService, getEmailService };
