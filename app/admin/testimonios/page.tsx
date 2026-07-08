import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTestimonials } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import TestimonialTable from "@/components/admin/TestimonialTable";

export const metadata: Metadata = { title: "Testimonios · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminTestimoniosPage() {
  await assertSectionAccess("testimonios", "view");
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold">Testimonios</h1>
          <p className="text-[0.9rem] text-mist">{testimonials.length} testimonios en la home</p>
        </div>
        <Link href="/admin/testimonios/nuevo" className="btn btn-solid !px-5">
          <Plus size={16} /> Nuevo testimonio
        </Link>
      </div>

      <TestimonialTable testimonials={testimonials} />
    </div>
  );
}
