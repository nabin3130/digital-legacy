export type EnglishAction = {
  id: string;
  title: string;
  description: string;
  guidance: string;
  link?: string;
  linkLabel?: string;
  requiredDocuments?: string[];
  notes?: string;
  warning?: string;
  sections?: Array<[string, string[]]>;
};

export type EnglishCompany = {
  name: string;
  policyTitle: string;
  policySubtitle?: string;
  description: string;
  button: string;
  policyLink: string;
  services: string[];
  mine: EnglishAction[];
  deceased: EnglishAction[];
};

export const companyEnglish: Record<string, EnglishCompany> = {
  apple: {
    name: "Apple",
    policyTitle: "Legacy Contact",
    policySubtitle: "Digital Legacy",
    description: "Apple allows users to designate a Legacy Contact in advance. After death, the designated contact can request access to eligible account data using an access key and a death certificate.",
    button: "View Apple’s official policy",
    policyLink: "https://support.apple.com/en-us/102631",
    services: ["iCloud", "Photos", "Notes", "Mail", "iCloud Drive", "Messages in iCloud", "Reminders"],
    mine: [
      {
        id: "add-contact",
        title: "Add a Legacy Contact",
        description: "Choose someone who may request access to eligible data after your death.",
        guidance: "On an iPhone, iPad, or Mac, open Settings (or System Settings), select your Apple ID, choose Sign-In & Security, and select Legacy Contact. Follow the on-screen steps to add a contact and securely share the generated access key.",
        link: "https://support.apple.com/en-us/102631",
        linkLabel: "See Apple’s Legacy Contact instructions",
        sections: [
          ["How to set it up", [
            "Go to Settings > [Your Name] > Sign-In & Security > Legacy Contact on iPhone or iPad (or System Settings on Mac).",
            "Choose 'Add Legacy Contact' and authenticate with Face ID, Touch ID, or passcode.",
            "You can add family members or any trusted contact, and assign multiple contacts.",
            "Share the unique access key via Messages or print a copy to keep with estate planning documents."
          ]],
          ["What happens if no Legacy Contact is set?", [
            "Family members will need to provide a court order or regional legal documents naming them as the rightful heir to request account access or deletion.",
            "The legal review process takes significantly longer and approval is not guaranteed.",
            "Apple does not grant account access with just a password or proof of relationship."
          ]],
          ["Important things to know", [
            "Legacy contacts do not receive your Apple Account password.",
            "They will need both the access key and a valid death certificate to request access.",
            "You can update or remove legacy contacts at any time in Settings."
          ]]
        ]
      },
      {
        id: "share-key",
        title: "Share and safely store the access key",
        description: "Securely deliver the generated access key to your designated Legacy Contact.",
        guidance: "Send the key through Apple Messages or save a PDF/printed copy to store alongside important legal documents.",
        link: "https://support.apple.com/en-us/102678",
        linkLabel: "Learn about Apple access keys",
        sections: [
          ["Sharing options", [
            "Send via Messages if the contact uses an Apple device running compatible software.",
            "Print a physical copy or export a PDF of the QR code/access key if they do not use Apple devices.",
            "If you remove or replace a legacy contact, ensure you destroy old keys and issue new ones."
          ]],
          ["Important reminders", [
            "An access key alone does not grant access; a death certificate is always required.",
            "Ensure your legacy contact knows where the physical or digital key is stored."
          ]]
        ]
      },
      {
        id: "download",
        title: "Download my Apple data",
        description: "Request a copy of the data associated with your Apple Account.",
        guidance: "Sign in to Apple’s Data and Privacy page, select 'Request a copy of your data', choose the categories you need, and submit the request.",
        link: "https://privacy.apple.com/",
        linkLabel: "Open Apple Data and Privacy",
        sections: [
          ["How to proceed", [
            "Sign in to privacy.apple.com with your Apple Account.",
            "Select 'Request a copy of your data'.",
            "Choose the services and data categories you want to download.",
            "Select a maximum file size and wait for Apple's completion notification email."
          ]],
          ["Key notes", [
            "Available data may vary depending on active Apple services and regional regulations.",
            "Downloading your data does not delete it from Apple servers.",
            "If you plan to delete your account, back up all necessary data first."
          ]]
        ]
      },
      {
        id: "delete-mine",
        title: "Delete my Apple Account",
        description: "Permanently remove your account and all associated data.",
        guidance: "Back up important photos and files, check active subscriptions, and submit a deletion request via Apple Data and Privacy.",
        link: "https://privacy.apple.com/",
        linkLabel: "Request account deletion",
        warning: "Make sure to download all photos, documents, and purchased media before deleting your account.",
        sections: [
          ["Before deleting", [
            "Download all photos, iCloud Drive files, and important data.",
            "Cancel active subscriptions and check recurring billing.",
            "Sign out of all Apple devices to prevent Activation Lock issues."
          ]],
          ["Important things to know", [
            "Once deleted, your account and data cannot be restored.",
            "You will lose access to content purchased through the App Store and iTunes."
          ]]
        ]
      }
    ],
    deceased: [
      {
        id: "request-access",
        title: "I have a Legacy Contact access key",
        description: "Request access to the deceased person's eligible data using the access key and death certificate.",
        guidance: "Visit Apple’s Digital Legacy portal, enter the access key, and upload a copy of the death certificate.",
        link: "https://digital-legacy.apple.com/",
        linkLabel: "Request access on Apple Digital Legacy",
        sections: [
          ["Before you start", [
            "You must be designated as a Legacy Contact by the account owner.",
            "You will need the access key provided by the deceased and a government-issued death certificate.",
            "Apple reviews each submission before granting approval."
          ]],
          ["Once approved", [
            "You do not log into the deceased person's existing Apple ID directly.",
            "Apple creates a special Legacy Contact Apple ID for you to access the data.",
            "Access is granted for 3 years from approval date, after which the account is permanently deleted.",
            "Make sure to download and store all needed data within the 3-year window."
          ]],
          ["Eligible data includes", [
            "iCloud Photos, Mail, Contacts, Calendar, Notes, Reminders",
            "Files stored in iCloud Drive, Call History, and Voice Memos",
            "Safari Bookmarks and Reading List, Health data"
          ]],
          ["Ineligible data (Not provided)", [
            "Purchased movies, music, books, or in-app purchases",
            "Payment information and Apple Pay cards",
            "Passwords and passkeys stored in iCloud Keychain"
          ]]
        ]
      },
      {
        id: "delete-account",
        title: "Request account deletion for the deceased",
        description: "Permanently delete the deceased person's Apple Account if data access is not needed.",
        guidance: "Submit a request through Apple’s Digital Legacy website or contact Apple Support with the required legal documents.",
        link: "https://digital-legacy.apple.com/",
        linkLabel: "Request deletion on Digital Legacy",
        warning: "If you need any photos or files, request access before deleting the account. Deletion is irreversible.",
        sections: [
          ["Required information & documents", [
            "Deceased person’s Apple Account information (email / phone number).",
            "Official death certificate.",
            "Documents proving your relationship or legal authority (e.g. court order, letters of administration)."
          ]],
          ["Key notes", [
            "Once deletion is completed, all data and purchases are permanently destroyed.",
            "Apple carefully verifies the applicant's legal authority before processing."
          ]]
        ]
      },
      {
        id: "no-key",
        title: "Procedures when there is no access key",
        description: "Check the legal documentation route required in your country or region.",
        guidance: "If the deceased did not set a Legacy Contact, Apple requires legal documentation such as a court order naming you as the rightful inheritor.",
        link: "https://support.apple.com/en-us/102431",
        linkLabel: "Review Apple’s legal requirements",
        sections: [
          ["Required legal documentation", [
            "Proof of your identity and relationship to the deceased.",
            "Official death certificate.",
            "A court order or equivalent legal documentation issued in your jurisdiction explicitly mentioning the Apple Account."
          ]],
          ["Important considerations", [
            "Requirements vary significantly by country and regional legal standards.",
            "Submitting documents does not guarantee approval; Apple reviews each case individually."
          ]]
        ]
      }
    ]
  },
  google: {
    name: "Google",
    policyTitle: "Inactive Account Manager",
    policySubtitle: "Posthumous Account Planning",
    description: "Google allows users to specify trusted contacts, choose what data to share, and decide whether the account should be deleted after a designated period of inactivity.",
    button: "View Google’s official policy",
    policyLink: "https://support.google.com/accounts/answer/3036546?hl=en",
    services: ["Gmail", "YouTube", "Google Photos", "Google Drive", "Google Calendar", "Contacts"],
    mine: [
      {
        id: "prepare",
        title: "Set up Inactive Account Manager",
        description: "Choose trusted contacts, shared data, and whether the account should be deleted after inactivity.",
        guidance: "Specify an inactivity waiting period, add up to 10 trusted contacts, select what data each person can download, and decide whether Google should auto-delete the account.",
        link: "https://myaccount.google.com/inactive?hl=en",
        linkLabel: "Open Inactive Account Manager",
        sections: [
          ["What you can configure", [
            "Inactivity waiting period (e.g., 3, 6, 12, or 18 months of no Google activity).",
            "Alert phone number and email addresses before the timeout triggers.",
            "Up to 10 trusted contacts who will be notified and given download access.",
            "Specific Google services and data categories shared with each contact.",
            "Option to automatically delete the Google Account after sharing is complete."
          ]],
          ["Important things to know", [
            "Triggers based on account inactivity, not an official death notice.",
            "Trusted contacts receive a download link, never your account password or login access.",
            "You can modify or disable Inactive Account Manager at any time."
          ]]
        ]
      },
      {
        id: "download",
        title: "Download my Google data",
        description: "Export an archive of your photos, emails, files, and activity via Google Takeout.",
        guidance: "Open Google Takeout, select the services you wish to archive, choose delivery method and file type, then download the archive when ready.",
        link: "https://takeout.google.com/?hl=en",
        linkLabel: "Open Google Takeout",
        sections: [
          ["Available data categories", [
            "Gmail messages and attachments",
            "Google Photos and videos in full quality",
            "Google Drive documents and files",
            "Google Calendar, Contacts, YouTube playlists and history"
          ]],
          ["How it works", [
            "Select the specific Google services to include.",
            "Choose delivery method (email download link, Google Drive, Dropbox, OneDrive).",
            "Select file format (.zip or .tgz) and archive split size.",
            "Google will prepare the archive (which may take hours or days) and email you a download link."
          ]]
        ]
      },
      {
        id: "delete-mine",
        title: "Delete my Google Account",
        description: "Permanently delete your account and all associated Google services.",
        guidance: "Download important files first, update third-party logins linked to your Gmail, and delete the account via Google Account settings.",
        link: "https://support.google.com/accounts/answer/32046?hl=en",
        linkLabel: "See deletion instructions",
        warning: "Ensure you have exported all important photos, documents, and emails before deleting.",
        sections: [
          ["Before deleting", [
            "Download all critical data using Google Takeout.",
            "Change recovery emails and logins for third-party services registered with your Gmail.",
            "Review Google Play subscriptions and active balances."
          ]],
          ["Key notes", [
            "You will lose access to all Google services including Gmail, Drive, Photos, and YouTube.",
            "Account deletion is permanent after a short grace period."
          ]]
        ]
      }
    ],
    deceased: [
      {
        id: "receive-data",
        title: "Request data from the deceased person's account",
        description: "Check how to receive account data depending on whether you were pre-designated.",
        guidance: "If pre-designated, check your email for the Google Takeout download link. If not designated, submit a formal request with proof of relationship and death certificate.",
        link: "https://support.google.com/accounts/troubleshooter/6357590?hl=en",
        linkLabel: "Start Google’s deceased user request",
        sections: [
          ["If you were designated", [
            "Look for an email from Google notifying you of the shared data.",
            "Click the download link and verify your identity using your phone number.",
            "Download the archive within the designated expiration period."
          ]],
          ["If you were NOT designated", [
            "Immediate family members and legal representatives can submit a formal deceased user data request.",
            "You must provide the deceased person's email, government death certificate, and proof of authority/relationship.",
            "Google reviews each request under strict privacy regulations; passwords are never provided."
          ]]
        ]
      },
      {
        id: "close-deceased",
        title: "Close the deceased person’s account",
        description: "Request closure and deletion of the deceased user's account.",
        guidance: "Submit Google’s deceased-user troubleshooter form and select account closure. Prepare proof of death and identification.",
        link: "https://support.google.com/accounts/troubleshooter/6357590?hl=en",
        linkLabel: "Request account closure",
        warning: "If you also need data from the account, request it before closing. Data cannot be recovered once closed.",
        sections: [
          ["Required information", [
            "Applicant's name and contact email address.",
            "Deceased person's full name and Google email address.",
            "Government-issued death certificate and proof of legal authority."
          ]],
          ["Important notes", [
            "Google will carefully evaluate your submission before taking action.",
            "No login credentials or passwords will ever be released."
          ]]
        ]
      },
      {
        id: "request-balance",
        title: "Request funds from the account",
        description: "Submit a request for remaining balances (Google Play, AdSense, etc.) from the deceased user's account.",
        guidance: "Use the deceased-user troubleshooter and select the option for funds. Provide estate administration and probate documents as requested.",
        link: "https://support.google.com/accounts/troubleshooter/6357590?hl=en",
        linkLabel: "Submit funds request",
        sections: [
          ["Required documentation", [
            "Applicant identification and contact information.",
            "Deceased user's Google Account details.",
            "Certified death certificate and legal inheritance/estate documents."
          ]],
          ["Key notes", [
            "Approval is subject to financial regulations and verified estate authority.",
            "Additional banking and probate documentation may be requested."
          ]]
        ]
      }
    ]
  },
  meta: {
    name: "Meta (Facebook)",
    policyTitle: "Memorialized Account",
    policySubtitle: "Legacy Contact & Deletion",
    description: "Facebook preserves a deceased person's profile as a memorialized account. A pre-designated Legacy Contact can manage limited features, or immediate family can request account removal.",
    button: "View Facebook’s official policy",
    policyLink: "https://www.facebook.com/help/103897939701143/?locale=en_US",
    services: ["Facebook Profile", "Messenger", "Facebook Pages", "Photos & Videos"],
    mine: [
      {
        id: "legacy",
        title: "Choose a Facebook Legacy Contact",
        description: "Designate someone to manage tribute posts and profile images on your memorialized profile.",
        guidance: "Go to Facebook Settings > Accounts Center > Personal details > Account ownership and control > Memorialization, and select a trusted friend as your Legacy Contact.",
        link: "https://www.facebook.com/help/1070665206293088/?locale=en_US",
        linkLabel: "See Legacy Contact instructions",
        sections: [
          ["How to configure", [
            "Open Facebook Settings > Account Ownership and Control > Memorialization settings.",
            "Choose a trusted friend or family member as your Legacy Contact.",
            "Decide whether your contact will have permission to download an archive of your shared photos and posts.",
            "Alternatively, choose to have your account permanently deleted upon verified death."
          ]],
          ["What a Legacy Contact can do", [
            "Write a pinned tribute post on your memorialized profile.",
            "Respond to new friend requests and update profile and cover photos.",
            "They CANNOT log in as you, read your private messages, or remove existing friends."
          ]]
        ]
      },
      {
        id: "download",
        title: "Download my Facebook information",
        description: "Create an archive of your posts, photos, messages, and account activity.",
        guidance: "Use Accounts Center to select your profile, information categories, date range, and export format.",
        link: "https://www.facebook.com/help/212802592074644/?locale=en_US",
        linkLabel: "Download information guide",
        sections: [
          ["How to download", [
            "Go to Accounts Center > Your information and permissions > Download your information.",
            "Select the profiles and specific data categories you want.",
            "Choose file format (HTML or JSON) and media quality, then submit the request."
          ]]
        ]
      },
      {
        id: "delete",
        title: "Delete my Facebook account",
        description: "Permanently delete your Facebook profile and data.",
        guidance: "Download important files, then use Accounts Center’s Deactivation or deletion settings.",
        link: "https://www.facebook.com/help/224562897555674/?locale=en_US",
        linkLabel: "See account deletion guide"
      }
    ],
    deceased: [
      {
        id: "memorialize",
        title: "Memorialize the account",
        description: "Ask Facebook to secure the profile as a memorial space for friends and family.",
        guidance: "Submit the official memorialization form with a link to an obituary, memorial card, news article, or death certificate.",
        link: "https://www.facebook.com/help/contact/234739086860192?locale=en_US",
        linkLabel: "Request memorialization form",
        sections: [
          ["What happens to a memorialized account?", [
            "The word 'Remembering' is displayed next to the person's name.",
            "Content shared by the person remains visible to the audience it was shared with.",
            "Memorialized accounts cannot be logged into, and do not appear in public spaces like 'People You May Know'."
          ]],
          ["Required information", [
            "Name of the person and URL of their Facebook profile.",
            "Date of passing.",
            "Link to obituary or photo of death certificate."
          ]]
        ]
      },
      {
        id: "remove",
        title: "Request account removal",
        description: "Verified immediate family members or legal estate representatives may request permanent removal.",
        guidance: "Submit Meta's special request form for deceased family members along with proof of death and legal authority.",
        link: "https://www.facebook.com/help/contact/228813257197480?locale=en_US",
        linkLabel: "Request account removal form",
        sections: [
          ["Required documents", [
            "Deceased person's death certificate.",
            "Proof that you are an immediate family member (birth/marriage certificate) or lawful representative (letters of administration, power of attorney)."
          ]]
        ]
      },
      {
        id: "manage",
        title: "Manage as a Legacy Contact",
        description: "Manage tribute posts, profile photo, and friend requests if you were pre-designated.",
        guidance: "Once the account is memorialized, navigate to the profile to access your Legacy Contact management tools.",
        link: "https://www.facebook.com/help/828408313868251?locale=en_US",
        linkLabel: "See Legacy Contact guide"
      }
    ]
  },
  instagram: {
    name: "Instagram",
    policyTitle: "Memorialized Account",
    policySubtitle: "Account Protection & Removal",
    description: "Instagram protects the account of a deceased person in a memorialized state upon valid report. Verified immediate family can also request permanent deletion.",
    button: "View Instagram’s official policy",
    policyLink: "https://www.facebook.com/help/instagram/264154560391256",
    services: ["Instagram Profile", "Posts & Reels", "Stories & Highlights", "Direct Messages"],
    mine: [
      {
        id: "download",
        title: "Download my Instagram information",
        description: "Request a copy of photos, videos, comments, and profile information.",
        guidance: "In Accounts Center, select 'Your information and permissions' > 'Download your information' and pick your Instagram profile.",
        link: "https://help.instagram.com/181231772500920?locale=en_US",
        linkLabel: "Instagram download guide"
      },
      {
        id: "delete",
        title: "Delete my Instagram account",
        description: "Permanently delete your Instagram profile and media.",
        guidance: "Back up your photos and videos first, then proceed with deletion via Accounts Center settings.",
        link: "https://help.instagram.com/139886812848894?locale=en_US",
        linkLabel: "Instagram deletion guide"
      }
    ],
    deceased: [
      {
        id: "memorialize",
        title: "Memorialize the Instagram account",
        description: "Secure the account as a memorial space. The word 'Remembering' will be added to the profile.",
        guidance: "Submit Instagram’s memorialization report with proof of death (obituary link, news article, or death certificate).",
        link: "https://help.instagram.com/contact/452224988254888",
        linkLabel: "Instagram memorialization form",
        sections: [
          ["Key facts", [
            "No one can log into a memorialized Instagram account.",
            "Posts, photos, and reels remain visible to the existing audience.",
            "The account will not appear in Explore feeds or public suggestions."
          ]]
        ]
      },
      {
        id: "remove",
        title: "Request account removal",
        description: "Immediate family members or authorized estate representatives can request permanent deletion.",
        guidance: "Submit Instagram’s deceased user removal form with birth/marriage certificates and official death certificate.",
        link: "https://help.instagram.com/contact/147960058699269",
        linkLabel: "Instagram removal request form",
        sections: [
          ["Required verification", [
            "Deceased person's full name, username, and proof of death.",
            "Proof of your authority: birth certificate, marriage certificate, or legal estate appointment."
          ]]
        ]
      }
    ]
  },
  samsung: {
    name: "Samsung",
    policyTitle: "Digital Legacy",
    policySubtitle: "Legacy Manager",
    description: "Samsung enables users to designate a Legacy Manager and issue an access code in advance. Approved managers gain access to selected data for up to 1 year after approval.",
    button: "View Samsung’s official policy",
    policyLink: "https://digital-legacy.samsung.com/",
    services: ["Samsung Account", "Samsung Cloud", "Contacts", "Samsung Notes", "Calendar", "Voice Recorder", "Reminders"],
    mine: [
      {
        id: "manager",
        title: "Designate a Legacy Manager",
        description: "Choose a manager and securely share the generated access code.",
        guidance: "Visit Samsung Digital Legacy settings, select a contact, choose which data categories to share, and securely save the access code.",
        link: "https://digital-legacy.samsung.com/",
        linkLabel: "Open Samsung Digital Legacy",
        sections: [
          ["How to set up", [
            "Go to digital-legacy.samsung.com and sign in with your Samsung Account.",
            "Designate a Legacy Manager and select accessible data types (Contacts, Notes, Calendar, Voice Recordings).",
            "Download and safely deliver the generated Access Code to your manager."
          ]],
          ["Important notes", [
            "Gallery photos and third-party app data are currently not transferable.",
            "The Legacy Manager will need both the Access Code and official death verification."
          ]]
        ]
      },
      {
        id: "download",
        title: "Download my Samsung data",
        description: "Export data associated with your Samsung Account.",
        guidance: "Sign in to Samsung Privacy or Samsung Cloud settings to request an export of your personal data.",
        link: "https://privacy.samsung.com/",
        linkLabel: "Open Samsung Privacy"
      },
      {
        id: "delete",
        title: "Delete my Samsung Account",
        description: "Permanently delete your Samsung Account and synced cloud data.",
        guidance: "Review connected Galaxy devices and cloud backups before proceeding with deletion.",
        link: "https://account.samsung.com/",
        linkLabel: "Open Samsung Account"
      }
    ],
    deceased: [
      {
        id: "code",
        title: "I have the Samsung access code",
        description: "Use the access code and death certificate to request eligible legacy data.",
        guidance: "Visit Samsung Digital Legacy, enter the code, upload the required documentation, and download the data once approved.",
        link: "https://digital-legacy.samsung.com/",
        linkLabel: "Start Samsung Legacy Request",
        sections: [
          ["How it works", [
            "Enter the Access Code on digital-legacy.samsung.com.",
            "Upload government-issued death certificate and identification.",
            "Once approved, you will have 1 year of access to view and download eligible data."
          ]]
        ]
      },
      {
        id: "no-code",
        title: "I do not have an access code",
        description: "Check alternative support options for family members without a code.",
        guidance: "Contact Samsung Support with legal inheritance documents to inquire about regional account closure options.",
        link: "https://www.samsung.com/us/support/contact/",
        linkLabel: "Contact Samsung Support"
      }
    ]
  },
  naver: {
    name: "Naver",
    policyTitle: "Digital Legacy Policy",
    policySubtitle: "Public Content Backup & Withdrawal",
    description: "Naver strictly protects user privacy and does not transfer private data or login credentials to family members. Requests for public post backups or account withdrawal follow a dedicated legal review.",
    button: "View Naver Help",
    policyLink: "https://help.naver.com/service/5640/contents/17441?lang=en",
    services: ["Naver Blog", "Naver Cafe", "BAND", "MYBOX", "Naver Mail", "Naver Pay"],
    mine: [
      {
        id: "organize",
        title: "Organize or download my Naver data",
        description: "Review backup and export options within each individual Naver service.",
        guidance: "Back up public blog posts, save MYBOX files, and export important emails before closing your account.",
        link: "https://help.naver.com/?lang=en",
        linkLabel: "Open Naver Help"
      },
      {
        id: "delete",
        title: "Close my Naver account",
        description: "Check paid services and Naver Pay balances before requesting membership withdrawal.",
        guidance: "Check active subscriptions, settle Naver Pay points, and proceed with account withdrawal in Naver ID settings.",
        link: "https://nid.naver.com/user2/help/myInfo?lang=en_US",
        linkLabel: "Naver Account settings"
      }
    ],
    deceased: [
      {
        id: "backup",
        title: "Request backup of public posts",
        description: "Request an archive of publicly viewable content such as public Blog posts.",
        guidance: "Submit an inquiry to Naver Help with proof of death, family relation certificate, and the deceased user's Naver ID.",
        link: "https://help.naver.com/service/5640/contents/17441?lang=en",
        linkLabel: "Naver Public Post Policy",
        warning: "Private posts, emails, and login credentials cannot be provided under any circumstances.",
        sections: [
          ["Required documents", [
            "Official death certificate or basic certificate showing death.",
            "Family relation certificate showing relationship to the deceased.",
            "Completed Naver consent and request application form."
          ]],
          ["Important privacy rules", [
            "Mask the last 7 digits of resident registration numbers on all submitted documents.",
            "Only publicly visible content (e.g. public blog articles) is eligible for backup."
          ]]
        ]
      },
      {
        id: "delete",
        title: "Request account deletion for the deceased",
        description: "Submit documents to request permanent withdrawal and deletion of the deceased user's Naver account.",
        guidance: "Provide the deceased user's ID along with family and death certificates to request complete account closure.",
        link: "https://help.naver.com/service/5640/contents/17441?lang=en",
        linkLabel: "Naver Account Closure Policy",
        sections: [
          ["Required documents", [
            "Deceased person's Naver ID.",
            "Proof of death and certified family relation documents.",
            "Mask the second half of all national identification numbers before uploading."
          ]]
        ]
      },
      {
        id: "npay",
        title: "Inquire about remaining Naver Pay balance",
        description: "Check procedures for inheriting or refunding remaining Naver Pay points or deposit money.",
        guidance: "Contact Naver Pay Customer Center directly with inheritance and estate verification documents.",
        link: "https://help.pay.naver.com/",
        linkLabel: "Naver Pay Help Center"
      }
    ]
  },
  kakao: {
    name: "Kakao",
    policyTitle: "Digital Legacy Policy",
    policySubtitle: "Memorial Profile & Paid Balance Refunds",
    description: "Kakao protects communication privacy and does not provide chat logs. It offers Memorial Profiles for KakaoTalk, public post backups, and refunds for eligible unused paid balances.",
    button: "Visit Kakao Help",
    policyLink: "https://cs.kakao.com/?locale=en",
    services: ["KakaoTalk", "Kakao Account", "KakaoStory", "Daum", "Brunch Story", "Kakao Pay"],
    mine: [
      {
        id: "download",
        title: "Organize or download my Kakao data",
        description: "Export eligible content from Daum, Brunch Story, and KakaoTalk before withdrawal.",
        guidance: "Back up important writings, photos, and chat media through each service's built-in export features.",
        link: "https://cs.kakao.com/?locale=en",
        linkLabel: "Kakao Help Center"
      },
      {
        id: "delete",
        title: "Delete my Kakao Account",
        description: "Review connected services, Kakao Pay, and emoticons before deleting your account.",
        guidance: "Check active subscriptions and Gifticon balances, then initiate account deletion in Kakao Account settings.",
        link: "https://accounts.kakao.com/",
        linkLabel: "Kakao Account Settings"
      }
    ],
    deceased: [
      {
        id: "memorial",
        title: "Convert to KakaoTalk Memorial Profile",
        description: "Convert the deceased person's KakaoTalk profile into a memorial space for friends.",
        guidance: "Family members can submit a request with a death certificate to convert the profile. The profile will display a memorial badge, and direct chats cannot be sent.",
        link: "https://cs.kakao.com/?locale=en",
        linkLabel: "Kakao Memorial Profile Guide",
        sections: [
          ["Memorial Profile features", [
            "The profile displays '(Remembering)' next to the name.",
            "Prevents unauthorized phone number reassignment or account hijacking.",
            "Chat history and private messages are strictly protected and never disclosed."
          ]],
          ["Required documents", [
            "Official death certificate.",
            "Family relation certificate showing relationship."
          ]]
        ]
      },
      {
        id: "delete",
        title: "Request account deletion",
        description: "Request termination and deletion of the deceased user's Kakao Account.",
        guidance: "Submit death and family relation verification documents to Kakao Customer Support.",
        link: "https://cs.kakao.com/?locale=en",
        linkLabel: "Kakao Account Deletion Request"
      },
      {
        id: "balance",
        title: "Inquire about paid balances and unused mobile gifts",
        description: "Request refunds for eligible paid prepaid balances or unused mobile coupons.",
        guidance: "Contact Kakao Customer Service with inheritance documents to check eligibility for financial refunds.",
        link: "https://cs.kakao.com/?locale=en",
        linkLabel: "Kakao Support Channel"
      }
    ]
  },
  x: {
    name: "X",
    policyTitle: "Deceased User Account Deactivation",
    policySubtitle: "Account Deactivation & Media Review",
    description: "X evaluates account deactivation requests from verified immediate family members or authorized representatives of the estate. Login credentials are never provided.",
    button: "View X’s official policy",
    policyLink: "https://help.x.com/en/rules-and-policies/contact-x-about-a-deceased-family-members-account",
    services: ["Posts", "Media", "Direct Messages", "Spaces", "Bookmarks"],
    mine: [
      {
        id: "archive",
        title: "Download my X data archive",
        description: "Request an archive containing your posts, media, and account history.",
        guidance: "Go to Settings and privacy > Your account > Download an archive of your data. Complete identity verification and wait for the download email.",
        link: "https://help.x.com/en/managing-your-account/how-to-download-your-x-archive",
        linkLabel: "See X archive instructions",
        sections: [
          ["How to download", [
            "Open Settings > Your account > 'Download an archive of your data'.",
            "Verify your identity via password and two-factor code.",
            "X will generate a .zip archive and notify you when it is ready."
          ]]
        ]
      },
      {
        id: "delete",
        title: "Deactivate my X account",
        description: "Deactivate the account, which permanently deletes after a 30-day window.",
        guidance: "Back up important data, then select 'Deactivate your account' in X account settings.",
        link: "https://help.x.com/en/managing-your-account/how-to-deactivate-x-account",
        linkLabel: "See deactivation instructions"
      }
    ],
    deceased: [
      {
        id: "deactivate",
        title: "Deactivate the deceased person’s account",
        description: "Submit an official deactivation request as immediate family or an authorized representative.",
        guidance: "Submit X’s deceased user form. X will follow up via email with instructions on submitting required documentation.",
        link: "https://help.x.com/en/forms/account-access/deactivate-or-close-account/deactivate-account-for-deceased",
        linkLabel: "Start X’s deactivation request",
        sections: [
          ["Required information & documents", [
            "Deceased person's username (@handle) and full name.",
            "A copy of your government-issued ID.",
            "A copy of the deceased person’s death certificate."
          ]],
          ["Important policy notes", [
            "X cannot provide login credentials or access to private Direct Messages under any circumstances.",
            "Submitting the form initiates an email thread where documents can be uploaded securely."
          ]]
        ]
      },
      {
        id: "media",
        title: "Report media showing the moment of death",
        description: "Family members may request removal of sensitive images or videos of a deceased individual.",
        guidance: "Submit X’s critical media removal request form with the specific post URLs and proof of relationship.",
        link: "https://help.x.com/en/forms/report-moment-of-death",
        linkLabel: "Open sensitive media report form"
      }
    ]
  }
};

