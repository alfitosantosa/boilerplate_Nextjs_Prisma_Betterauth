import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/layout/dashboardShell";
import { auth } from "@/services/auth/auth";
import { prisma } from "@/services/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/auth/signIn");

  const [user, userData] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { clientId: true },
    }),
    prisma.userData.findUnique({
      where: { userId: session.user.id },
      select: { clientId: true },
    }),
  ]);

  if (!user?.clientId && !userData?.clientId) redirect("/onboarding");

  return <DashboardShell>{children}</DashboardShell>;
}
