"use client";

import { useGetConnectionBotWa } from "@/hooks/whatsApp/useBotWa";
import { useGetBranchs } from "@/hooks/branches/useBranches";
import { useGetRoles } from "@/hooks/roles/useRoles";
import { useGetUsers } from "@/hooks/users/useUsers";
import { useGetUserByIdBetterAuth } from "@/hooks/users/useUsersByIdBetterAuth";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/services/auth/authClients";
import {
  Building2,
  MessageSquare,
  Shield,
  User,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  { href: "/dashboard/admin/master/users", label: "Kelola Users", icon: User },
  { href: "/dashboard/admin/master/roles", label: "Kelola Roles", icon: Shield },
  {
    href: "/dashboard/admin/master/branches",
    label: "Kelola Branches",
    icon: Building2,
  },
  {
    href: "/dashboard/admin/utility/whatsapp",
    label: "WhatsApp Gateway",
    icon: MessageSquare,
  },
] as const;

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: currentUser } = useGetUserByIdBetterAuth(
    session?.user?.id ?? "",
  );
  const { data: users = [], isLoading: usersLoading } = useGetUsers();
  const { data: roles = [] } = useGetRoles();
  const { data: branches = [] } = useGetBranchs();
  const { data: connection } = useGetConnectionBotWa();

  const stats = [
    { label: "Users", value: users.length, icon: Users },
    { label: "Roles", value: roles.length, icon: Shield },
    { label: "Branches", value: branches.length, icon: Building2 },
  ];

  return (
    <div className="max-w-8xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Selamat datang, {currentUser?.name || session?.user?.name || "User"}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>{label}</CardDescription>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {label === "Users" && usersLoading ? "…" : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User terbaru</CardTitle>
            <CardDescription>5 data terakhir dari user_data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email || "—"}
                    </TableCell>
                    <TableCell>{user.role?.name || "—"}</TableCell>
                  </TableRow>
                ))}
                {!usersLoading && users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-muted-foreground text-center"
                    >
                      Belum ada data user.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp</CardTitle>
            <CardDescription>Status instance Evolution API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {connection?.connection === "success" ? (
                <Wifi className="text-success h-5 w-5" />
              ) : (
                <WifiOff className="text-destructive h-5 w-5" />
              )}
              <Badge
                variant={
                  connection?.connection === "success"
                    ? "default"
                    : "destructive"
                }
              >
                {connection?.connection || "unknown"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {connection?.message || connection?.state || "Belum terhubung."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="border-border bg-card hover:bg-secondary flex items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors"
          >
            <Icon className="text-primary h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
