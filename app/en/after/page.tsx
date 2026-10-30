import type { Metadata } from "next";
import ContentHub from "@/components/ContentHub";
import { afterGuidesEn } from "@/lib/hubs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ locale: "en", koPath: "/after", title: "After a death", description: "Find a loved one’s digital accounts, preserve records, and review official request steps." });

export default function AfterPage() {
  return <ContentHub locale="en" label="AFTER A DEATH" title="After a death" intro="You do not need to handle everything at once. Check what records matter, then choose the steps that apply to you." guides={afterGuidesEn} note="Each online service sets its own request process. Check applicant requirements and available options with the company’s official support page." />;
}
