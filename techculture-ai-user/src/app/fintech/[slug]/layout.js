import { getProductBySlug } from "@/lib/webdevelopment/catalog";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getProductBySlug(slug);

  if (!page) {
    return buildPageMetadata({
      title: "Product not found",
      description:
        "This fintech product page does not exist. Browse all TechCulture AI fintech products.",
      path: `/fintech/${slug}`,
      keywords: ["fintech", "product"],
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: page.title,
    description: page.summary || page.about,
    path: `/fintech/${slug}`,
    keywords: [page.title, "fintech", "KYC", "TechCulture products"],
  });
}

export default function FintechSlugLayout({ children }) {
  return children;
}
