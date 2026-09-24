import { redirect } from "next/navigation";

export default async function ProductSlugRedirectPage({ params }) {
  const { slug } = await params;
  redirect(`/fintech/${slug}`);
}
