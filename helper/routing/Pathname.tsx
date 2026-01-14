"use client";

import React, { Fragment } from "react";

import { usePathname } from "next/navigation";

import Header from "@/components/layout/Header";

import { Footer } from "@/components/layout/Footer";

import BottomNavigation from "@/components/layout/BottomNavigation";

import AiAgent from "@/helper/ai-assist/AiAgent"

import { Toaster } from "sonner";

import CartSheet from "@/components/cart/CartSheet";

import { useCart } from "@/utils/context/CartContext";

import BreadcrumbScript from "@/helper/breadchumb/Script";

import { generateBreadcrumbItems } from "@/helper/breadchumb/generateBreadcrumb";

const Pathname = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { cartSheetOpen, setCartSheetOpen } = useCart();

  const isRoute =
    pathname?.includes("/signin") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/forget-password") ||
    pathname?.includes("/verification") ||
    pathname?.includes("/change-password") ||
    pathname?.includes("/reset-password") ||
    pathname?.includes("/checkout") ||
    pathname?.includes("/profile/") ||
    pathname?.includes("/dashboard") ||
    false;

  const shouldShowBreadcrumb = !pathname?.includes("/dashboard");
  const breadcrumbItems = shouldShowBreadcrumb ? generateBreadcrumbItems(pathname) : [];

  return (
    <Fragment>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 3000,
          className: "font-medium",
        }}
      />
      {shouldShowBreadcrumb && breadcrumbItems.length > 0 && (
        <BreadcrumbScript items={breadcrumbItems} />
      )}
      {!isRoute && <Header />}
      {children}
      {!isRoute && <Footer />}
      {!isRoute && <BottomNavigation />}
      {!isRoute && <div className="fixed bottom-6 right-6 z-50">
        <AiAgent />
      </div>}
      <CartSheet open={cartSheetOpen} onOpenChange={setCartSheetOpen} />
    </Fragment>
  );
};

export default Pathname;
