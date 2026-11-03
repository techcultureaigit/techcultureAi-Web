import { redirect } from "next/navigation";
import { SECTION_ROUTES, type Section } from "@/lib/routes";

type SearchParams = Promise<{ section?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requested = params.section as Section | undefined;
  // Client auth guard lives in AppShell; land on login first for fresh visits.
  if (requested && SECTION_ROUTES[requested]) {
    redirect(SECTION_ROUTES[requested]);
  }
  redirect("/login");
}
