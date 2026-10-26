import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";

export type GuideFaq = { question: string; answer: string };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  faq: GuideFaq[];
  body: string;
  lead: string;
};

type TextNode = { type: string; value?: string; children?: TextNode[] };
export function plainText(node: TextNode): string {
  return node.value ?? node.children?.map(plainText).join("") ?? "";
}

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Guide ${field} must be a non-empty string`);
  return value.trim();
}

function date(value: unknown, field: string): string {
  const result = text(value, field);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result) {
    throw new Error(`Guide ${field} must be a valid YYYY-MM-DD string (quote YAML dates)`);
  }
  return result;
}

export function parseGuide(source: string, slug: string): Guide {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid guide slug: ${slug}`);
  const { data, content } = matter(source);
  if (data.draft !== undefined && typeof data.draft !== "boolean") throw new Error(`Guide ${slug}: draft must be a boolean`);
  if (data.tags !== undefined && !Array.isArray(data.tags)) throw new Error(`Guide ${slug}: tags must be an array`);
  if (data.faq !== undefined && !Array.isArray(data.faq)) throw new Error(`Guide ${slug}: faq must be an array`);
  const tree = remark().parse(content);
  if (tree.children.some((node) => node.type === "heading" && node.depth === 1)) throw new Error(`Guide ${slug}: use H2/H3, the page supplies H1`);
  const first = tree.children[0];
  if (!first || first.type !== "paragraph") throw new Error(`Guide ${slug}: start with a direct-answer paragraph`);
  const published = date(data.date, "date");
  const updated = data.updated === undefined ? undefined : date(data.updated, "updated");
  if (updated && updated < published) throw new Error(`Guide ${slug}: updated cannot precede date`);
  return {
    slug,
    title: text(data.title, "title"),
    description: text(data.description, "description"),
    date: published,
    updated,
    tags: (data.tags ?? []).map((tag: unknown) => text(tag, "tag")),
    draft: data.draft ?? false,
    faq: (data.faq ?? []).map((entry: unknown) => {
      if (!entry || typeof entry !== "object") throw new Error(`Guide ${slug}: invalid FAQ`);
      const item = entry as Record<string, unknown>;
      return { question: text(item.question, "faq.question"), answer: text(item.answer, "faq.answer") };
    }),
    body: content.slice(first.position?.end.offset ?? 0).trim(),
    lead: plainText(first),
  };
}

/** The same publication gate is used by routes, related links, sitemap and llms.txt. */
export function getPublishedGuides(): Guide[] {
  const directory = path.join(process.cwd(), "content/guides");
  return fs.readdirSync(directory).filter((name) => name.endsWith(".md")).map((name) =>
    parseGuide(fs.readFileSync(path.join(directory, name), "utf8"), name.slice(0, -3)),
  ).filter((guide) => !guide.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPublishedGuide(slug: string): Guide | undefined {
  // Never interpolate a request slug into a filesystem path.
  return getPublishedGuides().find((guide) => guide.slug === slug);
}

export function getRelatedGuides(guide: Guide): Guide[] {
  const score = (item: Guide) => item.tags.filter((tag) => guide.tags.includes(tag)).length;
  return getPublishedGuides().filter((item) => item.slug !== guide.slug)
    .sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)).slice(0, 3);
}

export function getGuideIndexUpdated(guides: Guide[]): string {
  return guides.reduce((latest, guide) => (guide.updated ?? guide.date) > latest ? (guide.updated ?? guide.date) : latest, "2026-10-26");
}

type MarkdownTree = ReturnType<ReturnType<typeof remark>["parse"]>;

/** One heading algorithm for the table of contents and rendered Markdown, including duplicates. */
export function assignGuideHeadingIds(tree: MarkdownTree) {
  const used = new Set<string>(["guide-faq", "guide-related", "guide-faq-title", "guide-related-title"]);
  const headings: { id: string; title: string; depth: number }[] = [];
  for (const node of tree.children) {
    if (node.type !== "heading") continue;
    const title = plainText(node);
    const base = title.toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section";
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
    if (node.depth === 2 || node.depth === 3) headings.push({ id, title, depth: node.depth });
  }
  return headings;
}

export function guideHeadings() {
  return (tree: MarkdownTree) => { assignGuideHeadingIds(tree); };
}

export function getGuideHeadings(body: string) {
  return assignGuideHeadingIds(remark().parse(body));
}
