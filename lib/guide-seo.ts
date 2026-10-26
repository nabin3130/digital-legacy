import { pageMetadata, absoluteUrl, ogImage } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { Guide } from "@/lib/guides";

export function guideMetadata(path: string, title: string, description: string, guide?: Guide) {
  const metadata = pageMetadata({ locale: "ko", koPath: path, title, description, languages: false, ogType: guide ? "article" : "website" });
  return {
    ...metadata,
    // No English counterpart exists yet; do not inherit the root /en alternate.
    alternates: { canonical: path, languages: { "ko-KR": path } },
    openGraph: {
      ...metadata.openGraph,
      alternateLocale: [],
      ...(guide ? { publishedTime: guide.date, modifiedTime: guide.updated ?? guide.date, tags: guide.tags } : {}),
    },
  };
}

export function guideBreadcrumb(path: string, title?: string) {
  const items = [
    { name: "홈", item: SITE_URL },
    { name: "가이드", item: absoluteUrl("/guides") },
    ...(title ? [{ name: title, item: absoluteUrl(path) }] : []),
  ];
  return { "@type": "BreadcrumbList", "@id": `${absoluteUrl(path)}#breadcrumb`, itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, ...item })) };
}

export function guideStructuredData(guide: Guide) {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": guide.faq.length ? ["WebPage", "FAQPage"] : "WebPage",
        "@id": `${url}#webpage`, url, name: guide.title, description: guide.description, inLanguage: "ko-KR",
        isPartOf: { "@id": `${SITE_URL}/#website` }, breadcrumb: { "@id": `${url}#breadcrumb` },
        ...(guide.faq.length ? { mainEntity: guide.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : {}),
      },
      {
        "@type": "BlogPosting", "@id": `${url}#article`, url, headline: guide.title, description: guide.description,
        abstract: guide.lead, datePublished: guide.date, dateModified: guide.updated ?? guide.date, inLanguage: "ko-KR",
        image: ogImage("ko").url, keywords: guide.tags,
        author: { "@id": `${SITE_URL}/#organization` }, publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      guideBreadcrumb(`/guides/${guide.slug}`, guide.title),
    ],
  };
}

export function guideIndexStructuredData(guides: Guide[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage", "@id": `${absoluteUrl("/guides")}#webpage`, url: absoluteUrl("/guides"),
        name: "디지털 유산 가이드", inLanguage: "ko-KR", isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${absoluteUrl("/guides")}#breadcrumb` },
        mainEntity: { "@type": "ItemList", itemListElement: guides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: absoluteUrl(`/guides/${guide.slug}`) })) },
      },
      guideBreadcrumb("/guides"),
    ],
  };
}

export function serializeGuideJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
