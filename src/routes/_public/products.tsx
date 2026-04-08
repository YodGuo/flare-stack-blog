import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { siteDomainQuery, systemConfigQuery } from "@/features/config/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";

const productMatrix = [
  {
    title: "企业官网系统",
    description:
      "支持多语言、品牌展示、产品目录与案例库，适合出海企业统一品牌阵地。",
    highlight: "品牌信任建设",
  },
  {
    title: "内容营销引擎",
    description: "复用当前博客能力进行行业内容运营，提升自然流量与搜索排名。",
    highlight: "持续 SEO 增长",
  },
  {
    title: "询盘转化组件",
    description:
      "可扩展接入询盘表单、预约演示与线索打标流程，支撑销售漏斗管理。",
    highlight: "线索高效沉淀",
  },
];

export const Route = createFileRoute("/_public/products")({
  loader: async ({ context }) => {
    const [domain, config] = await Promise.all([
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(systemConfigQuery),
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
  const pageCopy = config.b2bPages;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
        {pageCopy?.productsTitle || "产品中心"}
      </h1>
      <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-300">
        {pageCopy?.productsDescription ||
          "基于当前项目可快速交付以下 B2B 独立站能力模块，你可以按业务阶段逐步启用。"}
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {productMatrix.map((product) => (
          <article
            key={product.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {product.highlight}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {product.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {product.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
