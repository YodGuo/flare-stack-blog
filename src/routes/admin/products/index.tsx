import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { postsInfiniteQueryOptions } from "@/features/posts/queries";
import { formatDate } from "@/lib/utils";

const PRODUCT_TAG = "产品";
const PAGE_SIZE = 20;

export const Route = createFileRoute("/admin/products/")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchInfiniteQuery(
      postsInfiniteQueryOptions({
        tagName: PRODUCT_TAG,
        limit: PAGE_SIZE,
      }),
    );

    return {
      title: "产品管理",
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title }],
  }),
  component: ProductsAdminPage,
});

function ProductsAdminPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({
        tagName: PRODUCT_TAG,
        limit: PAGE_SIZE,
      }),
    );

  const products = data.pages.flatMap((page) => page.items);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">产品管理</h1>
          <p className="text-sm text-muted-foreground">
            当前展示已发布且带“产品”标签的内容，可快速进入编辑。
          </p>
        </div>
        <Link
          to="/admin/posts"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          去文章管理创建产品
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-border bg-background p-4"
          >
            <p className="text-xs text-muted-foreground">
              发布于 {formatDate(product.createdAt)}
            </p>
            <h2 className="mt-1 line-clamp-2 text-base font-semibold">
              {product.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {product.summary}
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <Link
                to="/admin/posts/edit/$id"
                params={{ id: String(product.id) }}
                className="text-blue-600 hover:text-blue-500"
              >
                编辑
              </Link>
              <Link
                to="/post/$slug"
                params={{ slug: product.slug }}
                className="text-muted-foreground hover:text-foreground"
              >
                预览
              </Link>
              <Link
                to="/inquiry"
                search={{ product: product.title }}
                className="text-emerald-600 hover:text-emerald-500"
              >
                询价页
              </Link>
            </div>
          </article>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          暂无产品内容。请先在文章管理中创建并发布带“产品”标签的文章。
        </p>
      ) : null}

      {hasNextPage ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            {isFetchingNextPage ? "加载中..." : "加载更多"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
