"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, UserIcon } from "lucide-react";
import { SeraLogo } from "@/components/SeraLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/betterauth/authClients";

export const NAV_LINKS = [
  { label: "Modul", href: "#fitur" },
  { label: "Jenjang", href: "#jenjang" },
  { label: "Cara kerja", href: "#cara-kerja" },
  { label: "Keuangan", href: "#keuangan" },
  { label: "Pertanyaan", href: "#faq" },
];

/**
 * The register's top rule: a constant hairline rather than chrome that appears
 * on scroll. One navigation, one sign-in, and the one action the whole page is
 * asking for — mendaftarkan yayasan.
 */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    router.push("/");
  };

  const user = session?.user;
  const initials = (user?.name ?? user?.email ?? "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <nav className="bg-background/85 border-border sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="focus-visible:ring-ring/80 shrink-0 rounded-xl focus-visible:ring-[3px] focus-visible:outline-none"
          aria-label="Sera App — beranda"
        >
          <SeraLogo markClassName="h-8 w-auto" />
        </Link>

        <ul className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/80 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="focus-visible:ring-ring/80 rounded-full focus-visible:ring-[3px] focus-visible:outline-none"
                  aria-label="Akun Anda"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.image ?? undefined} alt="" />
                    <AvatarFallback className="text-xs">
                      {initials || <UserIcon className="size-4" />}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user.name ?? user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Buka dasbor</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut className="mr-2 size-4" aria-hidden />
                  Keluar dari akun
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/auth/sign-in">Masuk</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/landing/register/foundation">Daftar yayasan</Link>
              </Button>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Buka menu"
              >
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="border-border border-b px-5 py-4">
                <SeraLogo markClassName="h-8 w-auto" />
              </div>
              <ul className="p-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-foreground hover:bg-accent block rounded-xl px-3 py-3 text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {!user ? (
                <div className="border-border border-t p-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)}>
                      Masuk
                    </Link>
                  </Button>
                </div>
              ) : null}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
