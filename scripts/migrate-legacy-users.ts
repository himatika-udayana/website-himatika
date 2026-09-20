import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { pathToFileURL } from "node:url";
import { prisma } from "../src/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const legacyDbPath = process.env.LEGACY_DJANGO_DB_PATH ?? "./backend/db.sqlite3";

type LegacyUserRow = {
  id: number | string;
  email: string;
  nama_lengkap: string | null;
  nim: string | null;
  angkatan: string | number | null;
  is_verified: boolean | null;
};

function loadLegacyUsers(): LegacyUserRow[] {
  const db = new Database(legacyDbPath, { fileMustExist: true });

  const rows = db
    .prepare(
      `SELECT id, email, nama_lengkap, nim, angkatan, is_verified FROM users_user ORDER BY id`
    )
    .all() as Array<{
      id: number;
      email: string;
      nama_lengkap: string | null;
      nim: string | null;
      angkatan: string | number | null;
      is_verified: number | boolean | null;
    }>;

  db.close();

  return rows.map((row) => ({
    id: row.id,
    email: String(row.email ?? "").trim().toLowerCase(),
    nama_lengkap: row.nama_lengkap ?? null,
    nim: row.nim ?? null,
    angkatan: row.angkatan ?? null,
    is_verified: row.is_verified === true || row.is_verified === 1,
  }));
}

async function inviteUserByEmail(email: string) {
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error(
      "Supabase env is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the migration."
    );
  }

  const serviceRoleKey = supabaseServiceRole as string;

  const headers: HeadersInit = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${supabaseUrl}/auth/v1/invite`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      data: {},
      redirect_to: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
    }),
  });

  const payload = await response.text();

  if (!response.ok) {
    throw new Error(`Invite failed (${response.status}): ${payload}`);
  }

  const json = payload ? JSON.parse(payload) : {};
  return json.user ?? { id: null, email };
}

async function findSupabaseUserByEmail(email: string) {
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error(
      "Supabase env is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the migration."
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });

    if (error) {
      throw new Error(`Supabase Auth lookup failed: ${error.message}`);
    }

    const matchingUser = data.users.find((user) => user.email?.toLowerCase() === email);
    if (matchingUser) {
      return matchingUser;
    }

    if (data.users.length < 1000) {
      return null;
    }
  }
}

export async function main() {
  const legacyUsers = loadLegacyUsers();

  const results = {
    success: [] as string[],
    failed: [] as { email: string; reason: string }[],
  };

  for (const user of legacyUsers) {
    const email = String(user.email ?? "").trim().toLowerCase();

    if (!email) {
      results.failed.push({ email: "<empty>", reason: "Missing email in legacy row" });
      continue;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (existingUser) {
      results.success.push(`${email} already migrated`);
      continue;
    }

    try {
      const existingAuthUser = await findSupabaseUserByEmail(email);
      const authUser = existingAuthUser ?? (await inviteUserByEmail(email));

      if (!authUser?.id) {
        throw new Error("Supabase auth user id missing in invite response");
      }

      await prisma.user.create({
        data: {
          id: authUser.id,
          email,
          fullName: user.nama_lengkap ?? "Anggota HIMATIKA",
          nim: user.nim ?? null,
          angkatan: Number(user.angkatan ?? 0) || null,
          role: "ANGGOTA",
          status: "ANGGOTA",
          isVerified: Boolean(user.is_verified),
          divisiSlug: null,
          jabatan: null,
        },
      });

      results.success.push(email);
    } catch (error) {
      results.failed.push({
        email,
        reason: error instanceof Error ? error.message : "Unknown migration error",
      });
    }
  }

  console.log("Legacy user migration summary");
  console.log(`Successful: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.success.length > 0) {
    console.log("Succeeded:");
    for (const item of results.success) {
      console.log(`- ${item}`);
    }
  }

  if (results.failed.length > 0) {
    console.log("Failed:");
    for (const item of results.failed) {
      console.log(`- ${item.email}: ${item.reason}`);
    }
  }
}

const isDirectExecution =
  process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectExecution) {
  main().catch((error) => {
    console.error("Legacy user migration failed:", error);
    process.exitCode = 1;
  });
}
