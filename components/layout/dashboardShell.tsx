"use client";

import { type ReactNode } from "react";

import { AppSidebar } from "@/components/layout/appSidebar";
import Footer from "@/components/layout/footer";
import InstallButton from "@/components/layout/installButton";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background flex min-h-screen flex-col">
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 border-border sticky flex shrink-0 items-center gap-2 border-b px-4 py-7 backdrop-blur md:px-6">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="mx-auto space-y-6 p-4 md:p-6 lg:p-8">{children}</div>
        </main>
        <Footer />
        <InstallButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
