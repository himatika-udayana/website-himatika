'use server';

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { createServerClient } from "@/src/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const registerSchema = z.object({
  email: z.string().trim().email("Format email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
  fullName: z.string().trim().min(2, "Nama lengkap wajib diisi."),
  nim: z.string().trim(),
  angkatan: z.string().trim(),
});

function validateLegacyMemberData(nim: string, angkatan: string) {
  if (!nim || !angkatan) {
    throw new Error("NIM dan angkatan wajib diisi.");
  }

  if (!/^\d{10}$/.test(nim)) {
    throw new Error("NIM harus terdiri dari 10 digit angka.");
  }

  if (!/^\d{4}$/.test(angkatan)) {
    throw new Error("Angkatan harus berupa tahun, misalnya 2024.");
  }

  if (nim.slice(2, 7) !== "08541") {
    throw new Error("NIM bukan milik Program Studi Matematika FMIPA Universitas Udayana.");
  }

  if (nim.slice(0, 2) !== angkatan.slice(-2)) {
    throw new Error("Dua digit pertama NIM tidak sesuai dengan angkatan.");
  }
}

async function upsertProfileFromSupabase(userId: string, email: string, fullName: string) {
  return prisma.user.upsert({
    where: { id: userId },
    update: {
      email,
      fullName,
      isVerified: true,
    },
    create: {
      id: userId,
      email,
      fullName,
      role: "ANGGOTA",
      status: "ANGGOTA",
      isVerified: true,
      nim: null,
      angkatan: null,
    },
  });
}

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Login gagal, silakan coba lagi." };
  }

  await upsertProfileFromSupabase(data.user.id, email, data.user.user_metadata?.full_name ?? data.user.email ?? email);

  redirect("/");
}

export async function registerAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const payload = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    nim: formData.get("nim"),
    angkatan: formData.get("angkatan"),
  });

  if (!payload.success) {
    return { error: payload.error.issues[0]?.message ?? "Data registrasi tidak valid." };
  }

  const { email, password, fullName, nim, angkatan } = payload.data;

  try {
    validateLegacyMemberData(nim, angkatan);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Validasi NIM tidak valid." };
  }

  const existingProfile = await prisma.user.findFirst({
    where: {
      OR: [{ email: email.toLowerCase() }, { nim }],
    },
  });

  if (existingProfile) {
    return { error: "Email atau NIM sudah terdaftar." };
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Registrasi gagal karena user tidak dibuat." };
  }

  await prisma.user.upsert({
    where: { id: data.user.id },
    update: {
      email: email.toLowerCase(),
      fullName,
      nim,
      angkatan: Number(angkatan),
      role: "ANGGOTA",
      status: "ANGGOTA",
      isVerified: false,
    },
    create: {
      id: data.user.id,
      email: email.toLowerCase(),
      fullName,
      nim,
      angkatan: Number(angkatan),
      role: "ANGGOTA",
      status: "ANGGOTA",
      isVerified: false,
    },
  });

  redirect("/login?registered=1");
}

export async function logoutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { error: "Email wajib diisi." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Link reset password telah dikirim ke email Anda." };
}

export async function resetPasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");

  if (!password || password.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?reset=1");
}
