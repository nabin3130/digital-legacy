import type { Metadata } from "next";
import styles from "@/app/PolicyPages.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn about Logout’s privacy practices, data protection principles, and user rights.",
  alternates: { canonical: "/en/privacy" },
};

export default function EnglishPrivacyPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>PRIVACY PROTECTION</p>
          <h1>Privacy Policy</h1>
          <p>
            Logout processes only the minimum information necessary and ensures users easily understand how their information is used.
          </p>
          <div className={styles.meta}>
            <span>Effective Date: 2026.08.22</span>
            <span>Last Updated: 2026.08.22</span>
          </div>
        </header>

        <article className={styles.body}>
          <section>
            <h2>1. Personal Information Processed and Purpose of Use</h2>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th>Inquiries</th>
                  <td>
                    Contact email address, inquiry contents.<br />
                    Used solely to verify and respond to your inquiry.
                  </td>
                </tr>
                <tr>
                  <th>Automatically Generated Data</th>
                  <td>
                    During the use of Google advertising services, IP addresses, browser/device information, visited pages, cookies, or similar identifiers may be transmitted to Google.
                  </td>
                </tr>
                <tr>
                  <th>Local Device Storage</th>
                  <td>
                    Selected viewing preferences, checklist status, and guide progress are saved strictly within the user’s browser (localStorage). They are never transmitted to Logout servers.
                  </td>
                </tr>
              </tbody>
            </table>
            <p className={styles.notice}>
              Logout never requests, collects, or stores resident registration numbers, passwords, death certificates, family relation certificates, or actual account credentials.
            </p>
          </section>

          <section>
            <h2>2. Retention and Deletion of Personal Information</h2>
            <ul>
              <li>
                Inquiry emails and messages: Deleted within 30 days after answering and concluding follow-up. However, records may be retained if required by applicable laws or dispute resolution.
              </li>
              <li>
                Browser storage data: Deleted when the user clears browser data or uses the ‘Clear progress’ feature in Logout.
              </li>
              <li>
                Google advertising data: Retained in accordance with Google’s policies and user preferences.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Third-Party Services</h2>
            <h3>FormSubmit</h3>
            <p>
              Email addresses and inquiries entered in the contact form are delivered to the operator's email via FormSubmit. FormSubmit processes information necessary for security and email delivery. Please do not submit sensitive personal information, passwords, or official identification documents through the form.
            </p>
            <p>
              <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">
                FormSubmit Privacy Policy ↗
              </a>
            </p>

            <h3>Google AdSense</h3>
            <p>
              Google AdSense may be utilized to support website operations. Google or its advertising partners may process cookies, web beacons, IP addresses, or other identifiers to serve ads, prevent fraud, and measure performance. Ad personalization settings can be managed via Google Ads Settings and browser preferences.
            </p>
            <p>
              <a href="https://policies.google.com/technologies/partner-sites?hl=en" target="_blank" rel="noopener noreferrer">
                How Google uses information from sites or apps that use our services ↗
              </a>
            </p>
          </section>

          <section>
            <h2>4. User Rights and How to Exercise Them</h2>
            <p>
              Users may request access, correction, deletion, or cessation of processing regarding their personal information. If you need to check or delete inquiry records, please contact us via email. Minimal information may be requested strictly to verify identity.
            </p>
            <p>
              <a href="mailto:kimnabin01@gmail.com">kimnabin01@gmail.com</a>
            </p>
          </section>

          <section>
            <h2>5. Managing Cookies and Local Storage</h2>
            <p>
              Users can block or delete cookies in their browser settings. Deleting browser storage will also reset saved checklists and progress statuses. Ad personalization can be configured in Google Ad Settings.
            </p>
          </section>

          <section>
            <h2>6. Security Measures</h2>
            <p>
              Logout minimizes personal data collection, enforces HTTPS encrypted communication, and restricts access to operator systems. We actively guide users never to submit sensitive documents such as passwords, ID copies, or certificates.
            </p>
          </section>

          <section>
            <h2>7. Privacy Contact Information</h2>
            <p>For any privacy inquiries, feedback, or exercising user rights, please contact:</p>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th>Operator</th>
                  <td>Logout Operator</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    <a href="mailto:kimnabin01@gmail.com">kimnabin01@gmail.com</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>8. Changes to this Policy</h2>
            <p>
              If this privacy policy is amended, advance notice regarding the changes and effective date will be posted on the Policy Updates board. Previous versions can also be reviewed there.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
