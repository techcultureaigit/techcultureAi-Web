import { getProductBySlug } from "@/lib/webdevelopment/catalog";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getProductBySlug(slug);

  if (!page) {
    return buildPageMetadata({
      title: "Product",
      description: "TechCulture AI product details.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: page.title,
    description: page.summary || page.about,
    path: `/products/${slug}`,
    keywords: [page.title, "products"],
  });
}

export default function ProductSlugLayout({ children }) {
  return children;
}
