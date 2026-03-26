import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import ToastNotifications from "@/components/features/ToastNotifications";
import CartSidebar from "@/components/features/CartSidebar";
import ChatWidget from "@/components/features/ChatWidget";
import AppContent from "./AppContent";

export const metadata: Metadata = {
  title: "BASE | E-commerce & Digital Studio",
  description: "Menos, pero con intención. Premium e-commerce y servicios de desarrollo digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body suppressHydrationWarning>
        <CartProvider>
          <NotificationProvider>
            <AppContent>{children}</AppContent>
            <ToastNotifications />
            <CartSidebar />
            <ChatWidget />
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
