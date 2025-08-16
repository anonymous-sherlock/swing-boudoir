import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function PrivacyPolicy() {
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
        <CardContent className="space-y-6">
          <section className="text-muted-foreground">
            <p>
               <h4 className="text-lg font-bold text-foreground mb-3">Swing Boudoir</h4> operates the Ultimate Cover Model Competition platform ("Service"), 
              which includes our website, contest entry system, voting platform, and related promotional activities.
            </p>
            <p>
              By using our Service, you agree to the terms of this Privacy Policy. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h3>
            <div className="text-muted-foreground">
              <p><strong>A. Contestant Information</strong></p>
              <ul className="list-disc list-inside">
                <li>Name, contact details, location, and biography.</li>
                <li>Social media handles (Instagram, TikTok, WhatsApp, Snapchat).</li>
                <li>3-5 high-quality photos, videos, and other submitted media.</li>
                <li>Entry category and promotional material provided.</li>
                <li>Personal voting profile link usage data.</li>
              </ul>
              <p className="mt-3"><strong>B. Voter Information</strong></p>
              <ul className="list-disc list-inside">
                <li>Name and email address (for free daily votes).</li>
                <li>Payment details for paid votes (processed via third-party payment gateways).</li>
                <li>IP address and device information to prevent fraudulent voting.</li>
                <li>Voter reward wheel participation and prizes won.</li>
              </ul>
              <p className="mt-3"><strong>C. General Platform Data</strong></p>
              <ul className="list-disc list-inside">
                <li>User activity on SwingBoudoir.com (pages viewed, time spent).</li>
                <li>Referral source (e.g., via contestant personal voting links).</li>
                <li>CRM notes (onboarding status, interview completion, promotional activity).</li>
                <li>Leaderboard rankings and vote counts.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Process contest applications and manage contestant onboarding forms.</li>
              <li>Verify and count votes (both free daily votes and paid votes).</li>
              <li>Communicate contest updates, deadlines, and winner announcements.</li>
              <li>Display contestant names, photos, and real-time rankings on public leaderboards.</li>
              <li>Process payments for optional digital upgrades and vote purchases.</li>
              <li>Detect and prevent fraudulent or abusive voting patterns.</li>
              <li>Create and publish magazine features, Instagram collaborations, and promotional content.</li>
              <li>Manage the $999 cash prize distribution and magazine cover feature fulfillment.</li>
              <li>Operate the voter reward wheel system and distribute prizes.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">3. Sharing of Information</h3>
            <div className="text-muted-foreground">
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside">
                <li>Payment Processors (Stripe, Razorpay, PayPal) for vote purchases and cash prize distribution.</li>
                <li>CRM & Scheduling Tools (Airtable, Calendly, Fireflies) for onboarding and interview management.</li>
                <li>Marketing Platforms (Mailchimp, ConvertKit) for sending competition updates and promotional emails.</li>
                <li>
                  Public Display – Contestant names, photos, videos, vote counts, and leaderboard rankings 
                  are displayed on our website, social media, and in Swing Boudoir Magazine.
                </li>
                <li>Social Media Platforms for Instagram collab posts and promotional content featuring contestants.</li>
              </ul>
              <p className="mt-2">We do not sell your personal data to third parties for commercial purposes.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">4. Data Retention</h3>
            <p className="text-muted-foreground">
              We retain contestant and voting records for the duration of the competition and for historical 
              magazine archives. Winner and Top 10 information may be permanently featured in our "Hall of Fame" 
              and promotional materials. You can request deletion of personal data after the competition concludes, 
              subject to our legitimate business interests and applicable law.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">5. Security</h3>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data, including secure payment 
              processing and fraud detection systems. However, no online platform is 100% secure, and we cannot 
              guarantee absolute security of transmitted information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">6. Your Rights</h3>
            <div className="text-muted-foreground">
              <p>Depending on your location, you may have rights to:</p>
              <ul className="list-disc list-inside">
                <li>Access the personal data we hold about you and your competition status.</li>
                <li>Request correction of inaccurate personal data or contest information.</li>
                <li>Request deletion of your personal data (subject to contest completion and legal requirements).</li>
                <li>Withdraw consent for non-essential marketing communications.</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, contact us at privacy@swingboudoir.com
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">7. Age Requirements</h3>
            <p className="text-muted-foreground">
              The Swing Boudoir Ultimate Cover Model Competition is intended for participants aged 18 and above only. 
              We do not knowingly collect personal information from minors. If we discover we have collected 
              information from someone under 18, we will delete it immediately and remove them from the competition.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">8. Changes to This Policy</h3>
            <p className="text-muted-foreground">
              We may update this Privacy Policy to reflect changes in our practices or applicable laws. 
              Updated versions will be posted with a revised "Last Updated" date. Continued participation in 
              the competition constitutes acceptance of any updated terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">9. Contact Us</h3>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy or our data handling practices:
            </p>
            <p className="text-muted-foreground">Email: privacy@swingboudoir.com</p>
            <p className="text-muted-foreground">Competition Support: support@swingboudoir.com</p>
            <p className="text-muted-foreground">Swing Boudoir Magazine<br/>
            [Business Address]<br/>
            [City, State, ZIP Code]</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}