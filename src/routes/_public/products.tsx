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
      title: `${config.b2bPages?.productsTitle ?? m.b2b_products_title()}｜B2B`,
      description: config.b2bPages?.productsDescription
        ? config.b2bPages.productsDescription
        : m.b2b_products_description(),
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
        {pageCopy?.productsTitle || m.b2b_products_title()}
      </h1>
      <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">
        {pageCopy?.productsDescription || m.b2b_products_description()}
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
            <div className="mt-3">
              <Link
                to="/inquiry"
                search={{ product: product.title }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                立即询价
              </Link>
            </div>
          </article>
        ))}
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-5 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {m.b2b_products_empty()}
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
              : m.b2b_products_load_more()}
          </button>
        </div>
      ) : null}
    </main>
  );
}
