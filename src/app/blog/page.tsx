import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | HUSTLR — AI Insights for Malaysian & Singaporean Businesses",
  description:
    "Practical guides, opinion, and case studies on AI for SMEs in Malaysia and Singapore. No jargon. No hype.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-20 bg-[#E8524A] text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-4 block">
            HUSTLR Journal
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            AI INSIGHTS
            <br />
            <span className="text-white/80">FOR REAL BUSINESSES</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Practical guides, honest opinion, and case studies on AI for
            Malaysian and Singaporean SMEs. No jargon. No hype.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group border border-gray-200 rounded-lg overflow-hidden hover:border-[#E8524A] transition-all duration-300 flex flex-col"
                >
                  {post.image ? (
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-[#E8524A]/10 to-gray-100 flex items-center justify-center">
                      <span className="text-6xl font-black text-[#E8524A]/20">
                        H
                      </span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <span className="text-[#E8524A] font-semibold uppercase tracking-widest">
                        {post.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{post.readingTime}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-[#E8524A] transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                      {formatDate(post.date)} · {post.author}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
