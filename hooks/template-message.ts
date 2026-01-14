export function generateVerificationEmailTemplate(otp: string): {
  html: string;
  text: string;
} {
  const html = `
    <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Email Verification Code</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background-color:#0b1220;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td align="center" style="padding:40px 24px 20px 24px;">
                  <div style="height:48px; width:48px; border-radius:12px; background:#e6f0ff; color:#1e40af; display:inline-block; text-align:center; line-height:48px; font-weight:700; font-family:Arial, sans-serif; font-size:24px;">🔒</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 24px;">
                  <h1 style="margin:0; font-family:Arial, sans-serif; font-size:22px; line-height:1.3; color:#ffffff;">Verify your email</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:12px 24px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Use the 6‑digit code below to verify your email.</p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:16px 24px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:10px;">
                    <tr>
                      ${otp
                        .split("")
                        .map(
                          (d) => `
                            <td align="center" style="height:56px; width:48px; border-radius:12px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);">
                              <div style="font-family:Arial, sans-serif; font-size:24px; color:#ffffff; font-weight:700; letter-spacing:1px; line-height:56px;">${d}</div>
                            </td>
                          `
                        )
                        .join("")}
                  </tr>
                  </table>
                  
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:0 24px 6px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#9aa4c7;">This code expires in 10 minutes.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#7781a5;">If you didn't create an account, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td align="center" style="padding:20px 8px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#6b7280;">© ${new Date().getFullYear()} — Email verification</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Your email verification OTP is: ${otp}. It expires in 10 minutes.`;

  return { html, text };
}

export function generatePasswordResetEmailTemplate(otp: string): {
  html: string;
  text: string;
} {
  const html = `
    <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Password Reset Code</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background-color:#0b1220;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td align="center" style="padding:40px 24px 20px 24px;">
                  <div style="height:48px; width:48px; border-radius:12px; background:#e6f0ff; color:#1e40af; display:inline-block; text-align:center; line-height:48px; font-weight:700; font-family:Arial, sans-serif; font-size:24px;">🔑</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 24px;">
                  <h1 style="margin:0; font-family:Arial, sans-serif; font-size:22px; line-height:1.3; color:#ffffff;">Reset your password</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:12px 24px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Use the 6‑digit code below to reset your password.</p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:16px 24px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:10px;">
                    <tr>
                      ${otp
                        .split("")
                        .map(
                          (d) => `
                            <td align="center" style="height:56px; width:48px; border-radius:12px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);">
                              <div style="font-family:Arial, sans-serif; font-size:24px; color:#ffffff; font-weight:700; letter-spacing:1px; line-height:56px;">${d}</div>
                            </td>
                          `
                        )
                        .join("")}
                  </tr>
                  </table>
                  
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:0 24px 6px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#9aa4c7;">This code expires in 10 minutes.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#7781a5;">If you didn't request a password reset, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td align="center" style="padding:20px 8px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#6b7280;">© ${new Date().getFullYear()} — Password reset</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Your password reset OTP is: ${otp}. It expires in 10 minutes.`;

  return { html, text };
}

