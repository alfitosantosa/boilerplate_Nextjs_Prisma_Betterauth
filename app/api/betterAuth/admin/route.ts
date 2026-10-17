import { auth } from "@/services/auth/auth";
import { handlePrismaError } from "@/services/errorHandler";
import { prisma } from "@/services/prisma";
import { resolveClient, clientForbidden } from "@/services/clients";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const t = await resolveClient(request);
  if (!t.ok) return t.response;

  // Hanya admin yang boleh mengubah role user lain.
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 403 },
    );
  }

  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing required fields: userId and role" },
        { status: 400 },
      );
    }

    // Target harus milik client pemanggil (lewat user.clientId atau userData.clientId).
    const owned = await prisma.user.findFirst({
      where: {
        id: userId,
        OR: [
          { clientId: t.clientId },
          { userData: { clientId: t.clientId } },
        ],
      },
      select: { id: true },
    });
    if (!owned) return clientForbidden("Data tidak ditemukan di client ini");

    await auth.api.setRole({
      body: { userId, role },
      headers: request.headers,
    });
    return NextResponse.json(
      { message: "Role assigned successfully" },
      { status: 200 },
    );
  } catch (error) {
    return handlePrismaError(error);
  }
}
