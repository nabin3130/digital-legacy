export type EnglishGuide = { slug: string; title: string; description: string; lead: string; sections: { heading: string; paragraphs: string[] }[]; sources: { title: string; href: string }[] };

export const englishGuides: EnglishGuide[] = [
  {
    slug: "before-managing-a-deceased-account",
    title: "Before you manage a deceased person’s account",
    description: "Choose what to preserve, decide what you are asking for, and check the service’s official process.",
    lead: "Before handling an account, identify records to preserve and check who may submit a request. Downloading data, deleting an account, and memorializing a profile are separate processes, so do not assume they lead to the same outcome.",
    sections: [
      { heading: "Start with the records that matter", paragraphs: ["List the services that may hold important photos, messages, or documents. Separate records you hope to keep from services you may want to close.", "A digital account or file is not automatically transferred to family in the same way. Account access and the release of specific data are separate questions."] },
      { heading: "Check the service’s process", paragraphs: ["Review the company’s official page for the applicant requirements, request type, documents, and submission route. Keep a copy of the request reference and response.", "Google and Apple publish separate processes for requests involving a deceased person’s account. Their instructions do not give general access to a password or sign-in details."] },
      { heading: "If you are unsure", paragraphs: ["Pause before deletion. First check whether the company offers a data request or memorial option, and whether deletion would affect records you want to preserve.", "LOGOUT does not ask for account passwords or identity documents. Submit sensitive materials only through the official company route when required."] },
    ],
    sources: [
      { title: "Google: requests for a deceased user’s account", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" },
      { title: "Apple: request access to a deceased family member’s account", href: "https://support.apple.com/en-us/102431" },
    ],
  },
  {
    slug: "download-delete-memorial-differences",
    title: "Download, delete, or memorialize: what is the difference?",
    description: "Understand the separate outcomes before you send a request to a service.",
    lead: "A data download, account deletion, and memorial status are different requests. Check what the service can provide, what may remain visible, and whether the action can be reversed before choosing.",
    sections: [
      { heading: "Downloading data", paragraphs: ["A download is a copy of selected information the service makes available. It does not necessarily include every message, file, or account detail, and it may require the account holder to act before access ends.", "For a deceased person’s account, follow the company’s official request process. A family relationship alone does not guarantee sign-in access or a complete copy."] },
      { heading: "Deleting an account", paragraphs: ["Deletion may remove data or make it unavailable. Check the company’s stated timing, any waiting period, and which records can no longer be requested.", "If you are considering both preservation and closure, ask about data availability before requesting deletion."] },
      { heading: "Memorializing a profile", paragraphs: ["Some services can preserve a profile in a memorial state. This does not necessarily let family read private messages or download the account’s data.", "Availability differs by service and region. Read the company’s current instructions and confirm which person can apply."] },
    ],
    sources: [
      { title: "Google: requests for a deceased user’s account", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" },
      { title: "Apple: request access to a deceased family member’s account", href: "https://support.apple.com/en-us/102431" },
    ],
  },
  {
    slug: "how-to-read-official-account-guidance",
    title: "How to read official account guidance",
    description: "Check whose account it is, what is being requested, who may apply, and where to submit documents.",
    lead: "Start by checking whose account is involved, what outcome is requested, and who may apply. Then review the required documents, submission route, location limits, and date on the company’s official page.",
    sections: [
      { heading: "Five points to check", paragraphs: ["Is this a setting on your own account or a request involving someone who has died? Is the request for a copy, deletion, or memorial status? Who is allowed to apply? What documents and submission route are listed? Does the page set a country or service limit?", "The same company may use different forms and requirements for different requests. Check the page that matches your situation."] },
      { heading: "Do not overread a document list", paragraphs: ["A document request for one action does not prove the same document is needed for every service or request. Requirements can depend on the country, the type of request, and who applies.", "If a published page does not answer your question, ask the company’s official support team. Missing public information is not the same as a confirmed refusal."] },
      { heading: "Keep dates distinct", paragraphs: ["An article’s publication or edit date is not the date every company policy was rechecked. Read the company’s own current instructions before submitting a request."] },
    ],
    sources: [
      { title: "Google: requests for a deceased user’s account", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" },
      { title: "Apple: request access to a deceased family member’s account", href: "https://support.apple.com/en-us/102431" },
    ],
  },
  {
    slug: "korea-find-digital-accounts",
    title: "Finding a deceased person’s digital accounts in Korea",
    description: "Use devices, email, and billing records as clues, then check each service’s official request route.",
    lead: "In Korea, you can start with a paper account list, devices, email, and billing records, then check each service’s official process for requests after a death. Do not assume that saved sign-in details mean you may access the account; confirm applicant requirements and available options first.",
    sections: [
      { heading: "Decide what you are trying to do", paragraphs: ["Keeping photos, deleting an account, and memorializing a profile are separate requests. Choosing a goal helps narrow which services and official pages to check.", "If you are unsure, read the guide to what to check before managing a deceased person’s account."] },
      { heading: "Gather account clues", paragraphs: ["Review any account list or contact notes the family has, then make a list of devices and services. Paper receipts, subscription notices, and payment records may help identify a service.", "Use email or a billing statement only as a clue. Avoid opening personal messages or sensitive records beyond what is needed to identify the service. Do not list passwords, recovery codes, authenticator codes, or wallet recovery phrases on a paper inventory."] },
      { heading: "Use official requests", paragraphs: ["A family member’s known password does not replace the service’s published process. The company may set different rules for account closure, a data request, and a memorial profile.", "Keep notes on the date of contact, request reference, documents submitted, and the next follow-up date. Send documents only through an official route when required."] },
      { heading: "Administrative inheritance inquiries are separate", paragraphs: ["Gov.kr’s One-stop Inheritance Administrative Service is an administrative inquiry for records such as financial transactions, land, vehicles, taxes, and pensions. It is not described as a directory of social media or online service accounts. Check its current eligibility and document requirements on the government site."] },
    ],
    sources: [
      { title: "Gov.kr: One-stop Inheritance Administrative Service", href: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" },
      { title: "Google: requests for a deceased user’s account", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" },
      { title: "Apple: request access to a deceased family member’s account", href: "https://support.apple.com/en-us/102431" },
    ],
  },
];

export function getEnglishGuide(slug: string) { return englishGuides.find((guide) => guide.slug === slug); }
