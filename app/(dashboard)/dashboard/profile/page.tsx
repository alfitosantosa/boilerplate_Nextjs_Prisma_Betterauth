"use client";

import Image from "next/image";

import { useGetUserByIdBetterAuthProfile } from "@/hooks/users/useUsersByIdBetterAuth";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/services/auth/authClients";
import { Building2, Mail, Shield, User } from "lucide-react";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="border-border flex items-center justify-between gap-3 border-b py-2 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-right text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: user, isLoading, isError } = useGetUserByIdBetterAuthProfile(
    session?.user?.id ?? "",
  );

  if (!session?.user) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={72}
              height={72}
              className="h-18 w-18 rounded-full object-cover"
            />
          ) : (
            <div className="bg-secondary flex h-16 w-16 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-7 w-7" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              {user?.name || session.user.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {user?.email || session.user.email}
            </p>
          </div>
          <Badge variant={user?.isActive === false ? "secondary" : "default"}>
            {user?.isActive === false ? "Tidak aktif" : "Aktif"}
          </Badge>
        </CardContent>
      </Card>

      {isError && (
        <p className="border-destructive/40 bg-destructive/5 text-destructive rounded-lg border p-3 text-sm">
          Profil user_data belum tersedia. Hubungi admin untuk menghubungkan akun.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Email" value={session.user.email} />
            <InfoRow
              label="Email terverifikasi"
              value={session.user.emailVerified ? "Ya" : "Belum"}
            />
            <InfoRow label="User ID" value={session.user.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Akses
            </CardTitle>
            <CardDescription>Role dan branch dari user_data.</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoRow label="Role" value={user?.role?.name} />
            <InfoRow label="Status" value={user?.status} />
            <InfoRow label="Posisi" value={user?.position} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-x-8 md:grid-cols-2">
            <InfoRow label="Nama" value={user?.name} />
            <InfoRow label="Email profil" value={user?.email} />
            <InfoRow label="Telepon orang tua" value={user?.parentPhone} />
            <InfoRow label="NIK" value={user?.nik} />
            <InfoRow label="NISN" value={user?.nisn} />
            <InfoRow label="Employee ID" value={user?.employeeId} />
            <InfoRow label="Alamat" value={user?.address} />
            <InfoRow label="Branch ID" value={user?.branchId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
