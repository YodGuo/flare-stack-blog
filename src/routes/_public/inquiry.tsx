import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteDomainQuery } from "@/features/config/queries";
import { submitInquiryFn } from "@/features/inquiries/api/inquiries.api";
import {
  type SubmitInquiryInput,
  SubmitInquiryInputSchema,
} from "@/features/inquiries/inquiries.schema";
import { buildCanonicalUrl, canonicalLink } from "@/lib/seo";

const InquirySearchSchema = z.object({
  product: z.string().optional(),
});

export const Route = createFileRoute("/_public/inquiry")({
  validateSearch: InquirySearchSchema,
  loaderDeps: ({ search }) => ({ product: search.product }),
  loader: async ({ context, deps }) => {
    const domain = await context.queryClient.ensureQueryData(siteDomainQuery);

    return {
      title: "询价",
      description: deps.product
        ? `针对 ${deps.product} 的询价表单`
        : "提交询价需求，我们会尽快联系你。",
      canonicalHref: buildCanonicalUrl(domain, "/inquiry", {
        product: deps.product,
      }),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: "description", content: loaderData?.description },
    ],
    links: [canonicalLink(loaderData?.canonicalHref ?? "/inquiry")],
  }),
  component: InquiryPage,
});

function InquiryPage() {
  const { product } = useSearch({ from: "/_public/inquiry" });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SubmitInquiryInput>({
    resolver: zodResolver(SubmitInquiryInputSchema),
    defaultValues: {
      productName: product ?? "",
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      quantity: "",
      message: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await submitInquiryFn({ data: values });
      toast.success("询价提交成功", {
        description: "我们会在 1 个工作日内联系你。",
      });
      form.reset({
        ...values,
        quantity: "",
        message: "",
      });
    } catch {
      toast.error("询价提交失败", {
        description: "请稍后重试或通过邮箱联系我们。",
      });
    } finally {
      setSubmitting(false);
    }
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8 md:px-10 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-100">
        询价
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-300">
        提交你的需求，我们会尽快给出方案与报价。
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input placeholder="公司名称" {...register("companyName")} />
        {errors.companyName ? (
          <p className="text-sm text-red-500">{errors.companyName.message}</p>
        ) : null}

        <Input placeholder="联系人" {...register("contactName")} />
        {errors.contactName ? (
          <p className="text-sm text-red-500">{errors.contactName.message}</p>
        ) : null}

        <Input placeholder="邮箱" type="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        ) : null}

        <Input placeholder="电话（选填）" {...register("phone")} />
        <Input placeholder="意向产品（选填）" {...register("productName")} />
        <Input placeholder="采购数量（选填）" {...register("quantity")} />
        <Textarea
          placeholder="详细需求（选填）"
          rows={6}
          {...register("message")}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "提交中..." : "提交询价"}
        </Button>
      </form>
    </main>
  );
}
