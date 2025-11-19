import "~/styles/globals.css";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import ErrorBoundary from "~/components/ErrorBoundary";
import { NextIntlClientProvider } from "next-intl";
import { SidebarProvider } from "~/components/ui/sidebar";
import TopBar from "~/components/layout/topbar";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assets",
  description: "Sistema de reserva de lockers",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieString = cookies().toString();

  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-[#ECF0F5]`}>
        <NextIntlClientProvider>
          <ClerkProvider>
            <TRPCReactProvider cookies={cookieString}>
              <ErrorBoundary>
                <SidebarProvider>
                  <AppSidebar />
                  <TopBar />
                  <main className="flex-grow mt-[50px] p-4">
                    {children}
                    <Toaster richColors position="bottom-right" />
                  </main>
                </SidebarProvider>
              </ErrorBoundary>
            </TRPCReactProvider>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
