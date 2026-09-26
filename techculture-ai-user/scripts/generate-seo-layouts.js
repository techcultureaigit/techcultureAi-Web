const fs = require("fs");
const path = require("path");

const root = path.join(
  "D:",
  "techCulture",
  "techCultureAiManojSir",
  "techculture-ai-user",
  "src",
  "app",
);

const routes = [
  ["about", "about"],
  ["team", "team"],
  ["contact", "contact"],
  ["careers", "careers"],
  ["careers/openings", "careers-openings"],
  ["blog", "blog"],
  ["products", "products"],
  ["fintech", "fintech"],
  ["middleware", "middleware"],
  ["banking-fintech", "banking-fintech"],
  ["ecommerce", "ecommerce"],
  ["corporate-websites", "corporate-websites"],
  ["mobile-applications", "mobile-applications"],
  ["custom-saas", "custom-saas"],
  ["hrms", "hrms"],
  ["gis", "gis"],
  ["lms", "lms"],
  ["mutual-fund", "mutual-fund"],
  ["trading-applications", "trading-applications"],
  ["tracking", "tracking"],
  ["our-workspace", "our-workspace"],
];

for (const [dir, key] of routes) {
  const file = path.join(root, dir, "layout.js");
  const content = `import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("${key}");

export default function Layout({ children }) {
  return children;
}
`;
  fs.writeFileSync(file, content);
  console.log("wrote", dir);
}
