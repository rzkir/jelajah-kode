"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { User, ShoppingBag, Settings, LogOut, Calendar, CreditCard, Loader2, EyeIcon, Camera, Lock, Trash2, Star, X } from "lucide-react"

import { useRouter } from "next/navigation"

import { useAuth } from "@/utils/context/AuthContext"

import Image from "next/image"

import ProfileLoading from "@/helper/loading/ProfileLoading"

import useFormatDate from "@/hooks/FormatDate"

import { getStatusVariant, getInitials } from "@/hooks/TextFormatter"

import { formatIDR } from "@/hooks/FormatPrice"

import ChangePassword from "@/components/dashboard/accounts/modal/ChangePassword"

import { useStateProfile } from "./lib/useStateProfile"

import { UserReviews } from "@/components/ui/user-riview"

import TransactionLoading from "@/components/pages/profile/profile/transaction/TransactionLoading"

import { useTranslation } from "@/hooks/useTranslation"

export default function ProfilePage() {
    const { signOut } = useAuth()
    const router = useRouter()
    const { t } = useTranslation()
    const {
        activeTab,
        setActiveTab,
        isUpdating,
        transactions,
        transactionsLoading,
        continuingPayment,
        cancelingTransaction,
        isUploadingPicture,
        fileInputRef,
        isChangePasswordOpen,
        setIsChangePasswordOpen,
        isDeleteAccountOpen,
        setIsDeleteAccountOpen,
        isDeletingAccount,
        formData,
        setFormData,
        user,
        loading,
        reviews,
        reviewsLoading,
        handleUpdateProfile,
        handleEditPicture,
        handleFileChange,
        handleContinuePayment,
        handleCancelTransaction,
        handleDeleteAccount,
    } = useStateProfile()

    const { formatDate } = useFormatDate()

    // Handle sign out
    const handleSignOut = async () => {
        await signOut()
    }

    // Show loading state
    if (loading) {
        return <ProfileLoading />
    }

    // Show nothing if no user (will redirect)
    if (!user) {
        return null
    }

    // Calculate stats from transactions
    const completedTransactions = transactions.filter(
        (txn) => txn.status === "success"
    )
    const totalSpent = completedTransactions.reduce(
        (sum, txn) => sum + (txn.total_amount || 0),
        0
    )
    const productsPurchased = completedTransactions.reduce(
        (sum, txn) => sum + txn.products.length,
        0
    )

    return (
        <section className="min-h-full px-4 py-8">
            <main className="container mx-auto">
                {/* Profile Header */}
                <div className="mb-5">
                    <div className="flex flex-col gap-5 items-center justify-center text-center md:text-left mb-5">
                        <div className="relative group cursor-pointer" onClick={handleEditPicture}>
                            <Avatar className="w-24 h-24 border-2 border-border">
                                <AvatarImage src={user.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            {!isUploadingPicture && (
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            )}
                            {isUploadingPicture && (
                                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold mb-5">{user.name}</h1>

                            <div className="flex flex-row gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                                <div className="flex flex-col items-center gap-2 bg-card p-4 border rounded-md">
                                    <Calendar className="w-4 h-4" />
                                    Joined {formatDate(user.created_at || new Date())}
                                </div>

                                <div className="flex flex-col items-center gap-2 bg-card p-4 border rounded-md">
                                    <Calendar className="w-4 h-4" />
                                    Updated {formatDate(user.updated_at || new Date())}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{productsPurchased}</p>
                                <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("profile.productsPurchased")}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{formatIDR(totalSpent)}</p>
                                <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("profile.totalSpent")}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{transactions.length}</p>
                                <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("profile.totalTransactions")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-5">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("profile.profile")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("profile.purchases")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("profile.ratings")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("profile.settings")}</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle suppressHydrationWarning>{t("profile.profileInformation")}</CardTitle>
                                <CardDescription suppressHydrationWarning>{t("profile.updatePersonalDetails")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block mb-2" suppressHydrationWarning>{t("profile.fullName")}</Label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={t("profile.enterYourName")}
                                        />
                                    </div>
                                    <div>
                                        <Label className="block mb-2" suppressHydrationWarning>{t("auth.email")}</Label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                        />
                                        <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>{t("profile.emailCannotBeChanged")}</p>
                                    </div>
                                    <div>
                                        <Label className="block mb-2" suppressHydrationWarning>{t("profile.role")}</Label>
                                        <Input
                                            type="text"
                                            value={user.role === "admins" ? t("profile.administrator") : t("profile.user")}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <Label className="block mb-2" suppressHydrationWarning>{t("profile.status")}</Label>
                                        <Input
                                            type="text"
                                            value={user.status || "N/A"}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={isUpdating}
                                >
                                    <span suppressHydrationWarning>{isUpdating ? t("profile.saving") : t("profile.saveChanges")}</span>
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Purchase History</CardTitle>
                                <CardDescription>Your recent transactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactionsLoading ? (
                                    <TransactionLoading />
                                ) : transactions.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No transactions found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {transactions.map((txn) => (
                                            <div
                                                key={txn._id}
                                                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                                            <p className="font-semibold text-sm" suppressHydrationWarning>
                                                                {t("profile.orderId")}: {txn.order_id || txn._id}
                                                            </p>
                                                            <Badge
                                                                variant={getStatusVariant(txn.status)}
                                                                className="text-xs"
                                                            >
                                                                {txn.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(txn.created_at || new Date())}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-lg">
                                                            {formatIDR(txn.total_amount || 0)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                                                            {txn.paymentMethod === "paid" ? t("profile.paid") : t("profile.free")}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 border-t border-border pt-3 mt-3">
                                                    {txn.status === "pending" && (
                                                        <>
                                                            {txn.paymentMethod === "paid" && txn.snap_token && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => handleContinuePayment(txn)}
                                                                    disabled={continuingPayment.has(txn.order_id || txn._id) || cancelingTransaction.has(txn.order_id || txn._id)}
                                                                    className="gap-2"
                                                                >
                                                                    {continuingPayment.has(txn.order_id || txn._id) ? (
                                                                        <>
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                            Memproses...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CreditCard className="h-4 w-4" />
                                                                            Lanjutkan Pembayaran
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleCancelTransaction(txn)}
                                                                disabled={continuingPayment.has(txn.order_id || txn._id) || cancelingTransaction.has(txn.order_id || txn._id)}
                                                                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                {cancelingTransaction.has(txn.order_id || txn._id) ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                        Membatalkan...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <X className="h-4 w-4" />
                                                                        Batalkan Transaksi
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}

                                                    {txn.status === "success" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/profile/${txn.order_id}`)}
                                                            className="gap-2"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            <span suppressHydrationWarning>{t("profile.viewDetails")}</span>
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-2 mt-3 pt-3 border-t border-border">
                                                    {txn.products.map((product: TransactionProduct, idx: number) => (
                                                        <div
                                                            key={product._id || idx}
                                                            className="relative flex items-center gap-3"
                                                        >
                                                            <div className="relative w-16 h-16 shrink-0">
                                                                <Image
                                                                    src={product.thumbnail}
                                                                    alt={product.title}
                                                                    fill
                                                                    className="object-cover rounded"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium">{product.title}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Qty: {product.quantity} × {formatIDR(product.amount || 0)}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm font-semibold">
                                                                {formatIDR(product.amount * product.quantity || 0)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Chat/Messages Tab */}
                    <TabsContent value="chat" className="space-y-6">
                        {reviewsLoading ? (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <UserReviews reviews={reviews || []} />
                        )}
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle suppressHydrationWarning>{t("profile.preferences")}</CardTitle>
                                <CardDescription suppressHydrationWarning>{t("profile.manageAccountSettings")}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold" suppressHydrationWarning>{t("profile.emailNotifications")}</p>
                                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("profile.receiveUpdates")}</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold" suppressHydrationWarning>{t("profile.marketingEmails")}</p>
                                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("profile.getSpecialOffers")}</p>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold" suppressHydrationWarning>{t("profile.twoFactorAuth")}</p>
                                            <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("profile.enhancedSecurity")}</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="pt-6 border-t border-border">
                                        <p className="font-semibold mb-4" suppressHydrationWarning>{t("profile.security")}</p>
                                        <Button
                                            variant="outline"
                                            className="w-full mb-4"
                                            onClick={() => setIsChangePasswordOpen(true)}
                                        >
                                            <Lock className="w-4 h-4 mr-2" />
                                            <span suppressHydrationWarning>{t("profile.changePassword")}</span>
                                        </Button>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <p className="font-semibold mb-4" suppressHydrationWarning>{t("profile.accountActions")}</p>
                                        <Button
                                            variant="outline"
                                            className="w-full mb-4"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            <span suppressHydrationWarning>{t("profile.signOut")}</span>
                                        </Button>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <p className="font-semibold mb-4 text-destructive" suppressHydrationWarning>{t("profile.dangerZone")}</p>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => setIsDeleteAccountOpen(true)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            <span suppressHydrationWarning>{t("profile.deleteAccount")}</span>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Change Password Modal */}
            <ChangePassword
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />

            {/* Delete Account Modal */}
            <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
                <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-lg sm:text-xl font-bold text-destructive" suppressHydrationWarning>
                            {t("profile.deleteAccount")}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground" suppressHydrationWarning>
                            {t("profile.deleteAccountConfirm")} {t("profile.deleteAccountWarning")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteAccountOpen(false)}
                            className="px-6"
                            disabled={isDeletingAccount}
                        >
                            <span suppressHydrationWarning>{t("common.cancel")}</span>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            className="px-6"
                            disabled={isDeletingAccount}
                        >
                            {isDeletingAccount ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    <span suppressHydrationWarning>{t("profile.deleting")}</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    <span suppressHydrationWarning>{t("profile.deleteAccount")}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
