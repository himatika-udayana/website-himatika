import { redirect } from "next/navigation";
import { LoginForm } from "@/src/components/public/auth-forms";
import { getCurrentUser } from "@/src/lib/auth";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/anggota");
  return <LoginForm />;
}
