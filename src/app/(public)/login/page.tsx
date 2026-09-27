import { redirect } from "next/navigation";
import { LoginForm } from "@/src/components/public/auth-forms";
import { getCurrentUser } from "@/src/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const [{ error }, user] = await Promise.all([searchParams, getCurrentUser()]);

  if (user) redirect("/");

  const initialError =
    error === "unverified"
      ? "Silakan konfirmasi email kamu terlebih dahulu sebelum login."
      : undefined;

  return <LoginForm initialError={initialError} />;
}
