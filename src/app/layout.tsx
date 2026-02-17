import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Droplet AI - Admin Dashboard",
    description: "Modern operations and revenue dashboard",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="flex min-h-screen bg-background text-foreground">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto px-8 py-8 transition-all duration-500">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
