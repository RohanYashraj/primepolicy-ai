import fs from "fs";
import path from "path";

const docsDirectory = path.join(process.cwd(), "Docs");

export interface DocMeta {
  slug: string;
  title: string;
  isIndex: boolean;
}

export function getDocsList(): DocMeta[] {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(docsDirectory);
  const docs = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      
      // Basic title formatting
      let title = slug.replace(/_/g, " ").trim();
      // Remove leading numbers
      title = title.replace(/^\d+\s+/, "");
      // Convert to Title Case
      title = title.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
      
      // Better title for index
      if (slug === "index") {
        title = "Overview";
      }

      return {
        slug,
        title,
        isIndex: slug === "index",
      };
    });

  // Sort: index goes first, then alphabetically (which works for numbered files)
  return docs.sort((a, b) => {
    if (a.isIndex) return -1;
    if (b.isIndex) return 1;
    return a.slug.localeCompare(b.slug);
  });
}

export function getDocContent(slug: string): string | null {
  const fullPath = path.join(docsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}
