import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export const metadata = {
    title: "404 - Page Not Found",
    description: "The page you're looking for doesn't exist",
}

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="mb-8">
                        <div className="relative inline-block mb-4">
                            <p className="text-6xl md:text-7xl font-mono font-bold text-muted-foreground animate-float">404</p>
                            <div className="absolute inset-0 text-6xl md:text-7xl font-mono font-bold text-primary/20 animate-pulse blur-sm">
                                404
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Looks like the code went missing. The page you're looking for doesn't exist or has been moved to a
                            different repository.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button size="lg" className="text-base w-full sm:w-auto">
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </div>

                    <div className="mt-16 pt-16 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-6">Maybe you're looking for one of these?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Link href="/products">
                                <div className="p-3 rounded-lg border border-border hover:border-foreground/20 transition-colors hover:scale-105 duration-300">
                                    <p className="text-sm font-semibold">Products</p>
                                </div>
                            </Link>
                            <Link href="/articles">
                                <div className="p-3 rounded-lg border border-border hover:border-foreground/20 transition-colors hover:scale-105 duration-300">
                                    <p className="text-sm font-semibold">Articles</p>
                                </div>
                            </Link>
                            <Link href="/search">
                                <div className="p-3 rounded-lg border border-border hover:border-foreground/20 transition-colors hover:scale-105 duration-300">
                                    <p className="text-sm font-semibold">Search</p>
                                </div>
                            </Link>
                            <Link href="/contact">
                                <div className="p-3 rounded-lg border border-border hover:border-foreground/20 transition-colors hover:scale-105 duration-300">
                                    <p className="text-sm font-semibold">Contact</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
