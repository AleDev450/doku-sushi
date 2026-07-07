"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Loader2, ShieldCheck, Check, X } from "lucide-react";
import type { Profile, Role } from "@/lib/auth";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<Role, string> = { superadmin: "Superadmin", editor: "Editor" };

export default function UsersManager({ users, meId }: { users: Profile[]; meId: string }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Alta
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear.");
      setEmail(""); setFullName(""); setPassword(""); setRole("editor");
      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setCreating(false);
    }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo actualizar.");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(u: Profile) {
    if (!confirm(`¿Eliminar a ${u.full_name || u.email}? No se puede deshacer.`)) return;
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo eliminar.");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[1.3rem] font-semibold">Usuarios <span className="text-mist-2">· {users.length}</span></h2>
        <button onClick={() => setShowForm((s) => !s)} className="btn btn-solid !px-4 !py-2 text-[0.8rem]">
          <UserPlus size={15} /> Nuevo usuario
        </button>
      </div>

      {/* Alta */}
      {showForm && (
        <form onSubmit={createUser} className="grid gap-4 rounded-xl border border-[var(--line)] bg-ink p-5 sm:grid-cols-2">
          <div>
            <label className="field-label">Nombre</label>
            <input className="field-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre y apellido" />
          </div>
          <div>
            <label className="field-label">Correo *</label>
            <input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="editor@doko.pe" required />
          </div>
          <div>
            <label className="field-label">Contraseña inicial *</label>
            <input type="text" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="mín. 8 caracteres" required />
            <p className="mt-1.5 text-[0.72rem] text-mist-2">Compártesela al usuario; podrá cambiarla luego.</p>
          </div>
          <div>
            <label className="field-label">Rol</label>
            <select className="field-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="editor">Editor</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          {error && <p className="sm:col-span-2 rounded-md border border-seal/40 bg-seal/10 px-3 py-2 text-[0.82rem] text-seal">{error}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={creating} className="btn btn-solid !px-5 disabled:opacity-60">
              {creating ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />} Crear usuario
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost !px-5">Cancelar</button>
          </div>
        </form>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
        <table className="w-full min-w-[620px] text-left text-[0.86rem]">
          <thead>
            <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
              <th className="px-5 py-3 font-medium">Usuario</th>
              <th className="px-3 py-3 font-medium">Rol</th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isMe = u.id === meId;
              return (
                <tr key={u.id} className={cn("border-b border-[var(--line)] last:border-none transition-opacity", busyId === u.id && "opacity-50")}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-seal/15 font-display text-[0.85rem] font-semibold text-seal">
                        {(u.full_name || u.email).charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-medium">{u.full_name || "—"} {isMe && <span className="text-[0.7rem] text-mist-2">(tú)</span>}</div>
                        <div className="text-[0.76rem] text-mist-2">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {isMe ? (
                      <span className="inline-flex items-center gap-1 text-[0.82rem] text-mist"><ShieldCheck size={14} /> {ROLE_LABEL[u.role]}</span>
                    ) : (
                      <select
                        value={u.role}
                        disabled={busyId === u.id}
                        onChange={(e) => patch(u.id, { role: e.target.value })}
                        className="rounded-md border border-[var(--line)] bg-ink-2 px-2 py-1 text-[0.82rem]"
                      >
                        <option value="editor">Editor</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      disabled={isMe || busyId === u.id}
                      onClick={() => patch(u.id, { active: !u.active })}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-medium transition-colors disabled:opacity-60",
                        u.active ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      )}
                      title={isMe ? "No puedes cambiar tu propio estado" : u.active ? "Desactivar" : "Activar"}
                    >
                      {u.active ? <Check size={12} /> : <X size={12} />}
                      {u.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      disabled={isMe || busyId === u.id}
                      onClick={() => remove(u)}
                      className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal disabled:opacity-40"
                      aria-label="Eliminar"
                      title={isMe ? "No puedes eliminarte" : "Eliminar"}
                    >
                      {busyId === u.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
