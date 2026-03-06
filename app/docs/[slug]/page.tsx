import { getDocContent, getDocsList } from "@/lib/docs";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const docsList = getDocsList();
  return docsList
    .filter((doc) => !doc.isIndex) // index is handled by app/docs/page.tsx
    .map((doc) => ({
      slug: doc.slug,
    }));
}

export default async function DocPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const content = getDocContent(params.slug);

  if (!content) {
    notFound();
  }

  return (
    <article className="w-full h-full animate-in fade-in duration-500">
      <MarkdownRenderer content={content} />
    </article>
  );
}
