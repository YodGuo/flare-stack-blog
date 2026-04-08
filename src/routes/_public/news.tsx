import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { siteDomainQuery, systemConfigQuery } from "@/features/config/queries";
import { postsInfiniteQueryOptions } from "@/features/posts/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";

const NEWS_LIMIT = 12;
const NEWS_TAG = "新闻";

export const Route = createFileRoute("/_public/news")({
  loader: async ({ context }) => {
    const [domain, config] = await Promise.all([
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(systemConfigQuery),
      context.queryClient.prefetchInfiniteQuery(
        postsInfiniteQueryOptions({ tagName: NEWS_TAG, limit: NEWS_LIMIT }),
      ),
    ]);

    return {
      title: `${config.b2bPages?.newsTitle ?? m.b2b_news_title()}｜B2B`,
      description: config.b2bPages?.newsDescription
        ? config.b2bPages.newsDescription
        : m.b2b_news_description(),
      canonicalHref: buildCanonicalUrl(domain, "/news"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: "description", content: loaderData?.description },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/news")],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({ tagName: NEWS_TAG, limit: NEWS_LIMIT }),
    );
  const { data: config } = useSuspenseQuery(systemConfigQuery);
  const pageCopy = config.b2bPages;
  const posts = useMemo(
    () => data.pages.flatMap((page) => page.items),
    [data.pages],
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
        {pageCopy?.newsTitle || m.b2b_news_title()}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-300">
        {pageCopy?.newsDescription || m.b2b_news_description()}
      </p>

      <section className="mt-8 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(post.createdAt)}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <Link to="/post/$slug" params={{ slug: post.slug }}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {post.summary}
            </p>
          </article>
        ))}
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-5 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {m.b2b_news_empty()}
          </p>
        ) : null}
      </section>

      {hasNextPage ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-200"
          >
            {isFetchingNextPage
              ? m.b2b_common_loading()
              : m.b2b_news_load_more()}
          </button>
        </div>
      ) : null}
    </main>
  );
}
