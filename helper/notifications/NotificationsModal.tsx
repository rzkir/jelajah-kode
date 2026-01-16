"use client";

import { useEffect } from "react";

import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Bell, Sparkles, Zap } from "lucide-react";

import { useNotifications } from "@/utils/context/NotificationsContext";

import { useTranslation } from "@/hooks/useTranslation";

export default function NotificationsModal({
    isOpen: externalIsOpen,
    onOpenChange: externalOnOpenChange,
}: NotificationsModalProps) {
    const { isEnabled, toggleNotifications, showModal, setShowModal, requestBrowserPermission } = useNotifications();
    const { t, refreshTranslations } = useTranslation();

    // Use external props if provided, otherwise use context
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : showModal;
    const onOpenChange = externalOnOpenChange || setShowModal;

    // Refresh translations when modal opens to ensure latest translations are loaded
    useEffect(() => {
        if (isOpen) {
            refreshTranslations();
        }
    }, [isOpen, refreshTranslations]);

    const handleAllow = async () => {
        // Request browser notification permission
        const permissionGranted = await requestBrowserPermission();

        if (permissionGranted) {
            // Aktifkan notifikasi jika belum aktif
            if (!isEnabled) {
                toggleNotifications();
            }
            // Simpan bahwa user sudah memberikan izin dan modal sudah ditampilkan
            if (typeof window !== "undefined") {
                localStorage.setItem("jelajah-kode-notifications", JSON.stringify({
                    enabled: true,
                }));
                localStorage.setItem("jelajah-kode-notifications-modal-shown", "true");
            }
        } else {
            // Jika user menolak browser permission, tetap simpan tapi dengan enabled: false
            if (typeof window !== "undefined") {
                localStorage.setItem("jelajah-kode-notifications", JSON.stringify({
                    enabled: false,
                }));
                localStorage.setItem("jelajah-kode-notifications-modal-shown", "true");
            }
        }
        onOpenChange(false);
    };

    const handleDeny = () => {
        // Pastikan notifikasi dinonaktifkan
        if (isEnabled) {
            toggleNotifications();
        }
        // Simpan bahwa user menolak dan modal sudah ditampilkan
        if (typeof window !== "undefined") {
            localStorage.setItem("jelajah-kode-notifications", JSON.stringify({
                enabled: false,
            }));
            localStorage.setItem("jelajah-kode-notifications-modal-shown", "true");
        }
        onOpenChange(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="w-full max-w-4xl mx-auto rounded-t-3xl rounded-b-none border-t border-x border-b-0 p-0 overflow-hidden"
            >
                {/* Hidden title for accessibility */}
                <SheetTitle className="sr-only">
                    {t("notifications.modal.title") || "Izinkan Notifikasi Produk?"}
                </SheetTitle>

                {/* Header dengan gradient background */}
                <div className="relative bg-linear-to-br from-primary/20 via-primary/10 to-background p-6 pb-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon dengan animasi */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-primary to-primary/70 shadow-lg">
                                <Bell className="h-10 w-10 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                {t("notifications.modal.title") || "Izinkan Notifikasi Produk?"}
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-md">
                                {t("notifications.modal.description") ||
                                    "Kami ingin mengirimkan notifikasi ketika ada produk baru yang tersedia. Apakah Anda ingin mengaktifkan notifikasi ini?"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content dengan benefits */}
                <div className="p-6 space-y-4">
                    {/* Benefit Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Benefit 1 */}
                        <div className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-5 transition-all hover:border-primary/40 hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Sparkles className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold text-base text-foreground">
                                        {t("notifications.modal.benefit1.title") ||
                                            "Dapatkan Update Produk Terbaru"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("notifications.modal.benefit1.description") ||
                                            "Anda akan langsung mendapat notifikasi saat ada produk baru yang dipublikasikan."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benefit 2 */}
                        <div className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent p-5 transition-all hover:border-primary/40 hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Zap className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold text-base text-foreground">
                                        {t("notifications.modal.benefit2.title") ||
                                            "Tidak Melewatkan Penawaran"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t("notifications.modal.benefit2.description") ||
                                            "Dapatkan informasi produk baru dengan harga dan detail lengkap."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer dengan buttons */}
                <div className="border-t bg-muted/30 p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={handleDeny}
                            className="w-full sm:w-auto sm:min-w-[120px] h-11 font-medium"
                        >
                            {t("notifications.modal.deny") || "Nanti Saja"}
                        </Button>
                        <Button
                            onClick={handleAllow}
                            className="w-full sm:w-auto sm:min-w-[120px] h-11 font-medium bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
                        >
                            {t("notifications.modal.allow") || "Izinkan"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
