import { redirect } from "next/navigation";
import { RegisterForm } from "@/src/components/public/auth-forms";
import { getCurrentUser } from "@/src/lib/auth";

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/anggota");
  return <RegisterForm />;
}
