import Script from "next/script";

import "@/helper/style/globals.css";

import Provider from "@/helper/routing/Provider";

import Pathname from "@/helper/routing/Pathname";

import { geistSans, geistMono } from "@/helper/fonts/Fonts";

import { ThemeProvider } from "@/utils/theme/theme-provider";

import { HomePageMetadata } from "@/helper/meta/Metadata";

import LanguageInitializer from "@/components/layout/LanguageInitializer";

export const metadata = HomePageMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const midtransClientKey = process.env.MIDTRANS_CLIENT_KEY || "";

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageInitializer />
        {midtransClientKey && (
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={midtransClientKey}
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider>
            <Pathname>{children}</Pathname>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
