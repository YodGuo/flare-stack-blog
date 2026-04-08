import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/features/config/components/site-settings-fields";
import type { SystemConfig } from "@/features/config/config.schema";

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border/30 bg-background/50 overflow-hidden">
      <div className="p-8 space-y-2 border-b border-border/20">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-8 grid gap-8 md:grid-cols-2">{children}</div>
    </section>
  );
}

export function B2BPagesSettingsSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SystemConfig>();

  const getInputClassName = (error?: string) =>
    error ? "border-destructive focus-visible:border-destructive" : undefined;

  return (
    <SectionShell
      title="B2B 页面内容"
      description="管理首页、产品、新闻、关于页的主标题与描述文案。"
    >
      <Field
        label="首页标题"
        error={errors.b2bPages?.homeTitle?.message}
        hint="显示在首页 Hero 主标题。"
      >
        <Input
          {...register("b2bPages.homeTitle")}
          className={getInputClassName(errors.b2bPages?.homeTitle?.message)}
          placeholder="帮你搭建可持续获客的 B2B 独立站"
        />
      </Field>

      <Field label="首页描述" error={errors.b2bPages?.homeDescription?.message}>
        <Textarea
          {...register("b2bPages.homeDescription")}
          className={getInputClassName(
            errors.b2bPages?.homeDescription?.message,
          )}
          placeholder="描述首页核心价值"
        />
      </Field>

      <Field label="产品页标题" error={errors.b2bPages?.productsTitle?.message}>
        <Input
          {...register("b2bPages.productsTitle")}
          className={getInputClassName(errors.b2bPages?.productsTitle?.message)}
          placeholder="产品中心"
        />
      </Field>

      <Field
        label="产品页描述"
        error={errors.b2bPages?.productsDescription?.message}
      >
        <Textarea
          {...register("b2bPages.productsDescription")}
          className={getInputClassName(
            errors.b2bPages?.productsDescription?.message,
          )}
          placeholder="介绍产品页内容"
        />
      </Field>

      <Field label="新闻页标题" error={errors.b2bPages?.newsTitle?.message}>
        <Input
          {...register("b2bPages.newsTitle")}
          className={getInputClassName(errors.b2bPages?.newsTitle?.message)}
          placeholder="新闻中心"
        />
      </Field>

      <Field
        label="新闻页描述"
        error={errors.b2bPages?.newsDescription?.message}
      >
        <Textarea
          {...register("b2bPages.newsDescription")}
          className={getInputClassName(
            errors.b2bPages?.newsDescription?.message,
          )}
          placeholder="介绍新闻页内容"
        />
      </Field>

      <Field label="关于页标题" error={errors.b2bPages?.aboutTitle?.message}>
        <Input
          {...register("b2bPages.aboutTitle")}
          className={getInputClassName(errors.b2bPages?.aboutTitle?.message)}
          placeholder="关于我们"
        />
      </Field>

      <Field
        label="关于页描述"
        error={errors.b2bPages?.aboutDescription?.message}
      >
        <Textarea
          {...register("b2bPages.aboutDescription")}
          className={getInputClassName(
            errors.b2bPages?.aboutDescription?.message,
          )}
          placeholder="介绍公司和团队"
        />
      </Field>
    </SectionShell>
  );
}
