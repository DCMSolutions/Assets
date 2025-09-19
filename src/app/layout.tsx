import "~/styles/globals.css";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import ErrorBoundary from "~/components/ErrorBoundary";
import AppLayout from "~/components/applayout";
import LayoutContainer from "~/components/layout-container";
import { NextIntlClientProvider } from "next-intl";

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
  // Obtenemos cookies del lado servidor y se las pasamos al provider de tRPC
  const cookieString = cookies().toString();

  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider>
          <ClerkProvider>
            <TRPCReactProvider cookies={cookieString}>
              <ErrorBoundary>
                <AppLayout title="Assets">
                  {children}
                </AppLayout>
              </ErrorBoundary>
            </TRPCReactProvider>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
