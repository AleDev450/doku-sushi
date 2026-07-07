import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/api";
import PostForm from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Editar post · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditarPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(Number(params.id));
  if (!post) notFound();

  return <PostForm initial={post} />;
}
