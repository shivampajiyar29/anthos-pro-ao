import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DashboardProvider } from "@/lib/DashboardContext";
import { MarketProvider } from "@/lib/MarketContext";
import SidebarWrapper from "@/components/SidebarWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";
import ParticleBackground from "@/components/ParticleBackground";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import ChatAssistant from "@/components/ChatAssistant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Quant Console | Athos Pro",
    description: "Advanced Algorithmic Trading Terminal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={inter.className}>
                <MarketProvider>
                    <DashboardProvider>
                        <div className="flex h-screen bg-brand-bg text-white overflow-hidden relative">
                            <SidebarWrapper />
                            <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                                <HeaderWrapper />
                                <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 scroll-smooth pb-24 md:pb-8 bg-brand-bg/50 backdrop-blur-[2px]">
                                    <div className="max-w-[1600px] mx-auto space-y-8">
                                        {children}
                                    </div>
                                </main>
                            </div>
                            <MobileNavWrapper />
                        </div>
                    </DashboardProvider>
                </MarketProvider>
            </body>
        </html>
    );
}
