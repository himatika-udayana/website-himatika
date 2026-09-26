"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";
import { RESERVED_SLUG_SET } from "@/src/lib/reserved-slugs";
import { validateHttpUrl } from "@/src/lib/http-url";

export type RedirectLinkActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type RedirectLinkUpdateData = {
  slug?: string;
  targetUrl?: string;
  label?: string | null;
};

function validateSlug(slug: string) {
  const normalizedSlug = slug.trim();
  if (!/^[a-zA-Z0-9-]+$/.test(normalizedSlug)) {
    throw new Error("Slug hanya boleh berisi huruf, angka, dan tanda dash.");
  }
  if (RESERVED_SLUG_SET.has(normalizedSlug.toLowerCase())) {
    throw new Error("Slug tersebut dicadangkan untuk route aplikasi.");
  }
  return normalizedSlug;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "Slug tersebut sudah digunakan oleh redirect link lain.";
  }
  return error instanceof Error ? error.message : fallback;
}

function refreshRedirectAdmin() {
  revalidatePath("/admin/redirect-link");
}

export async function getRedirectLinks() {
  await requireAdmin();
  return prisma.redirectLink.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createRedirectLink(
  slug: string,
  targetUrl: string,
  label?: string,
): Promise<RedirectLinkActionResult> {
  await requireAdmin();

  try {
    await prisma.redirectLink.create({
      data: {
        slug: validateSlug(slug),
        targetUrl: validateHttpUrl(targetUrl, "Target"),
        label: label?.trim() || null,
      },
    });
    refreshRedirectAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error, "Redirect link gagal dibuat.") };
  }
}

export async function updateRedirectLink(
  id: string,
  data: RedirectLinkUpdateData,
): Promise<RedirectLinkActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID redirect link tidak valid." };

  try {
    const update: { slug?: string; targetUrl?: string; label?: string | null } = {};
    if (data.slug !== undefined) update.slug = validateSlug(data.slug);
    if (data.targetUrl !== undefined) update.targetUrl = validateHttpUrl(data.targetUrl, "Target");
    if (data.label !== undefined) update.label = data.label?.trim() || null;
    if (Object.keys(update).length === 0) {
      return { ok: false, error: "Tidak ada perubahan untuk disimpan." };
    }

    await prisma.redirectLink.update({ where: { id }, data: update });
    refreshRedirectAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error, "Redirect link gagal diperbarui.") };
  }
}

export async function deleteRedirectLink(id: string): Promise<RedirectLinkActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID redirect link tidak valid." };

  try {
    await prisma.redirectLink.delete({ where: { id } });
    refreshRedirectAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error, "Redirect link gagal dihapus.") };
  }
}

export async function toggleActive(id: string): Promise<RedirectLinkActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID redirect link tidak valid." };

  try {
    const link = await prisma.redirectLink.findUnique({ where: { id } });
    if (!link) return { ok: false, error: "Redirect link tidak ditemukan." };

    await prisma.redirectLink.update({
      where: { id },
      data: { isActive: !link.isActive },
    });
    refreshRedirectAdmin();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error, "Status redirect link gagal diperbarui.") };
  }
}