export function generateTransactionPendingEmailTemplate(
  orderId: string,
  userName: string,
  totalAmount: number,
  products: Array<{ title: string; quantity: number; price: number }>
): {
  html: string;
  text: string;
} {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const productsList = products
    .map(
      (product) =>
        `<tr>
          <td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.08);">
            <div style="font-family:Arial, sans-serif; font-size:14px; color:#ffffff; font-weight:500;">${
              product.title
            }</div>
            <div style="font-family:Arial, sans-serif; font-size:12px; color:#9aa4c7; margin-top:4px;">
              Qty: ${product.quantity} × ${formatCurrency(product.price)}
            </div>
          </td>
        </tr>`
    )
    .join("");

  const html = `
    <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Transaction Pending</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background-color:#0b1220;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td align="center" style="padding:40px 24px 20px 24px;">
                  <div style="height:48px; width:48px; border-radius:12px; background:#fff3cd; color:#856404; display:inline-block; text-align:center; line-height:48px; font-weight:700; font-family:Arial, sans-serif; font-size:24px;">⏳</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 24px;">
                  <h1 style="margin:0; font-family:Arial, sans-serif; font-size:22px; line-height:1.3; color:#ffffff;">Transaksi Pending</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:12px 24px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Halo ${userName}, transaksi Anda sedang menunggu pembayaran.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                    <tr>
                      <td style="padding:20px;">
                        <div style="font-family:Arial, sans-serif; font-size:12px; color:#9aa4c7; margin-bottom:8px;">Order ID</div>
                        <div style="font-family:Arial, sans-serif; font-size:16px; color:#ffffff; font-weight:600; font-family:'Courier New', monospace;">${orderId}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 20px 20px;">
                        <div style="font-family:Arial, sans-serif; font-size:12px; color:#9aa4c7; margin-bottom:12px;">Produk</div>
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                          ${productsList}
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 20px 20px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08);">
                          <div style="font-family:Arial, sans-serif; font-size:16px; color:#ffffff; font-weight:600;">Total</div>
                          <div style="font-family:Arial, sans-serif; font-size:18px; color:#ffffff; font-weight:700;">${formatCurrency(
                            totalAmount
                          )}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Silakan selesaikan pembayaran untuk melanjutkan proses transaksi Anda.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#7781a5;">Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td align="center" style="padding:20px 8px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#6b7280;">© ${new Date().getFullYear()} — Jelajah Kode</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const productsText = products
    .map(
      (product) =>
        `- ${product.title} (Qty: ${product.quantity} × ${formatCurrency(
          product.price
        )})`
    )
    .join("\n");

  const text = `Transaksi Pending

Halo ${userName}, transaksi Anda sedang menunggu pembayaran.

Order ID: ${orderId}

Produk:
${productsText}

Total: ${formatCurrency(totalAmount)}

Silakan selesaikan pembayaran untuk melanjutkan proses transaksi Anda.

Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.`;

  return { html, text };
}

export function generateSubscriptionWelcomeEmailTemplate(email: string): {
  html: string;
  text: string;
} {
  const html = `
    <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Welcome to Jelajah Kode Newsletter</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background-color:#0b1220;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td align="center" style="padding:40px 24px 20px 24px;">
                  <div style="height:48px; width:48px; border-radius:12px; background:#d1fae5; color:#065f46; display:inline-block; text-align:center; line-height:48px; font-weight:700; font-family:Arial, sans-serif; font-size:24px;">✉️</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 24px;">
                  <h1 style="margin:0; font-family:Arial, sans-serif; font-size:22px; line-height:1.3; color:#ffffff;">Selamat Bergabung!</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:12px 24px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Terima kasih telah berlangganan newsletter Jelajah Kode!</p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                    <tr>
                      <td style="padding:20px;">
                        <p style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">
                          Halo <strong style="color:#ffffff;">${email}</strong>,
                        </p>
                        <p style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">
                          Kami sangat senang Anda telah bergabung dengan komunitas Jelajah Kode! Anda akan menerima update terbaru tentang:
                        </p>
                        <ul style="margin:12px 0; padding-left:20px; font-family:Arial, sans-serif; font-size:14px; line-height:1.8; color:#c9d2f0;">
                          <li>Artikel dan tutorial coding terbaru</li>
                          <li>Tips dan trik pengembangan web</li>
                          <li>Update produk dan fitur baru</li>
                          <li>Event dan workshop eksklusif</li>
                        </ul>
                        <p style="margin:12px 0 0 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">
                          Kami berkomitmen untuk memberikan konten berkualitas yang membantu perjalanan coding Anda.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#7781a5;">Jika Anda tidak berlangganan newsletter ini, silakan abaikan email ini.</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td align="center" style="padding:20px 8px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#6b7280;">© ${new Date().getFullYear()} — Jelajah Kode</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Selamat Bergabung!

Terima kasih telah berlangganan newsletter Jelajah Kode!

Halo ${email},

Kami sangat senang Anda telah bergabung dengan komunitas Jelajah Kode! Anda akan menerima update terbaru tentang:
- Artikel dan tutorial coding terbaru
- Tips dan trik pengembangan web
- Update produk dan fitur baru
- Event dan workshop eksklusif

Kami berkomitmen untuk memberikan konten berkualitas yang membantu perjalanan coding Anda.

Jika Anda tidak berlangganan newsletter ini, silakan abaikan email ini.

© ${new Date().getFullYear()} — Jelajah Kode`;

  return { html, text };
}

export function generateNewProductEmailTemplate(
  productTitle: string,
  productThumbnail: string,
  productDescription: string,
  productPrice: number,
  productPaymentType: string,
  productUrl?: string
): {
  html: string;
  text: string;
} {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const priceDisplay =
    productPaymentType === "free" ? "Gratis" : formatCurrency(productPrice);
  const descriptionPreview =
    productDescription.length > 150
      ? productDescription.substring(0, 150) + "..."
      : productDescription;

  const html = `
    <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Produk Baru - ${productTitle}</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background-color:#0b1220;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td align="center" style="padding:40px 24px 20px 24px;">
                  <div style="height:48px; width:48px; border-radius:12px; background:#dbeafe; color:#1e40af; display:inline-block; text-align:center; line-height:48px; font-weight:700; font-family:Arial, sans-serif; font-size:24px;">🆕</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 24px;">
                  <h1 style="margin:0; font-family:Arial, sans-serif; font-size:22px; line-height:1.3; color:#ffffff;">Produk Baru Telah Tersedia!</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:12px 24px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Kami senang mengumumkan produk baru yang siap untuk Anda!</p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                    <tr>
                      <td style="padding:20px;">
                        ${
                          productThumbnail
                            ? `
                        <div style="text-align:center; margin-bottom:20px;">
                          <img src="${productThumbnail}" alt="${productTitle}" style="max-width:100%; height:auto; border-radius:8px; max-height:200px;" />
                        </div>
                        `
                            : ""
                        }
                        <h2 style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:18px; line-height:1.3; color:#ffffff;">${productTitle}</h2>
                        <p style="margin:0 0 16px 0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">${descriptionPreview}</p>
                        <div style="display:flex; align-items:center; gap:12px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08);">
                          <div style="font-family:Arial, sans-serif; font-size:16px; color:#ffffff; font-weight:600;">Harga:</div>
                          <div style="font-family:Arial, sans-serif; font-size:18px; color:#60a5fa; font-weight:700;">${priceDisplay}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${
                productUrl
                  ? `
              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <a href="${productUrl}" style="display:inline-block; padding:12px 24px; background:#3b82f6; color:#ffffff; text-decoration:none; border-radius:8px; font-family:Arial, sans-serif; font-size:14px; font-weight:600;">Lihat Produk</a>
                </td>
              </tr>
              `
                  : ""
              }

              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#7781a5;">Terima kasih telah berlangganan newsletter Jelajah Kode!</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td align="center" style="padding:20px 8px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#6b7280;">© ${new Date().getFullYear()} — Jelajah Kode</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Produk Baru Telah Tersedia!

Kami senang mengumumkan produk baru yang siap untuk Anda!

${productTitle}

${descriptionPreview}

Harga: ${priceDisplay}

${productUrl ? `Lihat produk: ${productUrl}` : ""}

Terima kasih telah berlangganan newsletter Jelajah Kode!

© ${new Date().getFullYear()} — Jelajah Kode`;

  return { html, text };
}

export function generateNewArticleEmailTemplate(
  articleTitle: string,
  articleThumbnail: string,
  articleDescription: string,
  articleUrl?: string
): {
  html: string;
  text: string;
} {
  const descriptionPreview =
    articleDescription.length > 150
      ? articleDescription.substring(0, 150) + "..."
      : articleDescription;

  const html = `
    <!doctype html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>Artikel Baru - ${articleTitle}</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin:0; padding:0; background-color:#0b1220;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b1220;">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
              <tr>
                <td align="center" style="padding:40px 24px 20px 24px;">
                  <div style="height:48px; width:48px; border-radius:12px; background:#fef3c7; color:#92400e; display:inline-block; text-align:center; line-height:48px; font-weight:700; font-family:Arial, sans-serif; font-size:24px;">📝</div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:8px 24px;">
                  <h1 style="margin:0; font-family:Arial, sans-serif; font-size:22px; line-height:1.3; color:#ffffff;">Artikel Baru Telah Tersedia!</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:12px 24px 20px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">Kami senang berbagi artikel baru yang siap untuk Anda baca!</p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.04); border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                    <tr>
                      <td style="padding:20px;">
                        ${
                          articleThumbnail
                            ? `
                        <div style="text-align:center; margin-bottom:20px;">
                          <img src="${articleThumbnail}" alt="${articleTitle}" style="max-width:100%; height:auto; border-radius:8px; max-height:200px;" />
                        </div>
                        `
                            : ""
                        }
                        <h2 style="margin:0 0 12px 0; font-family:Arial, sans-serif; font-size:18px; line-height:1.3; color:#ffffff;">${articleTitle}</h2>
                        <p style="margin:0; font-family:Arial, sans-serif; font-size:14px; line-height:1.6; color:#c9d2f0;">${descriptionPreview}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${
                articleUrl
                  ? `
              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <a href="${articleUrl}" style="display:inline-block; padding:12px 24px; background:#3b82f6; color:#ffffff; text-decoration:none; border-radius:8px; font-family:Arial, sans-serif; font-size:14px; font-weight:600;">Baca Artikel</a>
                </td>
              </tr>
              `
                  : ""
              }

              <tr>
                <td align="center" style="padding:0 24px 24px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:12px; color:#7781a5;">Terima kasih telah berlangganan newsletter Jelajah Kode!</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td align="center" style="padding:20px 8px;">
                  <p style="margin:0; font-family:Arial, sans-serif; font-size:11px; color:#6b7280;">© ${new Date().getFullYear()} — Jelajah Kode</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `Artikel Baru Telah Tersedia!

Kami senang berbagi artikel baru yang siap untuk Anda baca!

${articleTitle}

${descriptionPreview}

${articleUrl ? `Baca artikel: ${articleUrl}` : ""}

Terima kasih telah berlangganan newsletter Jelajah Kode!

© ${new Date().getFullYear()} — Jelajah Kode`;

  return { html, text };
}
