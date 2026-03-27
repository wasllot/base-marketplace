import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import ToastNotifications from "@/components/features/ToastNotifications";
import CartSidebar from "@/components/features/CartSidebar";
import ChatWidget from "@/components/features/ChatWidget";
import AppContent from "./AppContent";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "BASE | Diseño de Moda & Marketplace Premium",
  description: "Moda con intención. Piezas de diseño premium seleccionadas con propósito y estética atemporal.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BASE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <AppContent>{children}</AppContent>
              <ToastNotifications />
              <CartSidebar />
              <ChatWidget />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
