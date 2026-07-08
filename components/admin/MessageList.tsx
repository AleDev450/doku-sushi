"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, MailOpen, Mail } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MessageList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function toggleRead(m: ContactMessage) {
    setBusy(m.id);
    try {
      await fetch(`/api/contact/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !m.read }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(m: ContactMessage) {
    if (!confirm(`¿Eliminar el mensaje de ${m.name}?`)) return;
    setBusy(m.id);
    try {
      await fetch(`/api/contact/${m.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (messages.length === 0) {
    return <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">No hay mensajes.</div>;
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m.id} className={cn("rounded-xl border bg-ink p-5 transition-opacity", m.read ? "border-[var(--line)]" : "border-seal/40", busy === m.id && "opacity-50")}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-seal" />}
                <span className="font-medium">{m.name}</span>
                <a href={`mailto:${m.email}`} className="truncate text-[0.78rem] text-mist-2 hover:text-white">{m.email}</a>
              </div>
              {m.subject && <div className="mt-1 text-[0.82rem] font-medium text-mist">{m.subject}</div>}
              <p className="mt-2 whitespace-pre-wrap text-[0.9rem] leading-relaxed text-neutral-300">{m.message}</p>
              <div className="mt-2 text-[0.72rem] text-mist-2">
                {new Date(m.createdAt).toLocaleString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => toggleRead(m)} disabled={busy === m.id} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" title={m.read ? "Marcar no leído" : "Marcar leído"}>
                {m.read ? <Mail size={15} /> : <MailOpen size={15} />}
              </button>
              <button onClick={() => remove(m)} disabled={busy === m.id} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal" title="Eliminar">
                {busy === m.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
