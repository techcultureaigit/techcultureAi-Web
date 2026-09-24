"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Share2,
} from "lucide-react";
import { fetchBlogBySlug, fetchPublishedBlogs } from "@/lib/blogApi";

function formatDate(value) {
  if (!value) return "TechCulture Insights";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function renderInline(text) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return tokens.map((token, index) => {
    const boldMatch = token.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return <strong key={`${token}-${index}`}>{boldMatch[1]}</strong>;
    }

    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <Link
          key={`${token}-${index}`}
          href={linkMatch[2]}
          className="font-semibold text-[#FE602F] underline decoration-orange-200 underline-offset-4 hover:text-[#d9471b]"
        >
          {linkMatch[1]}
        </Link>
      );
    }

    return token;
  });
}

function looksLikeHtml(content = "") {
  return /<\/?[a-z][\s\S]*>/i.test(String(content).trim());
}

function HtmlArticle({ content }) {
  return (
    <div
      className="blog-html-content space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8 [&_a]:font-semibold [&_a]:text-[#FE602F] [&_a]:underline [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#FE602F] [&_blockquote]:bg-[#fff7f4] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-[#2E3545] [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-[#2E3545] [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#2E3545] [&_h3]:pt-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#2E3545] [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: content || "" }}
    />
  );
}

function ArticleBody({ content, contentFormat }) {
  const html =
    contentFormat === "html" ||
    (contentFormat !== "markdown" && looksLikeHtml(content));

  if (html) return <HtmlArticle content={content} />;
  return <MarkdownArticle content={content || ""} />;
}

function MarkdownArticle({ content }) {
  const lines = String(content || "").split("\n");

  return (
    <div className="space-y-5 text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
      {lines.map((line, index) => {
        const value = line.trim();
        if (!value) return null;

        if (value.startsWith("# ")) return null;
        if (value.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="pt-6 text-2xl font-semibold tracking-tight text-[#2E3545] sm:text-3xl"
            >
              {renderInline(value.slice(3))}
            </h2>
          );
        }
        if (value.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-4 text-xl font-semibold text-[#2E3545]">
              {renderInline(value.slice(4))}
            </h3>
          );
        }
        if (value.startsWith("- ")) {
          return (
            <div key={index} className="flex gap-3 pl-2">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FE602F]" />
              <p>{renderInline(value.slice(2))}</p>
            </div>
          );
        }
        if (/^\d+\.\s/.test(value)) {
          const [, number, body] = value.match(/^(\d+)\.\s(.+)$/) || [];
          return (
            <div key={index} className="flex gap-3 pl-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff0eb] text-xs font-bold text-[#FE602F]">
                {number}
              </span>
              <p>{renderInline(body)}</p>
            </div>
          );
        }
        if (value.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="rounded-r-2xl border-l-4 border-[#FE602F] bg-[#fff7f4] px-5 py-4 italic text-[#2E3545]"
            >
              {renderInline(value.slice(2))}
            </blockquote>
          );
        }

        return <p key={index}>{renderInline(value)}</p>;
      })}
    </div>
  );
}

export default function BlogArticlePage() {
  const params = useParams();
  const reduceMotion = useReducedMotion();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const post = await fetchBlogBySlug(slug);
        if (cancelled) return;

        if (!post) {
          setArticle(null);
          setRelatedArticles([]);
          setNotFound(true);
          return;
        }

        setArticle(post);

        const { posts } = await fetchPublishedBlogs();
        if (cancelled) return;

        const related = posts
          .filter(
            (item) =>
              item.slug !== post.slug &&
              (item.vertical === post.vertical ||
                item.tags?.some((tag) => post.tags?.includes(tag)))
          )
          .slice(0, 3);
        setRelatedArticles(related);
      } catch {
        if (!cancelled) {
          setArticle(null);
          setRelatedArticles([]);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-[#fdfcfb] px-5 text-center">
        <p className="text-sm text-slate-500">Loading article…</p>
      </section>
    );
  }

  if (notFound || !article) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#fdfcfb] px-5 text-center">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#FE602F]">
            Article not found
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-[#2E3545]">
            This insight is not available.
          </h1>
          <Link
            href="/blog"
            className="brand-cta-gradient mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="bg-white text-[#2E3545]">
      <header className="relative isolate overflow-hidden bg-[#fdfcfb] pb-16 pt-10 sm:pb-20 sm:pt-14">
        <div className="absolute -right-40 -top-40 -z-20 h-150 w-150 rounded-full bg-[#FE602F]/13 blur-[120px]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(46,53,69,0.05)_1px,transparent_1px)] bg-size-[26px_26px] opacity-45" />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-5 sm:px-6 lg:px-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#FE602F]"
          >
            <ArrowLeft size={16} />
            Back to all insights
          </Link>

          <div className="mx-auto mt-10 max-w-4xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(article.tags || []).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#fff0eb] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d9471b]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {article.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={15} className="text-[#FE602F]" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={15} className="text-[#FE602F]" />
                {article.readMinutes || 5} min read
              </span>
              <span className="inline-flex items-center gap-2">
                <Share2 size={15} className="text-[#FE602F]" />
                TechCulture AI
              </span>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="relative mx-auto -mt-8 aspect-16/8.5 max-w-6xl overflow-hidden rounded-4xl border-4 border-white bg-slate-100 shadow-[0_28px_75px_rgba(46,53,69,0.2)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#252b38]/20 to-transparent" />
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_240px] lg:py-20">
          <main className="min-w-0">
            <ArticleBody
              content={article.content}
              contentFormat={article.contentFormat}
            />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-orange-100 bg-[#fffaf8] p-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                About the journal
              </span>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Practical perspectives from the TechCulture AI team on secure
                financial technology and digital operations.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#2E3545] hover:text-[#FE602F]"
              >
                Talk to our team
                <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <section className="bg-[#f7f7f8] py-16 sm:py-20">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FE602F]">
                  Keep reading
                </span>
                <h2 className="mt-2 text-3xl font-semibold">Related insights</h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-2 text-sm font-bold sm:flex"
              >
                View all
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relatedArticles.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#FE602F]/30 hover:shadow-lg"
                >
                  <div className="h-40 overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.heroImage}
                      alt={item.heroImageAlt || item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 font-semibold leading-snug transition group-hover:text-[#FE602F]">
                      {item.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold">
                      Read article
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
