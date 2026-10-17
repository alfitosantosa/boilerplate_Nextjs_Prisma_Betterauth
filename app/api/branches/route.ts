import { handlePrismaError } from "@/services/errorHandler";
import { prisma } from "@/services/prisma";
import { resolveClient, clientForbidden } from "@/services/clients";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const t = await resolveClient(
    request,
    request.nextUrl.searchParams.get("clientId"),
  );
  if (!t.ok) return t.response;

  try {
    const branches = await prisma.branch.findMany({
      where: { clientId: t.clientId },
      include: {
        _count: { select: { users: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(branches);
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function POST(request: NextRequest) {
  const t = await resolveClient(request);
  if (!t.ok) return t.response;

  try {
    const { code, name, description, address, phone, adminName, signatureUrl, isActive } =
      await request.json();

    if (!code || !name) {
      return NextResponse.json(
        { error: "Code and name are required" },
        { status: 400 },
      );
    }

    const branch = await prisma.branch.create({
      data: {
        code,
        name,
        description,
        address,
        phone,
        adminName,
        signatureUrl,
        isActive: isActive ?? true,
        clientId: t.clientId,
      },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function PUT(request: NextRequest) {
  const t = await resolveClient(request);
  if (!t.ok) return t.response;

  try {
    const { id, code, name, description, address, phone, adminName, signatureUrl, isActive } =
      await request.json();

    if (!id || !code || !name) {
      return NextResponse.json(
        { error: "ID, code, and name are required" },
        { status: 400 },
      );
    }

    const owned = await prisma.branch.findFirst({
      where: { id, clientId: t.clientId },
      select: { id: true },
    });
    if (!owned) {
      return clientForbidden("Data tidak ditemukan di client ini");
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: { code, name, description, address, phone, adminName, signatureUrl, isActive },
    });

    return NextResponse.json(branch);
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const t = await resolveClient(request);
  if (!t.ok) return t.response;

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const owned = await prisma.branch.findFirst({
      where: { id, clientId: t.clientId },
      select: { id: true },
    });
    if (!owned) {
      return clientForbidden("Data tidak ditemukan di client ini");
    }

    const branch = await prisma.branch.delete({ where: { id } });
    return NextResponse.json(branch);
  } catch (error) {
    return handlePrismaError(error);
  }
}
