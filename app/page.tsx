import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function page() {
  return (
    <section className="min-h-screen bg-linear-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="border-2 shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            {/* Logo or Brand Section */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1">
                  <Spinner className="size-6 text-primary" />
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6 flex justify-center">
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-semibold bg-primary/5 border-primary/20"
              >
                🚧 Under Development
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in">
              Jelajah Kode
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kami sedang membangun sesuatu yang luar biasa. Platform inovatif
              untuk mengelola produk dan framework Anda.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="text-sm font-medium">Easy Management</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
                <span className="text-sm font-medium">Fast Performance</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-accent/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="min-w-40 shadow-lg">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-40 border-2"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Footer Note */}
            <p className="mt-8 text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link
                href="/signin"
                className="text-primary font-semibold hover:underline"
              >
                Masuk sekarang
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
