// Anti-bot ligero para formularios PÚBLICOS (sin servicios externos ni cuentas).
//
//   1) Honeypot: un campo oculto ("website") que un humano nunca ve ni llena.
//      Si llega con contenido, es un bot que rellenó todo el formulario.
//   2) Time-trap: el cliente manda cuándo se renderizó el form (_ts). Un envío
//      casi instantáneo (< MIN_FILL_MS) delata a un script automatizado.
//
// NO frena floods volumétricos (para eso están el rate limit / Vercel Firewall),
// pero elimina el spam automatizado típico de formularios y no cuesta nada.
//
// Ante un bot devolvemos un "éxito" falso desde el Route Handler (no un error),
// para no revelarle el mecanismo y que no reintente ni se adapte.

export const HONEYPOT_FIELD = "website";
export const TIMESTAMP_FIELD = "_ts";

const MIN_FILL_MS = 2000; // llenar nombre/correo/etc. en < 2s = no es humano

export function isBotSubmission(body: Record<string, unknown>): boolean {
  // Honeypot con contenido => bot.
  const hp = body[HONEYPOT_FIELD];
  if (typeof hp === "string" && hp.trim() !== "") return true;

  // Envío sospechosamente rápido tras renderizar => bot.
  const ts = Number(body[TIMESTAMP_FIELD]);
  if (Number.isFinite(ts) && ts > 0) {
    const elapsed = Date.now() - ts;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return true;
  }

  return false;
}
