import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { siteDomainQuery } from "@/features/config/queries";
import { recentPostsQuery } from "@/features/posts/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

const NEWS_LIMIT = 12;

export const Route = createFileRoute("/_public/news")({
  loader: async ({ context }) => {
    const [domain] = await Promise.all([
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(recentPostsQuery(NEWS_LIMIT)),
    ]);

    return {
      title: "新闻中心｜行业动态与公司内容",
      description: "查看最新行业动态、公司新闻与实战内容。",
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
  const { data: posts } = useSuspenseQuery(recentPostsQuery(NEWS_LIMIT));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
        新闻中心
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-300">
        这里汇总了最近发布的行业洞察与产品内容。
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
      </section>
    </main>
  );
}
