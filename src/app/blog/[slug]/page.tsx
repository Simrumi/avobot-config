import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | HUSTLR" };

  return {
    title: `${post.title} | HUSTLR`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16 bg-[#E8524A] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </Link>
          <div className="flex items-center gap-3 mb-6 text-xs">
            <span className="text-white/90 font-semibold uppercase tracking-widest bg-white/10 px-3 py-1 rounded">
              {post.category}
            </span>
            <span className="text-white/70">{post.readingTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
            {post.excerpt}
          </p>
          <div className="text-sm text-white/70">
            {formatDate(post.date)} · By {post.author}
          </div>
        </div>
      </section>

      {/* Feature Image */}
      {post.image && (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-8">
          <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <article className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="prose-article">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {/* Bottom CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
            Ready to see what AI can do for your business?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Book a free AI audit. We&apos;ll look at your workflows and show
            you exactly where AI will save time and money — no jargon, no
            obligation.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 bg-[#E8524A] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#d14a43] transition-colors rounded"
          >
            Get a Free AI Audit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
