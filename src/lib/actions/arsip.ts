"use server";

import { prisma } from "@/src/lib/prisma";
import { requireVerifiedUser } from "@/src/lib/auth";

export async function getArsipList() {
  await requireVerifiedUser();
  return prisma.arsipSoal.findMany({
    orderBy: [{ tahun: "desc" }, { createdAt: "desc" }],
    include: { mataKuliah: true },
  });
}

export async function getMataKuliahOptions() {
  await requireVerifiedUser();
  return prisma.mataKuliah.findMany({ orderBy: { kode: "asc" } });
}

export async function getDownloadUrl(arsipId: string) {
  await requireVerifiedUser();
  const arsip = await prisma.arsipSoal.findUnique({ where: { id: arsipId }, select: { linkGdrive: true } });
  return arsip ? { downloadUrl: arsip.linkGdrive } : null;
}