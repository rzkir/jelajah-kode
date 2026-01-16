"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

import { useRouter } from "next/navigation";

import { API_CONFIG } from "@/lib/config";

import { useTranslation } from "@/hooks/useTranslation";

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = "jelajah-kode-notifications";

const SEEN_PRODUCTS_KEY = "jelajah-kode-seen-products";

const CHECK_INTERVAL = 60000;

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);
    const [seenProductIds, setSeenProductIds] = useState<Set<string>>(new Set());
    const [showModal, setShowModal] = useState(false);
    const [browserPermission, setBrowserPermission] = useState<NotificationPermission>("default");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setBrowserPermission(Notification.permission);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const savedSettings = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    setIsEnabled(parsed.enabled === true);
                    if (parsed.lastChecked) {
                        setLastChecked(new Date(parsed.lastChecked));
                    }
                } else {
                    setTimeout(() => {
                        setShowModal(true);
                    }, 3000);
                }

                const savedSeenProducts = localStorage.getItem(SEEN_PRODUCTS_KEY);
                if (savedSeenProducts) {
                    const parsed = JSON.parse(savedSeenProducts);
                    setSeenProductIds(new Set(parsed));
                }
            } catch (error) {
                console.error("Error loading notification settings:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(
                    NOTIFICATIONS_STORAGE_KEY,
                    JSON.stringify({
                        enabled: isEnabled,
                        lastChecked: lastChecked?.toISOString(),
                    })
                );
            } catch (error) {
                console.error("Error saving notification settings:", error);
            }
        }
    }, [isEnabled, lastChecked]);

    useEffect(() => {
        if (typeof window !== "undefined" && seenProductIds.size > 0) {
            try {
                const productIdsArray = Array.from(seenProductIds).slice(-100);
                localStorage.setItem(SEEN_PRODUCTS_KEY, JSON.stringify(productIdsArray));
            } catch (error) {
                console.error("Error saving seen products:", error);
            }
        }
    }, [seenProductIds]);

    const fetchLatestProducts = useCallback(async (): Promise<NotificationProduct[]> => {
        try {
            const apiSecret = API_CONFIG.SECRET;
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (apiSecret) {
                headers.Authorization = `Bearer ${apiSecret}`;
            }

            const response = await fetch(
                `${API_CONFIG.ENDPOINTS.products.base}?page=1&limit=10&status=publish`,
                {
                    next: { revalidate: 0 },
                    headers,
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            const data = await response.json();
            const products = Array.isArray(data) ? data : data?.data || [];

            return products
                .filter((product: ProductResponse) => product.status === "publish")
                .map((product: ProductResponse) => ({
                    _id: product._id,
                    productsId: product.productsId,
                    title: product.title,
                    thumbnail: product.thumbnail,
                    price: product.price,
                    created_at: product.created_at || product.createdAt || new Date().toISOString(),
                }));
        } catch (error) {
            console.error("Error fetching products for notifications:", error);
            return [];
        }
    }, []);

    const checkForNewProducts = useCallback(async () => {
        if (!isEnabled) return;

        try {
            const products = await fetchLatestProducts();
            const newProducts: NotificationProduct[] = [];

            products.forEach((product) => {
                if (!seenProductIds.has(product._id)) {
                    newProducts.push(product);
                    setSeenProductIds((prev) => new Set([...prev, product._id]));
                }
            });

            if (newProducts.length > 0 && typeof window !== "undefined" && "Notification" in window) {
                if (Notification.permission === "granted") {
                    newProducts.forEach((product) => {
                        const productPrice = product.price === 0
                            ? t("common.free") || "Gratis"
                            : new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(product.price);

                        const notification = new Notification(
                            t("notifications.newProduct") || "Produk Baru Tersedia!",
                            {
                                body: `${product.title} - ${productPrice}`,
                                icon: product.thumbnail || "/favicon.ico",
                                badge: "/favicon.ico",
                                tag: `product-${product._id}`,
                                requireInteraction: false,
                                silent: false,
                            }
                        );

                        notification.onclick = () => {
                            window.focus();
                            router.push(`/products/${product.productsId}`);
                            notification.close();
                        };

                        setTimeout(() => {
                            notification.close();
                        }, 10000);
                    });
                }
            }

            setLastChecked(new Date());
        } catch (error) {
            console.error("Error checking for new products:", error);
        }
    }, [isEnabled, seenProductIds, fetchLatestProducts, router, t]);

    useEffect(() => {
        if (!isEnabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const initialTimeout = setTimeout(() => {
            checkForNewProducts();
        }, 2000);

        intervalRef.current = setInterval(() => {
            checkForNewProducts();
        }, CHECK_INTERVAL);

        return () => {
            clearTimeout(initialTimeout);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isEnabled, checkForNewProducts]);

    const requestBrowserPermission = useCallback(async (): Promise<boolean> => {
        if (typeof window === "undefined" || !("Notification" in window)) {
            console.warn("Browser notifications are not supported");
            return false;
        }

        if (Notification.permission === "granted") {
            setBrowserPermission("granted");
            return true;
        }

        if (Notification.permission === "denied") {
            setBrowserPermission("denied");
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            setBrowserPermission(permission);
            return permission === "granted";
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    }, []);

    const toggleNotifications = useCallback(() => {
        setIsEnabled((prev) => !prev);
    }, []);

    const handleModalClose = useCallback((open: boolean) => {
        setShowModal(open);
    }, []);

    const value = {
        isEnabled,
        toggleNotifications,
        checkForNewProducts,
        lastChecked,
        showModal,
        setShowModal: handleModalClose,
        requestBrowserPermission,
        browserPermission,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
}
