import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TEMPORARY: Bypass auth for immediate testing
  const session = {
    user: {
      name: "Admin User",
      email: "admin@royaltraditionalcraft.in",
      role: "ADMIN",
    }
  };

  return (
    <AdminLayoutClient user={session.user}>
      {children}
    </AdminLayoutClient>
  );
}
