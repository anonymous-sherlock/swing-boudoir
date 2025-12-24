import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function PrivacyPolicy(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground font-bold">
            <Shield className="mr-2 h-5 w-5" />
            Privacy & Data Protection
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-muted-foreground">
          <section>
            <p className="mb-2">
              <strong>Last Updated:</strong> December 2, 2025
            </p>
            <p>
              WI Thinkers, doing business as Swing Boudoir ("we", "us", "our") operates the Ultimate Cover Model Competition platform (the "Service"), which includes our website,
              contestant portal, voting system, checkout pages, and promotional channels. By using our Service, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h3>

            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-1">A. Contestant Information</p>
                <ul className="list-disc list-inside">
                  <li>Name, email, phone, location and biography.</li>
                  <li>Social media handles (Instagram, TikTok, WhatsApp, Snapchat).</li>
                  <li>Submitted photos, videos, and media required for the competition.</li>
                  <li>Contest round progress and leaderboard ranking information.</li>
                  <li>Entry forms, onboarding documents, and interview scheduling data.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">B. Voter Information</p>
                <ul className="list-disc list-inside">
                  <li>Email address (for free daily voting verification).</li>
                  <li>Payment details for digital product purchases (processed by Stripe/Razorpay/PayPal).</li>
                  <li>IP address, device info, and browser details (for anti-fraud protection).</li>
                  <li>Free vote logs, paid vote logs, and reward wheel activity (if applicable).</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1">C. General Platform Data</p>
                <ul className="list-disc list-inside">
                  <li>User activity: pages visited, clicks, time spent, session data.</li>
                  <li>Referral source (e.g., contestant’s personal voting link).</li>
                  <li>CRM notes, onboarding status, content compliance checks.</li>
                  <li>Leaderboard rankings, total votes, and contestant performance metrics.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Information */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Manage contestant entries, onboarding, and verification.</li>
              <li>Record, verify, and count free and paid votes.</li>
              <li>Process digital product purchases and subscription payments.</li>
              <li>Publish contestant photos, rankings, biographies, and promotional content.</li>
              <li>Display public leaderboards and round eliminations.</li>
              <li>Prevent fraud, duplicate voting, or suspicious activity.</li>
              <li>Send emails and notifications about contest updates, deadlines, rewards, and results.</li>
              <li>Create and publish magazine features and social media promotions.</li>
            </ul>
          </section>

          {/* 3. Sharing Information */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">3. Sharing of Information</h3>
            <p>We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Payment Gateways</strong> — Stripe, Razorpay, PayPal (for processing payments).
              </li>
              <li>
                <strong>CRM Tools</strong> — Airtable, Trello, Calendly (onboarding + scheduling).
              </li>
              <li>
                <strong>Email Marketing Platforms</strong> — Mailchimp, ConvertKit (notifications + updates).
              </li>
              <li>
                <strong>Analytics Providers</strong> — analytics tools to measure performance and safety.
              </li>
              <li>
                <strong>Public Display:</strong> contestants’ names, photos, votes, rankings, and features may be displayed publicly on the website and in Swing Boudoir Magazine.
              </li>
              <li>
                <strong>Social Media Platforms:</strong> Instagram collab posts, video reels, and promotional media.
              </li>
            </ul>

            <p className="mt-3">We do NOT sell your personal data to third parties.</p>
          </section>

          {/* 4. Data Retention */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">4. Data Retention</h3>
            <p>
              We retain contestant and voter data for the duration of the competition and for historical magazine archives. Winners and finalists may be permanently featured in
              promotional content and Hall of Fame sections. You may request data deletion after the competition ends, subject to legal and business requirements.
            </p>
          </section>

          {/* 5. Security */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">5. Security Measures</h3>
            <p>
              We use industry-standard encryption, secure checkout providers, device fingerprinting, and fraud prevention systems. While we strive to protect your data, no online
              system is entirely secure, and we cannot guarantee absolute protection.
            </p>
          </section>

          {/* 6. User Rights */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">6. Your Rights</h3>
            <p>You may request:</p>

            <ul className="list-disc list-inside mt-2">
              <li>Access to your personal data.</li>
              <li>Correction of inaccurate or outdated information.</li>
              <li>Deletion of your data (after contest completion).</li>
              <li>Opt-out from marketing communications.</li>
            </ul>

            <p className="mt-2">Requests can be submitted to: submit@swingboudoirmag.com</p>
          </section>

          {/* 7. Age Requirements */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">7. Age Requirements</h3>
            <p>
              Participation in the Ultimate Cover Model Competition is restricted to individuals aged 18+ only. We do not knowingly collect data from minors. If a minor is
              discovered, their data will be deleted and their account removed from the Competition.
            </p>
          </section>

          {/* 8. Updates */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">8. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy periodically. The updated version will include a new “Last Updated” date. Continued use of the Service constitutes acceptance of any
              changes.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">9. Contact Us</h3>
            <p>If you have questions about this Privacy Policy or your data rights, contact:</p>

            <div className="mt-2 space-y-1">
              <p>Email: submit@swingboudoirmag.com</p>
              <p>Competition Support: submit@swingboudoirmag.com</p>
              <p>
                WI Thinkers
                <br />
                DBA Swing Boudoir Magazine
                <br />
                4th Floor, Plot 605, Sector 42
                <br />
                Gurugram, Haryana 122009
                <br />
                India
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
