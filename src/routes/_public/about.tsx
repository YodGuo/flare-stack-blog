import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { siteDomainQuery, systemConfigQuery } from "@/features/config/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";

const values = [
  "以业务结果为导向：关注询盘量、成交率与获客成本，而非单纯页面数量。",
  "以内容驱动增长：通过行业洞察和案例资产，让独立站长期产生自然流量。",
  "以可扩展架构交付：支持后续接入 CRM、营销自动化、客户门户等系统。",
];

export const Route = createFileRoute("/_public/about")({
  loader: async ({ context }) => {
    const [domain, config] = await Promise.all([
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(systemConfigQuery),
    ]);

    return {
      title: `${config.b2bPages?.aboutTitle ?? "关于我们"}｜B2B 增长团队`,
      description: config.b2bPages?.aboutDescription
        ? config.b2bPages.aboutDescription
        : "了解我们的 B2B 独立站方法论与交付原则。",
      canonicalHref: buildCanonicalUrl(domain, "/about"),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: "description", content: loaderData?.description },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/about")],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: config } = useSuspenseQuery(systemConfigQuery);
  const pageCopy = config.b2bPages;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 md:px-10 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
        {pageCopy?.aboutTitle || "关于我们"}
      </h1>
      <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">
        {pageCopy?.aboutDescription ||
          "我们专注于帮助制造业、软件与专业服务企业搭建 B2B 独立站，让官网从“线上名片”进化为“增长资产”。"}
      </p>

      <section className="mt-8 space-y-3">
        {values.map((value) => (
          <p
            key={value}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {value}
          </p>
        ))}
      </section>
    </main>
  );
}
