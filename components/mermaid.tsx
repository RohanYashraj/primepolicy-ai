"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

export function Mermaid({ chart }: { chart: string }) {
  const [svgStr, setSvgStr] = useState<string>("");
  const { theme } = useTheme();

  const mermaidId = useRef(
    `mermaid-${Math.random().toString(36).substring(2)}`,
  );

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-mono, monospace)",
    });

    const renderChart = async () => {
      try {
        // Sanitize the chart by replacing newlines inside labels with spaces
        // Mermaid parses newlines poorly inside node labels like `A["Text\n"]` or `B[Text\n]`
        const sanitizedChart = chart
          .replace(/"([^"]*)"/g, (match, p1) => `"${p1.replace(/\n/g, " ")}"`)
          .replace(/\[([^\]]*)\]/g, (match, p1) => `[${p1.replace(/\n/g, " ")}]`)
          .replace(/\(([^)]*)\)/g, (match, p1) => `(${p1.replace(/\n/g, " ")})`);

        const { svg } = await mermaid.render(mermaidId.current, sanitizedChart);
        setSvgStr(svg);
      } catch (error) {
        console.error("Mermaid parsing error", error);
      }
    };

    renderChart();
  }, [chart, theme]);

  return (
    <div
      className="my-8 flex justify-center bg-card/30 border border-border rounded-lg p-6 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svgStr || "Loading diagram..." }}
    />
  );
}
