'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="mb-auto mx-auto z-10">
      <div className="flex flex-col h-screen justify-between">
        <Navbar />
        <div className="mb-16" />
        {children}
        <Footer />
      </div>
    </main>
  );
}
