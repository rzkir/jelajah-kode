import nodemailer from "nodemailer";

import { generateVerificationEmailTemplate } from "@/hooks/template-message";

import { generatePasswordResetEmailTemplate } from "@/hooks/template-message";

import { generateTransactionPendingEmailTemplate } from "@/hooks/template-message";

import { generateSubscriptionWelcomeEmailTemplate } from "@/hooks/template-message";

import { generateNewProductEmailTemplate } from "@/hooks/template-message";

import { generateNewArticleEmailTemplate } from "@/hooks/template-message";

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

  async sendTransactionPendingEmail(
    to: string,
    orderId: string,
    userName: string,
    totalAmount: number,
    products: Array<{ title: string; quantity: number; price: number }>
  ): Promise<void> {
    const { html, text } = generateTransactionPendingEmailTemplate(
      orderId,
      userName,
      totalAmount,
      products
    );

    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject: "Transaksi Pending - Menunggu Pembayaran",
      html,
      text,
    });
  }

  async sendSubscriptionWelcomeEmail(to: string): Promise<void> {
    const { html, text } = generateSubscriptionWelcomeEmailTemplate(to);

    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject: "Selamat Bergabung dengan Newsletter Jelajah Kode!",
      html,
      text,
    });
  }

  async sendNewProductNotificationEmail(
    to: string,
    productTitle: string,
    productThumbnail: string,
    productDescription: string,
    productPrice: number,
    productPaymentType: string,
    productUrl?: string
  ): Promise<void> {
    const { html, text } = generateNewProductEmailTemplate(
      productTitle,
      productThumbnail,
      productDescription,
      productPrice,
      productPaymentType,
      productUrl
    );

    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject: `🆕 Produk Baru: ${productTitle}`,
      html,
      text,
    });
  }

  async sendNewArticleNotificationEmail(
    to: string,
    articleTitle: string,
    articleThumbnail: string,
    articleDescription: string,
    articleUrl?: string
  ): Promise<void> {
    const { html, text } = generateNewArticleEmailTemplate(
      articleTitle,
      articleThumbnail,
      articleDescription,
      articleUrl
    );

    await this.transporter.sendMail({
      from: `"Jelajah Kode" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject: `📝 Artikel Baru: ${articleTitle}`,
      html,
      text,
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
