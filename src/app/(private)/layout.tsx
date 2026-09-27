import { PublicNavbar } from "@/src/components/layout/public-shell";
import { getCurrentUser } from "@/src/lib/auth";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar isLoggedIn={Boolean(user)} />
      {children}
    </div>
  );
}