/**
 * Generate a feature image for a blog post using Google's Nano Banana
 * (gemini-2.5-flash-image).
 *
 * Usage:
 *   npm run blog:image <slug>         — generate for one post
 *   npm run blog:image -- --all       — regenerate all posts
 *   npm run blog:image -- --missing   — only posts without an image
 *
 * Requires GEMINI_API_KEY in .env.local.
 * Images are saved to public/blog/<slug>.png and the post frontmatter
 * is updated with `image: /blog/<slug>.png`.
 */

import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import matter from "gray-matter";
import { GoogleGenAI } from "@google/genai";

// Load env from .env.local (Next.js convention, already gitignored).
config({ path: path.join(process.cwd(), ".env.local") });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "Missing GEMINI_API_KEY. Add it to .env.local:\n  GEMINI_API_KEY=your_key_here"
  );
  process.exit(1);
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const OUTPUT_DIR = path.join(process.cwd(), "public/blog");
const MODEL = "gemini-2.5-flash-image";

// HUSTLR brand colour used in prompts.
const BRAND_RED = "#E8524A (a warm coral-red)";

const STYLE_GUIDE = [
  "Bold editorial illustration in the style of a modern magazine cover.",
  `Primary colour palette: ${BRAND_RED}, off-white, deep charcoal, cream.`,
  "Flat, graphic, geometric shapes. Confident line work. No photorealism.",
  "Clean negative space. Slightly retro feel. No text, no letters, no words in the image.",
  "Composition suited to a 16:9 wide banner.",
].join(" ");

type Post = {
  slug: string;
  filePath: string;
  data: Record<string, unknown>;
  content: string;
};

function loadPost(slug: string): Post {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slug}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  return { slug, filePath, data: parsed.data, content: parsed.content };
}

function listSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function buildPrompt(post: Post): string {
  const title = String(post.data.title ?? "");
  const excerpt = String(post.data.excerpt ?? "");
  const category = String(post.data.category ?? "");

  return [
    `Create a feature image for a blog post titled: "${title}".`,
    excerpt ? `Post summary: ${excerpt}` : "",
    category ? `Category: ${category}.` : "",
    "",
    "Visual direction:",
    STYLE_GUIDE,
    "",
    "The illustration should metaphorically represent the post's subject.",
    "Avoid clichés like robot heads, brain-with-circuit imagery, or blue glowing neural networks.",
    "Do not include any text or typography in the image.",
    "Focus on strong composition and visual metaphor.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function generateImage(prompt: string): Promise<Buffer> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const candidates = response.candidates ?? [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, "base64");
      }
    }
  }

  throw new Error("No image data returned from Gemini");
}

function updateFrontmatter(post: Post, imagePath: string): void {
  const updated = { ...post.data, image: imagePath };
  const fileContent = matter.stringify(post.content, updated);
  fs.writeFileSync(post.filePath, fileContent, "utf8");
}

async function processPost(slug: string): Promise<void> {
  const post = loadPost(slug);
  const prompt = buildPrompt(post);

  console.log(`\n[${slug}] Generating image…`);
  console.log(`  Title: ${post.data.title}`);

  const imageBuffer = await generateImage(prompt);
  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(outputPath, imageBuffer);

  const publicPath = `/blog/${slug}.png`;
  updateFrontmatter(post, publicPath);

  console.log(`  Saved: ${outputPath}`);
  console.log(`  Frontmatter updated: image: ${publicPath}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let targets: string[];

  if (args.includes("--all")) {
    targets = listSlugs();
  } else if (args.includes("--missing")) {
    targets = listSlugs().filter((slug) => {
      const post = loadPost(slug);
      return !post.data.image;
    });
    if (targets.length === 0) {
      console.log("All posts already have images.");
      return;
    }
  } else {
    const slug = args[0];
    if (!slug) {
      console.error(
        "Usage:\n  npm run blog:image <slug>\n  npm run blog:image -- --all\n  npm run blog:image -- --missing"
      );
      process.exit(1);
    }
    targets = [slug];
  }

  console.log(`Processing ${targets.length} post(s)…`);

  for (const slug of targets) {
    try {
      await processPost(slug);
    } catch (err) {
      console.error(`[${slug}] Failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
