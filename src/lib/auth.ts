import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { createServerClient } from "@/src/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string;
  nim: string | null;
  angkatan: number | null;
  role: "ANGGOTA" | "ADMIN";
  isVerified: boolean;
  status: "PENGURUS" | "ANGGOTA" | "ALUMNI";
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const fallbackEmail = profileFallbackEmail(user.email ?? "");

  const profile = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email ?? fallbackEmail,
      fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Pengguna",
      avatarUrl: user.user_metadata?.avatar_url ?? null,
    },
    create: {
      id: user.id,
      email: user.email ?? fallbackEmail,
      fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Pengguna",
      avatarUrl: user.user_metadata?.avatar_url ?? null,
      role: "ANGGOTA",
      status: "ANGGOTA",
      isVerified: false,
      nim: null,
      angkatan: null,
    },
  });

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    nim: profile.nim,
    angkatan: profile.angkatan,
    role: profile.role,
    isVerified: profile.isVerified,
    status: profile.status,
  };
}

function profileFallbackEmail(email: string) {
  return email || "guest@himatika.local";
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/login?error=unauthorized");
  }

  return user;
}
