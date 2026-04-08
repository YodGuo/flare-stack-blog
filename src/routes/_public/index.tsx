import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { siteDomainQuery, systemConfigQuery } from "@/features/config/queries";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";

const coreCapabilities = [
  {
    title: "品牌官网与产品目录",
    description:
      "为企业提供多语言品牌展示、产品参数库与行业方案页，帮助海外客户快速理解你的业务能力。",
  },
  {
    title: "线索收集与客户分层",
    description:
      "通过询盘表单、下载白皮书和预约演示等动作沉淀线索，并按来源、地区、意向度进行分层。",
  },
  {
    title: "内容营销与 SEO 增长",
    description:
      "延续当前项目的内容系统能力，围绕行业关键词持续发布内容，形成可持续的自然流量。",
  },
  {
    title: "数据看板与转化优化",
    description:
      "基于访问、点击、询盘等行为构建可视化漏斗，持续优化页面与投放策略。",
  },
];

const solutionScenarios = [
  "制造业出海：设备、零部件、OEM/ODM 企业",
  "软件与 SaaS：获客页、演示预约与试用转化",
  "供应链服务：按行业输出标准化解决方案",
  "专业服务公司：案例背书与顾问式销售支持",
];

const implementationSteps = [
  {
    step: "01",
    title: "品牌与定位梳理",
    description: "明确目标市场、客户画像与核心卖点，统一官网信息架构。",
  },
  {
    step: "02",
    title: "页面与内容搭建",
    description: "构建首页、解决方案、案例、博客与联系页面，沉淀专业内容资产。",
  },
  {
    step: "03",
    title: "线索系统接入",
    description: "整合询盘、邮件通知与 CRM 流程，打通从访问到成交的关键环节。",
  },
  {
    step: "04",
    title: "数据驱动迭代",
    description: "通过看板监控渠道效果、关键词排名与询盘质量，持续优化转化率。",
  },
];

export const Route = createFileRoute("/_public/")({
  loader: async ({ context }) => {
    const [domain, config] = await Promise.all([
      context.queryClient.ensureQueryData(siteDomainQuery),
      context.queryClient.ensureQueryData(systemConfigQuery),
    ]);

    return {
      canonicalHref: buildCanonicalUrl(domain, "/"),
      title: `${config.b2bPages?.homeTitle ?? "B2B 独立站解决方案"}｜增长型企业官网`,
      description: config.b2bPages?.homeDescription
        ? config.b2bPages.homeDescription
        : "基于 Flare Stack Blog 快速构建 B2B 独立站，集成品牌展示、内容营销、线索收集与数据分析能力。",
    };
  },
  head: ({ loaderData }) => ({
    links: [canonicalLink(loaderData?.canonicalHref ?? "/")],
    meta: [
      {
        title: loaderData?.title,
      },
      {
        name: "description",
        content: loaderData?.description,
      },
    ],
  }),
  component: B2BHomePage,
});

function B2BHomePage() {
  const { data: config } = useSuspenseQuery(systemConfigQuery);
  const pageCopy = config.b2bPages;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 md:gap-12 md:px-10 md:py-12">
      <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Flare Stack B2B Site
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-100">
          {pageCopy?.homeTitle || "帮你搭建可持续获客的 B2B 独立站"}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 md:text-lg dark:text-zinc-300">
          {pageCopy?.homeDescription ||
            "这个站点已从博客首页升级为 B2B 增长门户：你可以用它做品牌展示、发布行业内容、获取高质量询盘，并通过数据看板持续优化转化。"}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/posts"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            查看内容中心
          </Link>
          <Link
            to="/search"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-400"
          >
            搜索行业方案
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {coreCapabilities.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          适用业务场景
        </h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {solutionScenarios.map((scenario) => (
            <li
              key={scenario}
              className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {scenario}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          4 步上线你的 B2B 独立站
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {implementationSteps.map((item) => (
            <article
              key={item.step}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700"
            >
              <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400">
                STEP {item.step}
              </p>
              <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
