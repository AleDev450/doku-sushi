import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getPosts } from "@/lib/api";
import PostTable from "@/components/admin/PostTable";

export const metadata: Metadata = { title: "Blog · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getPosts();
  const published = posts.filter((p) => p.status === "published").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold">Blog</h1>
          <p className="text-[0.9rem] text-mist">
            {posts.length} posts · {published} publicados
          </p>
        </div>
        <Link href="/admin/blog/nuevo" className="btn btn-solid !px-5">
          <Plus size={16} /> Nuevo post
        </Link>
      </div>

      <PostTable posts={posts} />
    </div>
  );
}
