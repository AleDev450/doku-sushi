"use client";

import { useState } from "react";
import { Users, Calendar, Clock, PartyPopper, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const TIMES = ["12:30", "13:30", "19:00", "20:00", "20:30", "21:00", "21:30", "22:00"];
const OCCASIONS = ["Casual", "Cumpleaños", "Aniversario", "Negocios", "Otro"];

export default function ReservarPage() {
  const [people, setPeople] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [occasion, setOccasion] = useState("Casual");
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [done, setDone] = useState(false);

  const valid = date && contact.name && contact.phone && contact.email.includes("@");

  return (
    <>
      <PageHeader
        kicker="予約 · Reserva"
        title={<>Reserva tu <span className="text-seal">mesa.</span></>}
        subtitle="Las noches en Doko son limitadas. Completa tus datos y confirmamos tu lugar en la barra."
      />

      <section className="bg-ink py-[80px]">
        <div className="wrap max-w-[820px]">
          {done ? (
            <Reveal className="rounded-lg border border-[var(--line)] bg-ink-2 p-10 text-center md:p-14">
              <span className="mb-6 inline-grid h-[72px] w-[72px] place-items-center rounded-full bg-seal"><Check size={34} /></span>
              <h2 className="mb-3 font-display text-[2rem] font-semibold">¡Reserva recibida!</h2>
              <p className="mx-auto max-w-[440px] text-mist">
                Enviamos la confirmación a <b className="text-white">{contact.email}</b>. Te esperamos el{" "}
                <b className="text-white">{date}</b> a las <b className="text-white">{time}</b> para{" "}
                <b className="text-white">{people}</b> {people === 1 ? "persona" : "personas"}.
              </p>
            </Reveal>
          ) : (
            <Reveal className="rounded-lg border border-[var(--line)] bg-ink-2 p-8 md:p-10">
              {/* Personas */}
              <Block icon={<Users size={16} />} label="¿Cuántas personas?">
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => setPeople(n)}
                      className={cn(
                        "h-11 min-w-[46px] rounded-md border px-3 text-[0.9rem] transition-all",
                        people === n ? "border-seal bg-seal text-white" : "border-[var(--line)] text-mist hover:border-white hover:text-white"
                      )}
                    >
                      {n}{n === 8 ? "+" : ""}
                    </button>
                  ))}
                </div>
              </Block>

              {/* Fecha + hora */}
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Block icon={<Calendar size={16} />} label="Fecha">
                  <input type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
                </Block>
                <Block icon={<Clock size={16} />} label="Hora">
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-[0.82rem] transition-all",
                          time === t ? "border-seal bg-seal text-white" : "border-[var(--line)] text-mist hover:border-white hover:text-white"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Block>
              </div>

              {/* Ocasión */}
              <Block icon={<PartyPopper size={16} />} label="Ocasión" className="mt-7">
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-[0.82rem] transition-all",
                        occasion === o ? "border-seal bg-seal text-white" : "border-[var(--line)] text-mist hover:border-white hover:text-white"
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </Block>

              {/* Datos */}
              <div className="mt-8 grid gap-5 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="field-label">Nombre completo</label>
                  <input className="field-input" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="field-label">Teléfono</label>
                  <input className="field-input" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+51 ..." />
                </div>
                <div>
                  <label className="field-label">Correo</label>
                  <input type="email" className="field-input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="tu@correo.com" />
                </div>
              </div>

              <button
                onClick={() => valid && setDone(true)}
                disabled={!valid}
                className={cn("btn btn-solid mt-8 w-full !py-4", !valid && "cursor-not-allowed opacity-40 hover:!transform-none hover:!shadow-none")}
              >
                Confirmar reserva
              </button>
              <p className="mt-3 text-center text-[0.76rem] text-mist-2">
                Al reservar aceptas nuestra política de cancelación de 24 horas.
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}

function Block({ icon, label, children, className }: { icon: React.ReactNode; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className="field-label flex items-center gap-2"><span className="text-seal">{icon}</span> {label}</div>
      {children}
    </div>
  );
}
