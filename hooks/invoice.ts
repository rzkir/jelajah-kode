import { useCallback } from "react";

import { toast } from "sonner";

import Logo from "@/helper/assets/logo.png";

import { formatIDR } from "./FormatPrice";

import useFormatDate from "./FormatDate";

const TARGET_LOGO_WIDTH = 60;

type PdfFriendlyTransaction = Transaction & {
  products: TransactionProduct[];
};

type LogoInfo = {
  dataUrl: string;
  width: number;
  height: number;
};

let cachedLogo: LogoInfo | null = null;
let logoPromise: Promise<LogoInfo | null> | null = null;

const loadLogo = (): Promise<LogoInfo | null> => {
  if (cachedLogo) return Promise.resolve(cachedLogo);
  if (logoPromise) return logoPromise;

  logoPromise = new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);

        const aspectRatio = img.width > 0 ? img.height / img.width : 1;
        const width = TARGET_LOGO_WIDTH;
        const height = width * aspectRatio;

        cachedLogo = {
          dataUrl: canvas.toDataURL("image/png"),
          width,
          height,
        };
        resolve(cachedLogo);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);

    const src =
      typeof Logo === "string" ? Logo : (Logo as { src?: string }).src || "";
    img.src = src;
  });

  return logoPromise;
};

export default function useInvoice() {
  const { formatDate } = useFormatDate();

  const downloadInvoice = useCallback(
    async (transaction?: PdfFriendlyTransaction) => {
      if (!transaction) {
        toast.error("Data transaksi tidak ditemukan");
        return;
      }

      try {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF("p", "pt", "a4");

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 50;
        let cursorY = margin;

        // Modern header with gradient-like effect
        const topHeaderHeight = 120;
        doc.setFillColor(200, 60, 80);
        doc.rect(0, 0, pageWidth, topHeaderHeight, "F");

        // Decorative pattern overlay
        doc.setFillColor(220, 80, 100);
        for (let i = 0; i < pageWidth; i += 20) {
          doc.rect(i, 0, 10, topHeaderHeight, "F");
        }

        // Logo with white background rounded rectangle
        const logo = await loadLogo();
        const logoSize = 70;
        const logoX = margin;
        const logoY = margin + 10;
        const logoBorderRadius = 8;
        const logoPadding = 5;

        if (logo) {
          // White rounded rectangle background for logo
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(
            logoX - logoPadding,
            logoY - logoPadding,
            logoSize + logoPadding * 2,
            (logoSize * logo.height) / logo.width + logoPadding * 2,
            logoBorderRadius,
            logoBorderRadius,
            "F"
          );

          doc.addImage(
            logo.dataUrl,
            "PNG",
            logoX,
            logoY,
            logoSize,
            (logoSize * logo.height) / logo.width
          );
        }

        // Company info with modern typography
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("Jelajah Kode", margin + logoSize + 25, logoY + 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255, 0.9);
        doc.text(
          "Digital Products Marketplace",
          margin + logoSize + 25,
          logoY + 40
        );

        // INVOICE badge on the right
        const badgeWidth = 140;
        const badgeHeight = 50;
        const badgeX = pageWidth - margin - badgeWidth;
        const badgeY = margin + 15;

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(255, 255, 255);
        doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 5, 5, "FD");

        doc.setTextColor(200, 60, 80);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(
          "INVOICE",
          badgeX + badgeWidth / 2,
          badgeY + badgeHeight / 2 + 7,
          {
            align: "center",
          }
        );

        cursorY = topHeaderHeight + 60;

        // Bill To section with modern card design
        const billToWidth = 280;
        const billToHeight = 100;
        const gapBetweenPanels = 30; // Gap between BILL TO and INVOICE DETAILS

        // Card background
        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(230, 230, 230);
        doc.roundedRect(margin, cursorY, billToWidth, billToHeight, 5, 5, "FD");

        // Card header
        doc.setFillColor(200, 60, 80);
        doc.roundedRect(margin, cursorY, billToWidth, 25, 5, 5, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("BILL TO", margin + 12, cursorY + 17);

        // Bill To content
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let billY = cursorY + 45;
        doc.text(transaction.user?.name || "-", margin + 12, billY);
        billY += 16;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(transaction.user?.email || "-", margin + 12, billY);

        // Invoice details card (right side)
        const detailsWidth = 280;
        const detailsX = pageWidth - margin - detailsWidth - gapBetweenPanels;

        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(230, 230, 230);
        doc.roundedRect(
          detailsX,
          cursorY,
          detailsWidth,
          billToHeight,
          5,
          5,
          "FD"
        );

        // Card header
        doc.setFillColor(200, 60, 80);
        doc.roundedRect(detailsX, cursorY, detailsWidth, 25, 5, 5, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("INVOICE DETAILS", detailsX + 12, cursorY + 17);

        // Details content
        let detailsY = cursorY + 45;
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        const detailRow = (label: string, value: string, isBold = false) => {
          doc.setFont("helvetica", isBold ? "bold" : "normal");
          doc.setTextColor(100, 100, 100);
          doc.text(label, detailsX + 12, detailsY);
          doc.setTextColor(50, 50, 50);
          doc.text(value, detailsX + detailsWidth - 12, detailsY, {
            align: "right",
          });
          detailsY += 14;
        };

        detailRow("Invoice #", transaction.order_id || "-", true);
        detailRow("Date", formatDate(transaction.created_at));
        if (transaction.payment_details?.settlement_time) {
          detailRow(
            "Settlement",
            formatDate(transaction.payment_details.settlement_time)
          );
        }

        // Status badge
        const statusColor =
          transaction.status === "success"
            ? [34, 197, 94]
            : transaction.status === "pending"
              ? [234, 179, 8]
              : [239, 68, 68];

        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.roundedRect(
          detailsX + detailsWidth - 80,
          detailsY - 5,
          70,
          18,
          3,
          3,
          "F"
        );
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(
          transaction.status.toUpperCase(),
          detailsX + detailsWidth - 45,
          detailsY + 5,
          { align: "center" }
        );

        cursorY += billToHeight + 50;

        // Modern table design
        const tableWidth = pageWidth - margin * 2;
        const tableHeaderHeight = 30;

        // Table header with gradient
        doc.setFillColor(200, 60, 80);
        doc.roundedRect(
          margin,
          cursorY,
          tableWidth,
          tableHeaderHeight,
          3,
          3,
          "F"
        );

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        const colWidths = {
          qty: 50,
          desc: tableWidth - 50 - 130 - 130,
          unitPrice: 130,
          amount: 130,
        };

        let colX = margin + 10;
        doc.text("QTY", colX, cursorY + 20);
        colX += colWidths.qty;
        doc.text("DESCRIPTION", colX, cursorY + 20);
        colX += colWidths.desc;
        doc.text("UNIT PRICE", colX, cursorY + 20, { align: "right" });
        colX += colWidths.unitPrice;
        doc.text("AMOUNT", colX, cursorY + 20, { align: "right" });

        // Table body with alternating row colors
        cursorY += tableHeaderHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        const rowHeight = 22;
        transaction.products.forEach((item, index) => {
          const isEven = index % 2 === 0;

          // Alternating row background
          if (isEven) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, cursorY, tableWidth, rowHeight, "F");
          }

          // Row border
          doc.setDrawColor(240, 240, 240);
          doc.setLineWidth(0.5);
          doc.line(
            margin,
            cursorY + rowHeight,
            margin + tableWidth,
            cursorY + rowHeight
          );

          let bodyX = margin + 10;
          doc.setTextColor(50, 50, 50);

          // Quantity
          doc.text(String(item.quantity), bodyX, cursorY + 15);
          bodyX += colWidths.qty;

          // Description with truncation
          const desc =
            item.title.length > 50
              ? `${item.title.slice(0, 47)}...`
              : item.title;
          doc.text(desc, bodyX, cursorY + 15);
          bodyX += colWidths.desc;

          // Unit Price
          const unitPrice = `Rp ${formatIDR(item.price)}`;
          doc.text(unitPrice, bodyX, cursorY + 15, { align: "right" });
          bodyX += colWidths.unitPrice;

          // Amount
          const amount = `Rp ${formatIDR(item.amount)}`;
          doc.setFont("helvetica", "bold");
          doc.text(amount, bodyX, cursorY + 15, { align: "right" });
          doc.setFont("helvetica", "normal");

          cursorY += rowHeight;
        });

        // Summary section with modern design
        cursorY += 20;
        const summaryWidth = 300;
        const summaryX = pageWidth - margin - summaryWidth;

        // Summary card
        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(230, 230, 230);
        doc.roundedRect(summaryX, cursorY, summaryWidth, 120, 5, 5, "FD");

        // Calculate totals
        const subtotal = transaction.products.reduce(
          (sum, item) => sum + (item.amount || 0),
          0
        );
        const originalTotal = transaction.products.reduce((sum, item) => {
          const originalPrice = item.price * item.quantity;
          return sum + originalPrice;
        }, 0);
        const discountTotal = Math.max(originalTotal - subtotal, 0);
        const total = transaction.total_amount ?? subtotal;

        let summaryY = cursorY + 25;
        const summaryLabelX = summaryX + 15;
        const summaryValueX = summaryX + summaryWidth - 15;

        // Subtotal
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Subtotal", summaryLabelX, summaryY);
        doc.setTextColor(50, 50, 50);
        doc.text(`Rp ${formatIDR(originalTotal)}`, summaryValueX, summaryY, {
          align: "right",
        });

        // Discount
        if (discountTotal > 0) {
          summaryY += 18;
          doc.setTextColor(34, 197, 94);
          doc.text("Discount", summaryLabelX, summaryY);
          doc.text(`-Rp ${formatIDR(discountTotal)}`, summaryValueX, summaryY, {
            align: "right",
          });
        }

        // Total with highlight
        summaryY += 25;
        doc.setFillColor(200, 60, 80);
        doc.roundedRect(summaryX, summaryY - 15, summaryWidth, 35, 5, 5, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("TOTAL", summaryLabelX, summaryY + 5);
        doc.setFontSize(14);
        doc.text(`Rp ${formatIDR(total)}`, summaryValueX, summaryY + 5, {
          align: "right",
        });

        // Footer section
        cursorY = pageHeight - 100;

        // Divider line
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(1);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);

        cursorY += 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("Terms & Conditions", margin, cursorY);

        cursorY += 16;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);

        const terms = [
          "Payment is due immediately after invoice date.",
          "Please make payment to: Jelajah Kode.",
          "For any inquiries, please contact our support team.",
        ];

        terms.forEach((term) => {
          doc.text(term, margin, cursorY);
          cursorY += 12;
        });

        // Footer text
        cursorY = pageHeight - 30;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for your business!", pageWidth / 2, cursorY, {
          align: "center",
        });

        doc.save(`invoice-${transaction.order_id || transaction._id}.pdf`);
        toast.success("Invoice berhasil diunduh");
      } catch (error) {
        console.error("Failed to generate invoice PDF:", error);
        toast.error("Gagal membuat invoice");
      }
    },
    [formatDate]
  );

  return { downloadInvoice };
}
