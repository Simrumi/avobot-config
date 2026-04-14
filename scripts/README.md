# Scripts

## `blog:image` — Generate blog feature images

Uses Google's Nano Banana (`gemini-2.5-flash-image`) to generate a bold editorial illustration for a blog post.

### Setup

1. Get an API key from https://aistudio.google.com/app/apikey
2. Copy `.env.local.example` to `.env.local` and paste your key:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. `.env.local` is gitignored — the key never lands in the repo.

### Usage

```bash
# Generate image for a single post
npm run blog:image what-is-an-ai-agent

# Generate for every post (overwrites existing)
npm run blog:image -- --all

# Only posts that don't have an image yet
npm run blog:image -- --missing
```

### What it does

1. Reads `content/blog/<slug>.md`
2. Builds a prompt from the title, excerpt, and category
3. Calls Nano Banana with the HUSTLR editorial illustration style guide
4. Saves the PNG to `public/blog/<slug>.png`
5. Updates the post's frontmatter with `image: /blog/<slug>.png`

The blog cards and post hero will automatically pick up the image from the frontmatter.
