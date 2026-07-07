import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSuperadmin, listProfiles, getRolePermissions } from "@/lib/rbac";
import { SECTIONS } from "@/lib/sections";
import UsersManager from "@/components/admin/UsersManager";
import PermissionsMatrix from "@/components/admin/PermissionsMatrix";

export const metadata: Metadata = { title: "Usuarios · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const me = await requireSuperadmin();
  if (!me) redirect("/admin");

  const [users, rolePerms] = await Promise.all([listProfiles(), getRolePermissions()]);

  const editorPerms: Record<string, { view: boolean; edit: boolean }> = {};
  for (const s of SECTIONS) editorPerms[s.key] = { view: false, edit: false };
  for (const rp of rolePerms) {
    if (rp.role === "editor") editorPerms[rp.section] = { view: rp.can_view, edit: rp.can_edit };
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Usuarios y permisos</h1>
        <p className="text-[0.9rem] text-mist">Gestiona el equipo y qué secciones puede ver y editar cada rol.</p>
      </div>

      <UsersManager users={users} meId={me.id} />
      <PermissionsMatrix initial={editorPerms} />
    </div>
  );
}
