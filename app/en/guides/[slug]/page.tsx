import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { englishGuides, getEnglishGuide } from "@/lib/guides-en";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/guides/Guides.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return englishGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getEnglishGuide((await params).slug);
  if (!guide) notFound();
  return pageMetadata({ locale: "en", koPath: `/guides/${guide.slug}`, title: guide.title, description: guide.description, ogType: "article" });
}

export default async function EnglishGuidePage({ params }: Props) {
  const guide = getEnglishGuide((await params).slug);
  if (!guide) notFound();
  return <main className={styles.page}><div className={styles.column}><nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/en">Home</Link><span aria-hidden="true">/</span><Link href="/en/guides">Guides</Link><span aria-hidden="true">/</span><span aria-current="page">{guide.title}</span></nav><article><header className={styles.header}><p className={styles.eyebrow}>DIGITAL LEGACY GUIDE</p><h1>{guide.title}</h1><div className={styles.meta}><span>Korea-focused general guidance</span></div></header><p className={styles.lead}>{guide.lead}</p><div className={styles.prose}>{guide.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>)}<h2>Official sources and next steps</h2><ul>{guide.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul><p>Requirements can change and may depend on the request and applicant. Confirm the current conditions with the company before applying.</p></div></article><aside className={styles.cta}><h2>Continue with a service guide</h2><p>Browse company instructions and review the official request route.</p><Link href="/en/services">Browse services</Link></aside><p><Link href="/en/guides">Back to guides</Link></p></div></main>;
}
