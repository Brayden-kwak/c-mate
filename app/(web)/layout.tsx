import type { ReactNode } from "react";
import { Header } from "@/app/_components/web-shell/Header";
import { MobileHeader } from "@/app/_components/web-shell/MobileHeader";
import { Sidebar } from "@/app/_components/web-shell/Sidebar";
import { Footer } from "@/app/_components/web-shell/Footer";
import { MobileQuickFab } from "@/app/_components/web-shell/MobileQuickFab";
import { QuickRail } from "@/app/_components/web-shell/QuickRail";

export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <MobileHeader />
      <div
        className="max-w-[1440px] mx-auto w-full flex-1 xl:relative xl:grid xl:grid-cols-[172px_minmax(0,1fr)_68px] xl:gap-7 xl:px-7 xl:pt-12 xl:pb-18"
        data-cmate-web-main
      >
        <Sidebar />
        <main className="min-w-0 px-4 pt-4 pb-0 xl:px-0 xl:py-0">
          {children}
        </main>
        {/* 68px column is a placeholder for the fixed QuickRail */}
        <div className="hidden xl:block" />
      </div>
      <Footer />
      <QuickRail />
      <MobileQuickFab />
    </>
  );
}
