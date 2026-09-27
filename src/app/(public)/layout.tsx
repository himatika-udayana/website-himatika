import { PublicShell } from "@/src/components/layout/public-shell";
import { getCurrentUser } from "@/src/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return <PublicShell isLoggedIn={Boolean(user)}>{children}</PublicShell>;
}
