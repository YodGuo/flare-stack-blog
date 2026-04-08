import { z } from "zod";
import { blogConfig } from "@/blog.config";
import {
  createSiteConfigInputFormSchema,
  type SiteConfigInput,
  SiteConfigInputSchema,
} from "@/features/config/site-config.schema";
import { webhookEndpointSchema } from "@/features/webhook/webhook.schema";
import type { Messages } from "@/lib/i18n";

export const SystemConfigSchema = z.object({
  email: z
    .object({
      apiKey: z.string().optional(),
      host: z.string().optional(),
      port: z.number().int().positive().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
      senderName: z.string().optional(),
      senderAddress: z.union([z.email(), z.literal("")]).optional(),
    })
    .optional(),
  notification: z
    .object({
      admin: z
        .object({
          channels: z
            .object({
              email: z.boolean().optional(),
              webhook: z.boolean().optional(),
            })
            .optional(),
        })
        .optional(),
      user: z
        .object({
          emailEnabled: z.boolean().optional(),
        })
        .optional(),
      webhooks: z.array(webhookEndpointSchema).optional(),
    })
    .optional(),
  site: SiteConfigInputSchema.optional(),
  b2bPages: z
    .object({
      homeTitle: z.string().optional(),
      homeDescription: z.string().optional(),
      productsTitle: z.string().optional(),
      productsDescription: z.string().optional(),
      newsTitle: z.string().optional(),
      newsDescription: z.string().optional(),
      aboutTitle: z.string().optional(),
      aboutDescription: z.string().optional(),
    })
    .optional(),
});

export const createSystemConfigFormSchema = (messages: Messages) =>
  z.object({
    email: SystemConfigSchema.shape.email,
    notification: SystemConfigSchema.shape.notification,
    site: createSiteConfigInputFormSchema(messages).optional(),
    b2bPages: SystemConfigSchema.shape.b2bPages,
  });

export type SystemConfig = z.infer<typeof SystemConfigSchema>;
export type {
  SiteConfig,
  SiteConfigInput,
} from "@/features/config/site-config.schema";

export const DEFAULT_CONFIG: SystemConfig = {
  email: {
    host: "",
    port: 465,
    username: "",
    password: "",
    senderName: "",
    senderAddress: "",
  },
  notification: {
    admin: {
      channels: {
        email: true,
        webhook: true,
      },
    },
    user: {
      emailEnabled: true,
    },
    webhooks: [],
  },
  site: blogConfig satisfies SiteConfigInput,
  b2bPages: {
    homeTitle: "帮你搭建可持续获客的 B2B 独立站",
    homeDescription:
      "这个站点已从博客首页升级为 B2B 增长门户：你可以用它做品牌展示、发布行业内容、获取高质量询盘，并通过数据看板持续优化转化。",
    productsTitle: "产品中心",
    productsDescription:
      "基于当前项目可快速交付以下 B2B 独立站能力模块，你可以按业务阶段逐步启用。",
    newsTitle: "新闻中心",
    newsDescription: "这里汇总了最近发布的行业洞察与产品内容。",
    aboutTitle: "关于我们",
    aboutDescription:
      "我们专注于帮助制造业、软件与专业服务企业搭建 B2B 独立站，让官网从“线上名片”进化为“增长资产”。",
  },
};

export const CONFIG_CACHE_KEYS = {
  system: ["system"] as const,
} as const;
