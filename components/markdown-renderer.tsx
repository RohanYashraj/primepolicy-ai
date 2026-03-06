"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Mermaid } from "./mermaid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MarkdownRenderer({ content }: { content: string }) {
  const pathname = usePathname();

  return (
    <div className="max-w-4xl mx-auto py-8 prose prose-neutral dark:prose-invert prose-pre:bg-muted/50 prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-code:text-foreground prose-headings:font-mono prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-md prose-img:border prose-img:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");

            // Render Mermaid diagrams
            if (!inline && match && match[1] === "mermaid") {
              return <Mermaid chart={String(children).replace(/\n$/, "")} />;
            }

            // Normal code blocks
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children, ...props }) {
            // Handle internal links in Docs (like `01_agent_orchestrator_.md`)
            if (href && href.endsWith(".md") && !href.startsWith("http")) {
              const slug = href.replace(/\.md$/, "");
              return (
                <Link
                  href={`/docs/${slug}`}
                  className="text-primary hover:underline font-medium"
                >
                  {children}
                </Link>
              );
            }
            // External or hash links
            return (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
