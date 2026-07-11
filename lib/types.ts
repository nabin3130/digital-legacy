export type SupportStatus = "yes" | "no" | "partial" | "unknown";

export interface CompanyPolicy {
  id: string;
  slug: string;
  company: string;
  platform: string;
  category: string;
  summary: string;
  philosophy: string;
  preDeathPlanning: SupportStatus;
  accountDeletion: SupportStatus;
  memorialAccount: SupportStatus;
  dataDownload: SupportStatus;
  familyAccess: SupportStatus;
  courtOrder: SupportStatus;
  requiredDocs: string[];
  available: string[];
  unavailable: string[];
  limitations: string[];
  officialLinks: { label: string; url?: string }[];
  lastUpdated: string;
}
