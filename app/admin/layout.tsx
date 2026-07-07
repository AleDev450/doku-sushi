import { redirect } from "next/navigation";
import { getCurrentProfile, canAccessAdmin } from "@/lib/auth";
import { getPermissions } from "@/lib/rbac";
import AdminShell from "@/components/admin/AdminShell";

// El admin nunca se cachea: depende de la sesión.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  // Doble candado (además del middleware): sin perfil válido/activo, fuera.
  if (!canAccessAdmin(profile)) {
    // Logueado pero inactivo → mensaje distinto; sin sesión → al login normal.
    redirect(profile ? "/login?error=inactive" : "/login?next=/admin");
  }

  const permissions = await getPermissions(profile);

  return (
    <AdminShell profile={profile} permissions={permissions}>
      {children}
    </AdminShell>
  );
}
