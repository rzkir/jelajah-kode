"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

import { toast } from "sonner";

import {
    calculateDiscountedPrice,
    getActiveDiscount,
} from "@/hooks/discountServices";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "jelajah-kode-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [cartSheetOpen, setCartSheetOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const savedCart = localStorage.getItem(CART_STORAGE_KEY);
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    // Validate cart structure
                    if (Array.isArray(parsedCart)) {
                        setCartItems(parsedCart);
                    }
                }
            } catch (error) {
                console.error("Error loading cart from localStorage:", error);
                // Clear corrupted cart data
                localStorage.removeItem(CART_STORAGE_KEY);
            } finally {
                setIsInitialized(true);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes (only after initialization)
    useEffect(() => {
        if (typeof window !== "undefined" && isInitialized) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
            } catch (error) {
                console.error("Error saving cart to localStorage:", error);
            }
        }
    }, [cartItems, isInitialized]);

    // Add product to cart
    const addToCart = useCallback(
        (product: ProductsDetails, quantity: number = 1) => {
            if (quantity < 1) {
                toast.error("Quantity must be at least 1");
                return;
            }

            // Check if product is already in cart
            setCartItems((prevItems) => {
                const existingItemIndex = prevItems.findIndex(
                    (item) => item.product._id === product._id
                );

                if (existingItemIndex >= 0) {
                    // Update quantity if product already exists
                    const updatedItems = [...prevItems];
                    const newQuantity = updatedItems[existingItemIndex].quantity + quantity;

                    // Check stock availability
                    if (newQuantity > product.stock) {
                        toast.error(
                            `Only ${product.stock} items available in stock. Cannot add more.`
                        );
                        return prevItems;
                    }

                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        quantity: newQuantity,
                    };

                    toast.success(
                        `Updated quantity to ${newQuantity} ${newQuantity === 1 ? "item" : "items"}`
                    );
                    return updatedItems;
                } else {
                    // Add new product to cart
                    // Check stock availability
                    if (quantity > product.stock) {
                        toast.error(
                            `Only ${product.stock} items available in stock. Cannot add more.`
                        );
                        return prevItems;
                    }

                    toast.success(
                        `Added ${quantity} ${quantity === 1 ? "item" : "items"} to cart`
                    );
                    return [...prevItems, { product, quantity }];
                }
            });
        },
        []
    );

    // Remove product from cart
    const removeFromCart = useCallback((productId: string) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(
                (item) => item.product._id !== productId
            );
            toast.success("Item removed from cart");
            return updatedItems;
        });
    }, []);

    // Update quantity of a product in cart
    const updateQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (quantity < 1) {
                removeFromCart(productId);
                return;
            }

            setCartItems((prevItems) => {
                const itemIndex = prevItems.findIndex(
                    (item) => item.product._id === productId
                );

                if (itemIndex < 0) {
                    return prevItems;
                }

                const product = prevItems[itemIndex].product;

                // Check stock availability
                if (quantity > product.stock) {
                    toast.error(
                        `Only ${product.stock} items available in stock. Cannot update to ${quantity}.`
                    );
                    return prevItems;
                }

                const updatedItems = [...prevItems];
                updatedItems[itemIndex] = {
                    ...updatedItems[itemIndex],
                    quantity,
                };

                return updatedItems;
            });
        },
        [removeFromCart]
    );

    // Clear all items from cart
    const clearCart = useCallback(() => {
        setCartItems([]);
        toast.success("Cart cleared");
    }, []);

    // Calculate total price of all items in cart
    const getTotalPrice = useCallback((): number => {
        return cartItems.reduce((total, item) => {
            const activeDiscount = getActiveDiscount(item.product.discount);
            const itemPrice = calculateDiscountedPrice(
                item.product.price,
                activeDiscount
            );
            return total + itemPrice * item.quantity;
        }, 0);
    }, [cartItems]);

    // Get total number of items in cart
    const getTotalItems = useCallback((): number => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    // Check if product is in cart
    const isInCart = useCallback(
        (productId: string): boolean => {
            return cartItems.some((item) => item.product._id === productId);
        },
        [cartItems]
    );

    // Get quantity of a specific product in cart
    const getCartItemQuantity = useCallback(
        (productId: string): number => {
            const item = cartItems.find((item) => item.product._id === productId);
            return item ? item.quantity : 0;
        },
        [cartItems]
    );

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
        getCartItemQuantity,
        cartSheetOpen,
        setCartSheetOpen,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

