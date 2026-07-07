/** @type {import('next').NextConfig} */

const remotePatterns = [
  { protocol: "https", hostname: "images.unsplash.com" },
];

// Habilita imágenes servidas desde Supabase Storage (<ref>.supabase.co).
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    remotePatterns.push({
      protocol: "https",
      hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
    });
  }
} catch {
  /* NEXT_PUBLIC_SUPABASE_URL ausente o inválida: se ignora. */
}

const nextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
