import { redirect } from "next/navigation";
import { ResetForm } from "@/src/components/public/auth-forms";
import { getCurrentUser } from "@/src/lib/auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ recovery?: string }>;
}) {
  const params = await searchParams;
  if (params.recovery !== "1" && (await getCurrentUser())) {
    redirect("/anggota");
  }
  return <ResetForm />;
}
