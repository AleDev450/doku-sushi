import type { Metadata } from "next";
import PostForm from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Nuevo post · Admin", robots: { index: false } };

export default function NuevoPostPage() {
  return <PostForm />;
}
