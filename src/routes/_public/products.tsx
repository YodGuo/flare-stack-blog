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

const PRODUCT_TAG = "产品";
const PRODUCT_LIMIT = 12;

export const Route = createFileRoute("/_public/products")({
  loader: async ({ context }) => {
    const [domain, config] = await Promise.all([
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(systemConfigQuery),
      context.queryClient.prefetchInfiniteQuery(
        postsInfiniteQueryOptions({
          tagName: PRODUCT_TAG,
          limit: PRODUCT_LIMIT,
        }),
      ),
    ]);

    return {
      title: `${config.b2bPages?.productsTitle ?? "产品中心"}｜B2B 独立站能力`,
      description: config.b2bPages?.productsDescription
        ? config.b2bPages.productsDescription
        : "查看 B2B 独立站产品能力：官网、内容营销、询盘转化与数据增长。",
      canonicalHref: buildCanonicalUrl(domain, "/products"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: "description", content: loaderData?.description },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/products")],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: config } = useSuspenseQuery(systemConfigQuery);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({
        tagName: PRODUCT_TAG,
        limit: PRODUCT_LIMIT,
      }),
    );
  const pageCopy = config.b2bPages;
  const products = useMemo(
    () => data.pages.flatMap((page) => page.items),
    [data.pages],
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
        {pageCopy?.productsTitle || "产品中心"}
      </h1>
      <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">
        {pageCopy?.productsDescription ||
          "基于当前项目可快速交付以下 B2B 独立站能力模块，你可以按业务阶段逐步启用。"}
      </p>

      <section className="mt-8 space-y-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(product.createdAt)}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <Link to="/post/$slug" params={{ slug: product.slug }}>
                {product.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          </article>
        ))}
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-5 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            暂无已上架产品。请在后台发布文章并添加“产品”标签后展示在这里。
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
            {isFetchingNextPage ? "加载中..." : "加载更多产品"}
          </button>
        </div>
      ) : null}
    </main>
  );
}
