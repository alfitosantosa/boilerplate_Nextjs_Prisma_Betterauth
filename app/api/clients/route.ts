import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/services/auth/auth";
import { createClientForUser } from "@/services/clients";
import { handlePrismaError } from "@/services/errorHandler";
import { prisma } from "@/services/prisma";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Sesi tidak ditemukan" },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientId: true },
  });

  if (!user?.clientId) return NextResponse.json(null);

  const client = await prisma.client.findUnique({
    where: { id: user.clientId },
    include: {
      _count: { select: { users: true, roles: true, branches: true } },
    },
  });

  return NextResponse.json(client);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Sesi tidak ditemukan" },
      { status: 401 },
    );
  }

  try {
    const { name, email, phone, address } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Nama client minimal 2 karakter" },
        { status: 400 },
      );
    }

    const client = await createClientForUser(session.user.id, {
      name: name.trim(),
      email,
      phone,
      address,
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("sudah memiliki")) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 409 },
      );
    }
    return handlePrismaError(error);
  }
}
