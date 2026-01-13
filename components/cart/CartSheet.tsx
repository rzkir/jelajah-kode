"use client";

import Image from "next/image";
import Link from "next/link";

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { formatIDR } from "@/hooks/FormatPrice";

import {
  calculateDiscountedPrice,
  getActiveDiscount,
} from "@/hooks/discountServices";

import { useCart } from "@/utils/context/CartContext";

import { useRouter } from "next/navigation";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter();
  const {
    cartItems,
    getTotalPrice,
    getTotalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Build products param: "id1:qty1,id2:qty2"
    const productsParam = cartItems
      .map((item) => `${item.product._id}:${item.quantity}`)
      .join(",");

    onOpenChange(false);
    router.push(`/checkout?products=${productsParam}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start adding products to your cart
              </p>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  router.push("/products");
                }}
                variant="default"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const activeDiscount = getActiveDiscount(item.product.discount);
                const itemPrice = calculateDiscountedPrice(
                  item.product.price,
                  activeDiscount
                );
                const hasActiveDiscount = !!activeDiscount;

                return (
                  <div
                    key={item.product._id}
                    className="flex gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-colors"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.productsId}`}
                      onClick={() => onOpenChange(false)}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 border border-border/50"
                    >
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <Link
                        href={`/products/${item.product.productsId}`}
                        onClick={() => onOpenChange(false)}
                        className="block"
                      >
                        <h4 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors">
                          {item.product.title}
                        </h4>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {hasActiveDiscount ? (
                          <>
                            <span className="text-sm font-bold text-primary">
                              Rp {formatIDR(itemPrice)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              Rp {formatIDR(item.product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold">
                            Rp {formatIDR(item.product.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.product._id, item.quantity - 1);
                              } else {
                                removeFromCart(item.product._id);
                              }
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              );
                            }}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-xs text-muted-foreground">
                        Subtotal:{" "}
                        <span className="font-semibold text-foreground">
                          Rp {formatIDR(itemPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Separator />
            <div className="w-full space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  Rp {formatIDR(totalPrice)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                  size="sm"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

