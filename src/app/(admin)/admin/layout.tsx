import { redirect } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return <>{children}</>;
}
