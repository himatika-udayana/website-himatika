import { redirect } from "next/navigation";
import { ForgotForm } from "@/src/components/public/auth-forms";
import { getCurrentUser } from "@/src/lib/auth";

export default async function ForgotPasswordPage() {
  if (await getCurrentUser()) redirect("/anggota");
  return <ForgotForm />;
}
