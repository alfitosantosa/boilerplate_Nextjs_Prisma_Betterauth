"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut, User as UserIcon } from "lucide-react";

import { useGetUserByIdBetterAuth } from "@/hooks/users/useUsersByIdBetterAuth";
import { iconMap, menuGroups } from "@/config/menuGroupsSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/services/auth/authClients";

const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "SaaS Starter";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending: isSessionPending } = useSession();
  const { data: userData, isLoading: isUserDataLoading } =
    useGetUserByIdBetterAuth(session?.user?.id ?? "");

  if (isSessionPending || isUserDataLoading) {
    return (
      <Sidebar className="border-border bg-sidebar text-foreground border-r">
        <SidebarHeader className="border-border bg-sidebar m-3 rounded-3xl border px-5 py-4">
          <span className="text-foreground text-[17px] font-extrabold">
            {clientName}
          </span>
        </SidebarHeader>
        <SidebarContent className="flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Memuat menu...</p>
        </SidebarContent>
      </Sidebar>
    );
  }

  const userRole = userData?.role?.name || "user";
  const permissions = userData?.role?.permissions || [];
  const isAdmin = userRole.toLowerCase().includes("admin");

  const visibleItems = (url: string) =>
    isAdmin || permissions.length === 0 || permissions.includes(url);

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/signIn");
  };

  return (
    <Sidebar className="border-border bg-sidebar text-foreground border-r">
      <SidebarHeader className="border-border bg-sidebar m-3 rounded-3xl border px-5 py-4">
        <Link href="/" className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              <span className="bg-primary relative inline-flex h-2.5 w-2.5 rounded-full" />
            </span>
            <span className="text-foreground text-[17px] font-extrabold tracking-tight">
              {clientName}
            </span>
          </div>
        </Link>
        <div className="text-muted-foreground mt-1 flex items-center gap-1.5 truncate text-[11px] font-medium">
          <Building2 className="text-primary h-3 w-3 shrink-0" />
          <span className="truncate">{clientName}</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin overflow-y-auto px-3 py-3">
        {menuGroups.map((group) => {
          const items = group.items.filter((item) => visibleItems(item.url));
          if (items.length === 0) return null;

          return (
            <SidebarGroup key={group.title} className="mb-2">
              <SidebarGroupLabel className="text-muted-foreground mb-1 px-3 text-xs font-medium">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon ? iconMap[item.icon] : null;
                    const isActive = pathname === item.url;

                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`group/item w-full rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                            isActive
                              ? "bg-primary/8 text-primary font-bold"
                              : "text-secondary-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <Link href={item.url} className="flex items-center gap-2.5">
                            {Icon && (
                              <Icon
                                className={`h-4 w-4 transition-colors ${
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover/item:text-foreground"
                                }`}
                              />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-border bg-sidebar space-y-2 border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group hover:border-border hover:bg-secondary flex w-full items-center gap-2.5 rounded-2xl border border-transparent p-2 text-left transition-all">
              <Avatar className="border-border bg-brand-tint text-primary h-8 w-8 rounded-full border">
                {userData?.avatarUrl && (
                  <Image
                    width={32}
                    height={32}
                    src={userData.avatarUrl}
                    alt={userData.name || "User"}
                    className="rounded-full object-cover"
                  />
                )}
                <AvatarFallback className="bg-brand-tint text-primary text-[11px] font-bold">
                  {getUserInitials(userData?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-foreground truncate text-xs font-bold">
                  {userData?.name || "Pengguna"}
                </span>
                <span className="text-muted-foreground truncate text-[10px] capitalize">
                  {userRole}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="right"
            className="border-border w-56 rounded-3xl p-1.5 shadow-lg"
          >
            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-xs">
              <div>Akun Terhubung</div>
              <div className="text-foreground truncate font-bold">
                {session?.user?.email || "user@example.com"}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="text-secondary-foreground hover:bg-secondary hover:text-primary cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium"
            >
              <UserIcon className="text-primary mr-2 h-4 w-4" />
              <span>Profil Pengguna</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive hover:bg-destructive-chip cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium"
            >
              <LogOut className="text-destructive mr-2 h-4 w-4" />
              <span>Keluar dari Akun</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
