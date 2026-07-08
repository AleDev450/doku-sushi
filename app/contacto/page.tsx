"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Instagram, Facebook, Send, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!(form.name && form.email.includes("@") && form.message)) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        kicker="連絡 · Contacto"
        title={<>Hablemos.</>}
        subtitle="¿Una reserva especial, un evento privado o una consulta? Estamos a un mensaje de distancia."
      />

      <section className="bg-ink py-[80px]">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          {/* Info */}
          <div className="space-y-8">
            <Reveal className="space-y-6">
              <InfoRow icon={<MapPin size={18} />} title="Dirección" lines={["Av. La Mar 1247", "Miraflores, Lima"]} />
              <InfoRow icon={<Clock size={18} />} title="Horario" lines={["Mar – Dom · 12:30 – 23:30", "Lunes cerrado"]} />
              <InfoRow icon={<Phone size={18} />} title="Teléfono" lines={["+51 1 234 5678"]} />
              <InfoRow icon={<Mail size={18} />} title="Correo" lines={["hola@doko.pe"]} />
            </Reveal>

            <Reveal className="flex flex-wrap gap-3">
              <a href="https://wa.me/5112345678" target="_blank" rel="noreferrer" className="btn btn-solid">
                <Send size={15} /> WhatsApp
              </a>
              <a href="#" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] text-mist transition-colors hover:border-white hover:text-white"><Instagram size={18} /></a>
              <a href="#" className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] text-mist transition-colors hover:border-white hover:text-white"><Facebook size={18} /></a>
            </Reveal>

            <Reveal className="relative h-64 overflow-hidden rounded-lg border border-[var(--line)]">
              <iframe
                title="Mapa Doko"
                className="h-full w-full grayscale invert-[0.92] contrast-[0.9]"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-77.04%2C-12.131%2C-77.02%2C-12.115&layer=mapnik"
              />
            </Reveal>
          </div>

          {/* Formulario */}
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-[var(--line)] bg-ink-2 p-8 md:p-10">
              {sent ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-seal"><Check size={30} /></span>
                  <h3 className="mb-2 font-display text-[1.6rem] font-semibold">¡Mensaje enviado!</h3>
                  <p className="text-mist">Te responderemos muy pronto. Gracias por escribir a Doko.</p>
                </div>
              ) : (
                <>
                  <h3 className="mb-6 font-display text-[1.6rem] font-semibold">Escríbenos</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="field-label">Nombre</label>
                      <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="field-label">Correo</label>
                      <input type="email" className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com" />
                    </div>
                    <div>
                      <label className="field-label">Mensaje</label>
                      <textarea rows={5} className="field-input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="¿En qué te ayudamos?" />
                    </div>
                    {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-2.5 text-[0.82rem] text-seal">{error}</p>}
                    <button onClick={submit} disabled={submitting} className="btn btn-solid w-full !py-3.5 disabled:opacity-60">
                      {submitting ? "Enviando…" : "Enviar mensaje"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-[var(--line)] text-seal">{icon}</span>
      <div>
        <div className="text-[0.7rem] uppercase tracking-[0.16em] text-mist-2">{title}</div>
        {lines.map((l) => (
          <div key={l} className="text-[0.98rem]">{l}</div>
        ))}
      </div>
    </div>
  );
}
