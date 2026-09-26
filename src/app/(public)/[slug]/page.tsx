import { notFound, redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { RESERVED_SLUG_SET } from "@/src/lib/reserved-slugs";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (RESERVED_SLUG_SET.has(slug.toLowerCase())) {
    notFound();
  }

  const link = await prisma.redirectLink.findUnique({
    where: { slug, isActive: true },
    select: { targetUrl: true },
  });

  if (!link) notFound();

  redirect(link.targetUrl);
}
