import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import PostForm from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Nuevo post · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NuevoPostPage() {
  await assertSectionAccess("blog", "edit");
  return <PostForm />;
}
