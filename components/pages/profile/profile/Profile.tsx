"use client"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { User, ShoppingBag, Settings, LogOut, Calendar, CreditCard, Loader2, EyeIcon, Camera, Lock, Trash2, Star } from "lucide-react"

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

export default function ProfilePage() {
    const { signOut } = useAuth()
    const router = useRouter()
    const {
        activeTab,
        setActiveTab,
        isUpdating,
        transactions,
        transactionsLoading,
        continuingPayment,
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
                                <p className="text-sm text-muted-foreground">Products Purchased</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{formatIDR(totalSpent)}</p>
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{transactions.length}</p>
                                <p className="text-sm text-muted-foreground">Total Transactions</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-5">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Purchases</span>
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span className="hidden sm:inline">Ratings</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Role</label>
                                        <input
                                            type="text"
                                            value={user.role === "admins" ? "Administrator" : "User"}
                                            disabled
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold block mb-2">Status</label>
                                        <input
                                            type="text"
                                            value={user.status || "N/A"}
                                            disabled
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleUpdateProfile}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
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
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
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
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="font-semibold text-sm">
                                                                Order ID: {txn.order_id || txn._id}
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
                                                        <p className="text-xs text-muted-foreground">
                                                            {txn.paymentMethod === "paid" ? "Paid" : "Free"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {txn.status === "pending" && txn.paymentMethod === "paid" && txn.snap_token && (
                                                    <div className="mt-3 pt-3 border-t border-border">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleContinuePayment(txn)}
                                                            disabled={continuingPayment.has(txn.order_id || txn._id)}
                                                            className="w-full gap-2"
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
                                                    </div>
                                                )}
                                                {txn.status === "success" && (
                                                    <div className="mt-3 pt-3 border-t border-border">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/profile/${txn.order_id}`)}
                                                            className="w-full gap-2"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            Lihat Detail
                                                        </Button>
                                                    </div>
                                                )}
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
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Manage your account settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive updates about new products</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold">Marketing Emails</p>
                                            <p className="text-sm text-muted-foreground">Get special offers and discounts</p>
                                        </div>
                                        <input type="checkbox" className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div>
                                            <p className="font-semibold">Two-Factor Authentication</p>
                                            <p className="text-sm text-muted-foreground">Enhanced security for your account</p>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="pt-6 border-t border-border">
                                        <p className="font-semibold mb-4">Security</p>
                                        <Button
                                            variant="outline"
                                            className="w-full mb-4"
                                            onClick={() => setIsChangePasswordOpen(true)}
                                        >
                                            <Lock className="w-4 h-4 mr-2" />
                                            Change Password
                                        </Button>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <p className="font-semibold mb-4">Account Actions</p>
                                        <Button
                                            variant="outline"
                                            className="w-full mb-4"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <p className="font-semibold mb-4 text-destructive">Danger Zone</p>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => setIsDeleteAccountOpen(true)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
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
                        <DialogTitle className="text-lg sm:text-xl font-bold text-destructive">
                            Delete Account
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Are you sure you want to delete your account? This action cannot be undone.
                            All your data, including transactions and personal information, will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteAccountOpen(false)}
                            className="px-6"
                            disabled={isDeletingAccount}
                        >
                            Cancel
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
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
