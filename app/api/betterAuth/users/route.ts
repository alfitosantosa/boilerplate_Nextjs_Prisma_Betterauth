import { handlePrismaError } from "@/services/errorHandler";
import { prisma } from "@/services/prisma";
import { resolveClient } from "@/services/clients";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const t = await resolveClient(
    request,
    request.nextUrl.searchParams.get("clientId"),
  );
  if (!t.ok) return t.response;

  try {
    const users = await prisma.user.findMany({
      include: {
        userData: {
          include: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      // User dianggap milik client bila kolom langsung ATAU userData-nya ber-client sama
      where: {
        OR: [
          { clientId: t.clientId },
          { userData: { clientId: t.clientId } },
        ],
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    const getUserBetterauth = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        userData: {
          include: { role: true },
        },
      },
    });

    return NextResponse.json(getUserBetterauth);
  } catch (error) {
    return handlePrismaError(error);
  }
}
