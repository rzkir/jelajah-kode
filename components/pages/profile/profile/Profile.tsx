"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, ShoppingBag, MessageSquare, Settings, LogOut, Mail, Calendar, CreditCard, Loader2, EyeIcon, Camera } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/utils/context/AuthContext"
import { toast } from "sonner"
import { API_CONFIG } from "@/lib/config"
import Image from "next/image"
import ProfileLoading from "@/helper/loading/ProfileLoading"

export default function ProfilePage() {
    const { user, loading, signOut, refreshUserData } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("profile")
    const [isUpdating, setIsUpdating] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [transactionsLoading, setTransactionsLoading] = useState(false)
    const [continuingPayment, setContinuingPayment] = useState<Set<string>>(new Set())
    const [isUploadingPicture, setIsUploadingPicture] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push("/signin")
        }
    }, [user, loading, router])

    // Initialize form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
            })
        }
    }, [user])

    // Fetch transactions when user is available
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return

            setTransactionsLoading(true)
            try {
                const response = await fetch(API_CONFIG.ENDPOINTS.transactions, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions")
                }

                const data = await response.json()
                setTransactions(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Error fetching transactions:", error)
                toast.error("Failed to load transactions")
            } finally {
                setTransactionsLoading(false)
            }
        }

        fetchTransactions()
    }, [user])

    // Refresh transactions after payment
    const refreshTransactions = async () => {
        if (!user) return

        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.transactions, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                const data = await response.json()
                setTransactions(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error("Error refreshing transactions:", error)
        }
    }

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Format currency helper
    const formatCurrency = (amount?: number) => {
        if (!amount) return "Rp 0"
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Format transaction date helper
    const formatTransactionDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Get status badge variant
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "success":
                return "default"
            case "pending":
                return "secondary"
            case "expired":
            case "canceled":
                return "destructive"
            default:
                return "secondary"
        }
    }

    // Get initials for avatar fallback
    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    // Handle profile update
    const handleUpdateProfile = async () => {
        if (!user) return

        if (!formData.name.trim()) {
            toast.error("Name cannot be empty")
            return
        }

        setIsUpdating(true)

        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.me, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.name.trim(),
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to update profile")
            }

            // Refresh user data
            await refreshUserData()

            toast.success("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update profile. Please try again."
            )
        } finally {
            setIsUpdating(false)
        }
    }

    // Handle sign out
    const handleSignOut = async () => {
        await signOut()
    }

    // Handle picture upload
    const handleEditPicture = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            toast.error("File size must be less than 5MB")
            return
        }

        setIsUploadingPicture(true)

        try {
            // Upload to ImageKit
            const formData = new FormData()
            formData.append("file", file)

            const uploadResponse = await fetch(API_CONFIG.ENDPOINTS.uploadPicture, {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json()
                throw new Error(errorData.error || "Failed to upload image")
            }

            const uploadResult = await uploadResponse.json()

            // Update user profile with new picture URL
            const updateResponse = await fetch(API_CONFIG.ENDPOINTS.me, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    picture: uploadResult.url,
                }),
            })

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json()
                throw new Error(errorData.error || "Failed to update profile")
            }

            // Refresh user data
            await refreshUserData()

            toast.success("Profile picture updated successfully!")
        } catch (error) {
            console.error("Error uploading picture:", error)
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to upload picture. Please try again."
            )
        } finally {
            setIsUploadingPicture(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    // Handle continue payment
    const handleContinuePayment = async (transaction: Transaction) => {
        if (!transaction.snap_token) {
            toast.error("Payment token tidak tersedia")
            return
        }

        if (!transaction.order_id) {
            toast.error("Order ID tidak ditemukan")
            return
        }

        setContinuingPayment((prev) => new Set(prev).add(transaction.order_id || transaction._id))

        let retryCount = 0
        const maxRetries = 50

        const openSnapPayment = () => {
            if (typeof window === "undefined" || !window.snap) {
                retryCount++
                if (retryCount >= maxRetries) {
                    toast.error("Payment gateway gagal dimuat. Silakan refresh halaman.")
                    console.error("Snap script not available after timeout")
                    setContinuingPayment((prev) => {
                        const newSet = new Set(prev)
                        newSet.delete(transaction.order_id || transaction._id)
                        return newSet
                    })
                    return
                }
                setTimeout(openSnapPayment, 100)
                return
            }

            try {
                if (!transaction.snap_token) {
                    throw new Error("Snap token tidak tersedia")
                }

                window.snap.pay(transaction.snap_token, {
                    onSuccess: async (result: { order_id: string }) => {
                        setContinuingPayment((prev) => {
                            const newSet = new Set(prev)
                            newSet.delete(transaction.order_id || transaction._id)
                            return newSet
                        })

                        await new Promise((resolve) => setTimeout(resolve, 1000))

                        // Refresh transactions
                        await refreshTransactions()

                        toast.success("Pembayaran berhasil!")
                        setTimeout(() => {
                            router.push(`/checkout/success?order_id=${result.order_id}`)
                        }, 1500)
                    },
                    onPending: async (result: { order_id: string }) => {
                        setContinuingPayment((prev) => {
                            const newSet = new Set(prev)
                            newSet.delete(transaction.order_id || transaction._id)
                            return newSet
                        })

                        await new Promise((resolve) => setTimeout(resolve, 1000))

                        // Refresh transactions
                        await refreshTransactions()

                        toast.info("Pembayaran pending. Silakan selesaikan pembayaran.")
                        setTimeout(() => {
                            router.push(`/checkout/pending?order_id=${result.order_id}`)
                        }, 1500)
                    },
                    onError: () => {
                        setContinuingPayment((prev) => {
                            const newSet = new Set(prev)
                            newSet.delete(transaction.order_id || transaction._id)
                            return newSet
                        })
                        toast.error("Pembayaran gagal. Silakan coba lagi.")
                    },
                    onClose: () => {
                        setContinuingPayment((prev) => {
                            const newSet = new Set(prev)
                            newSet.delete(transaction.order_id || transaction._id)
                            return newSet
                        })
                        toast.info("Jendela pembayaran ditutup")
                    },
                })
            } catch (error) {
                console.error("Error opening Snap payment:", error)
                toast.error("Gagal membuka payment gateway. Silakan coba lagi.")
                setContinuingPayment((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(transaction.order_id || transaction._id)
                    return newSet
                })
            }
        }

        openSnapPayment()
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

    const messages = [
        {
            id: "MSG-001",
            sender: "Support Team",
            subject: "Your Purchase Receipt",
            preview: "Thank you for purchasing E-Commerce Dashboard Template...",
            date: "2025-01-08",
            unread: false,
        },
        {
            id: "MSG-002",
            sender: "Developer Support",
            subject: "Getting Started with Your Template",
            preview: "We're here to help! Check out our documentation...",
            date: "2025-01-06",
            unread: true,
        },
        {
            id: "MSG-003",
            sender: "Notifications",
            subject: "New Product Available in Your Category",
            preview: "Check out our latest AI/ML components...",
            date: "2025-01-02",
            unread: false,
        },
    ]

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8">
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
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                            <p className="text-muted-foreground mb-4">
                                {user.role === "admins" ? "Administrator" : "User"}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Joined {formatDate(user.created_at)}
                                </div>
                                {user.status && (
                                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                        {user.status}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full md:w-auto bg-transparent"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{productsPurchased}</p>
                                <p className="text-sm text-muted-foreground">Products Purchased</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
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
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Purchases</span>
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">Messages</span>
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
                                                            {formatTransactionDate(txn.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-lg">
                                                            {formatCurrency(txn.total_amount)}
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
                                                                    Qty: {product.quantity} × {formatCurrency(product.amount)}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm font-semibold">
                                                                {formatCurrency(product.amount * product.quantity)}
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Messages</CardTitle>
                                <CardDescription>Your conversations and notifications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${msg.unread ? "bg-primary/5" : ""
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <Avatar className="w-10 h-10 shrink-0">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} />
                                                        <AvatarFallback>{getInitials(msg.sender)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold">{msg.sender}</p>
                                                            {msg.unread && <Badge className="text-xs">New</Badge>}
                                                        </div>
                                                        <p className="text-sm font-medium text-foreground mb-1">{msg.subject}</p>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">{msg.preview}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground shrink-0">{msg.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
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

                                <div className="pt-6 border-t border-border">
                                    <p className="font-semibold mb-4">Danger Zone</p>
                                    <Button variant="destructive" className="w-full">
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
