import type { Metadata } from "next";
import { listMessages } from "@/lib/operations";
import { assertSectionAccess } from "@/lib/rbac";
import MessageList from "@/components/admin/MessageList";

export const metadata: Metadata = { title: "Mensajes · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminMensajesPage() {
  await assertSectionAccess("mensajes", "view");
  const messages = await listMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Mensajes</h1>
        <p className="text-[0.9rem] text-mist">{messages.length} en total · {unread} sin leer</p>
      </div>
      <MessageList messages={messages} />
    </div>
  );
}
