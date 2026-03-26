'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');
  const isCuenta = pathname.startsWith('/cuenta');

  if (isAdmin || isCuenta) return <>{children}</>;

  return (
    <>
      {!isHome && <Header />}
      {children}
      <Footer />
    </>
  );
}
