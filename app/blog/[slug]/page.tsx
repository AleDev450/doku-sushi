import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, getPublishedPostSlugs } from "@/lib/api";
import { longDate } from "@/lib/utils";
import Markdown from "@/components/blog/Markdown";

export async function generateStaticParams() {
  return (await getPublishedPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.cover ? { images: [post.cover] } : undefined,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post || post.status !== "published") notFound();

  const meta = `${post.publishedAt ? longDate(post.publishedAt) : ""} · ${post.author}`;

  return (
    <article className="bg-ink">
      <header>
        {post.cover && (
          <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
            <Image src={post.cover} alt={post.title} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0.35),rgba(14,14,14,0.96))]" />
          </div>
        )}

        <div className={post.cover ? "wrap relative -mt-28" : "wrap pt-[120px]"}>
          <Link href="/blog" className="mb-5 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
            <ArrowLeft size={15} /> Blog
          </Link>
          {post.tags.length > 0 && <span className="kicker mb-3 block">{post.tags.join(" · ")}</span>}
          <h1 className="display max-w-[820px] text-[clamp(2rem,4.5vw,3.2rem)]">{post.title}</h1>
          <p className="mt-4 text-[0.85rem] text-mist-2">{meta}</p>
        </div>
      </header>

      <div className="wrap py-14">
        <div className="max-w-[720px]">
          {post.excerpt && (
            <p className="mb-8 border-l-2 border-seal pl-5 text-[1.1rem] font-light leading-relaxed text-neutral-300">
              {post.excerpt}
            </p>
          )}
          <Markdown content={post.body} />
        </div>
      </div>
    </article>
  );
}
