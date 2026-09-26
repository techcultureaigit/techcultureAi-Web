import { fetchBlogBySlug } from "@/lib/blogApi";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchBlogBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Article not found",
      description: "This blog article could not be found on TechCulture AI.",
      path: `/blog/${slug}`,
      keywords: ["blog"],
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.title || "Blog Article",
    description:
      post.excerpt ||
      post.description ||
      post.metaDescription ||
      "Insights from TechCulture AI on fintech, KYC and digital products.",
    path: `/blog/${slug}`,
    keywords: [
      ...(Array.isArray(post.tags) ? post.tags : []),
      "blog",
      "insights",
    ],
    type: "article",
  });
}

export default function BlogSlugLayout({ children }) {
  return children;
}
