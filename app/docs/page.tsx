import { getDocContent } from "@/lib/docs";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { notFound } from "next/navigation";

export default function DocsIndexPage() {
  const content = getDocContent("index");

  if (!content) {
    // If there is no index.md, we could redirect or show a 404
    notFound();
  }

  return (
    <article className="w-full h-full animate-in fade-in duration-500">
      <MarkdownRenderer content={content} />
    </article>
  );
}
