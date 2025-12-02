import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel } from "lucide-react";

/**
 * Official Rules - Swing Boudoir Ultimate Cover Model Competition
 * - TypeScript / React component (JSX)
 * - Matches the structure & UI components used in your Privacy Policy layout
 *
 * Notes:
 * - Replace placeholders ([Business Address], [City, State, ZIP]) before publishing.
 * - "Last Updated" is set to Dec 2, 2025. Change if needed.
 */

export function OfficialRules(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Official Rules</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground font-bold">
            <Gavel className="mr-2 h-5 w-5" />
            Official Rules — Swing Boudoir Ultimate Cover Model Competition
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-muted-foreground">
          <section>
            <p className="mb-2">
              <strong>Last Updated:</strong> December 2, 2025
            </p>
            <p>
              These Official Rules govern the Swing Boudoir Ultimate Cover Model Competition (the "Competition") and form a binding agreement between each Contestant, Voter and
              Swing Boudoir Magazine ("Organizer", "we", "us"). By entering the Competition, using the voting system, or otherwise participating, you agree to these Rules.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">1. Eligibility</h3>
            <div className="space-y-2">
              <p>a) Contestants must be at least 18 years old at the time of entry and able to provide valid government-issued photo ID upon request. Minors are not eligible.</p>
              <p>b) Employees of the Organizer, its affiliates, advertising or promotion agencies, and their immediate family members are not eligible to receive prizes.</p>
              <p>c) Contestants are responsible for meeting any local laws or regulations concerning participation, publicity, and photo releases.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">2. Contest Structure & Awards</h3>
            <div className="space-y-2">
              <p>
                a) <strong>Official Winner</strong> — The Official Winner is determined solely by the verified total number of votes received during the open voting period, subject
                to verification and fraud checks.
              </p>
              <p>
                b) <strong>Secondary Awards</strong> — Additional awards (e.g., Editor’s Pick, Photogenic Award) are selected by internal judges and do not affect the Official
                Winner selection.
              </p>
              <p>
                c) Prizes (cash, magazine feature, other benefits) will be described on the contest landing page. The Organizer reserves the right to substitute prizes of equal or
                greater value.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">3. Entry & Voting Periods</h3>
            <div className="space-y-2">
              <p>
                a) Entry deadlines, voting open/close dates, and elimination rounds will be published on the Competition website. All times are listed in the time zone shown on the
                site.
              </p>
              <p>b) The Organizer may modify timing, round structure, or extend/shorten voting periods at its discretion. Significant changes will be published on the site.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">4. Free Votes</h3>

            <div className="space-y-2">
              <p>
                a) <strong>Free Vote Allowance</strong> — Each visitor is allowed
                <strong> one (1) free vote per calendar day</strong>. Free votes do not require the creation of an account or verification by email or phone.
              </p>

              <p>
                b) <strong>Fair Use & Fraud Prevention</strong> — The platform may use IP checks, cookies, device identifiers, or other non-intrusive methods to prevent duplicate
                or fraudulent free votes. Suspicious or automated voting attempts may be blocked.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">5. Paid Votes & Digital Products</h3>
            <div className="space-y-2">
              <p>
                a) <strong>No purchase necessary to vote.</strong> You can vote using the free daily vote allowance without making any purchase.
              </p>
              <p>
                b) Paid votes are implemented as bonus votes tied to the purchase of clearly-described <em>digital products</em> (for example: digital magazine issues, photo packs,
                interview bundles, wallpapers). Purchases grant bonus support votes; purchases are not a direct sale of votes.
              </p>
              <p>c) Checkout Compliance — Every checkout clearly states: “You are purchasing a digital product. This purchase includes bonus support votes for Contestant XYZ.”</p>
              <p>d) Refunds & Chargebacks — Digital product purchases are non-tangible digital goods. Refunds and chargebacks are governed by our Refund & Chargeback Policy.</p>
              <p>
                e) Mapping Example (illustrative): $10 → 10 bonus votes; $25 → 30 bonus votes; $50 → 80 bonus votes. Exact mappings and promotions will be published on the product
                pages.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">6. Vote Recording & Transparency</h3>
            <div className="space-y-2">
              <p>
                a) Each counted vote will be recorded with the following metadata: email (if applicable), IP address, timestamp, vote source (free / paid), and transaction ID for
                paid votes.
              </p>
              <p>b) The Organizer will maintain an auditable Final Count Report and can produce transaction logs for auditing purposes (for example, in a Stripe review).</p>
              <p>
                c) Live or delayed leaderboard display options will be published on the website. The Organizer will state whether rankings are real-time or displayed with a short
                delay for verification.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">7. Anti-Fraud & Disqualification</h3>
            <div className="space-y-2">
              <p>
                a) Fraud Detection — The platform uses fraud detection measures (IP analysis, device fingerprinting, rate limiting, CAPTCHA, flagged VPN traffic) to identify and
                block illegitimate voting.
              </p>
              <p>
                b) Duplicate or Fraudulent Votes — Votes identified as duplicate, automated, purchased via deceptive means, or otherwise suspicious will be invalidated and excluded
                from totals.
              </p>
              <p>
                c) Disqualification — Contestants found to have engaged in vote manipulation, bribery, multiple-account schemes, or violation of these Rules may be disqualified at
                the Organizer’s sole discretion.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">8. Tie-Breakers</h3>
            <div className="space-y-2">
              <p>
                a) If two or more Contestants have the same verified vote total for a prize position, the Organizer will apply the pre-published tie-break procedure (for example:
                earliest verified vote received; most unique verified email voters; or internal judge determination for secondary awards). Tie-break rules will be posted on the
                Voting Explanation Page before voting opens.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">9. Prizes & Fulfillment</h3>
            <div className="space-y-2">
              <p>
                a) Prize details (cash amount, magazine cover, photo shoot, other perks) will be listed on the contest page. The Organizer reserves the right to substitute a prize
                of equal or greater value if necessary.
              </p>
              <p>b) Taxes and any additional costs associated with prize acceptance are the sole responsibility of the prize winner.</p>
              <p>c) The Organizer will publish timelines and required documentation for prize fulfillment. A winner must provide valid ID to claim certain prizes (e.g., cash).</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">10. Publicity & Licenses</h3>
            <div className="space-y-2">
              <p>
                a) By entering, Contestants grant the Organizer a worldwide, royalty-free, transferable license to use submitted photos, videos, bios and promotional materials for
                the Contest and related promotion (digital and print).
              </p>
              <p>b) Winners may be required to sign additional release forms for magazine publication, advertising, and promotional appearances.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">11. Charity & Donations (Optional)</h3>
            <div className="space-y-2">
              <p>
                a) If the Organizer designates a charity and a donation percentage for sales, the Contest page will clearly state the charity name, percentage donated, and how
                donation receipts will be published.
              </p>
              <p>b) Charity commitments will be honored as published and donation receipts made available after reconciliation.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">12. Payments, Refunds & Chargebacks</h3>
            <div className="space-y-2">
              <p>a) All paid purchases are processed by third-party payment processors (e.g., Stripe, Razorpay, PayPal). The Organizer does not store full card data.</p>
              <p>
                b) Digital products and bonus votes are non-tangible digital goods. Refunds and chargebacks are governed by the Organizer's Refund & Chargeback Policy (linked on
                the website). Excessive chargebacks may lead to purchase reversal and disqualification of associated bonus votes.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">13. Limitation of Liability & Dispute Resolution</h3>
            <div className="space-y-2">
              <p>
                a) To the maximum extent permitted by law, the Organizer and its affiliates are not responsible for technical failures, unauthorized intervention, or any events
                beyond their control that may affect the integrity of the Competition.
              </p>
              <p>
                b) Any disputes arising from or relating to the Competition will be resolved first through good-faith negotiation. If unsuccessful, disputes will be resolved by
                binding arbitration in the jurisdiction specified in the Terms & Conditions, unless local law requires otherwise.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">14. Amendments</h3>
            <div className="space-y-2">
              <p>
                a) The Organizer reserves the right to amend these Official Rules, terminate the Competition, or change voting mechanics at any time for reasons including, but not
                limited to, fraud prevention, compliance with payment processors, or legal requirements. Material changes will be posted on the site with an updated "Last Updated"
                date.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">15. Audits & Stripe Compliance</h3>
            <div className="space-y-2">
              <p>
                a) The Organizer maintains detailed transaction logs, vote metadata, and the Final Count Report to support audits by payment processors (e.g., Stripe). These
                records include timestamps, transaction IDs, IP addresses, and vote source classification.
              </p>
              <p>
                b) The Organizer will provide a clear explanation to payment processors that purchases are for digital goods and that bonus votes are a support mechanism, not a
                gambling mechanism. Charity donations (if any) and transparent refund policies will be included in Stripe application materials.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">16. How to Contact Us</h3>
            <p>For questions, dispute notices, or requests relating to these Official Rules, contact:</p>
            <div className="mt-2 space-y-1">
              <p>
                <strong>Email:</strong> <a href="mailto:submit@swingboudoirmag.com">submit@swingboudoirmag.com</a>
              </p>
              <p>
                <strong>Competition Support:</strong> <a href="mailto:submit@swingboudoirmag.com">submit@swingboudoirmag.com</a>
              </p>
              <p>
                <strong>Address</strong>
                <br />
                Swing Boudoir Magazine
                <br />
                30 N Gould St STE
                <br />
                Sheridan, WY 82801
                <br />
                United States
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">17. Acceptance of Rules</h3>
            <p>
              By participating in the Competition (including voting or submitting an entry), you acknowledge that you have read, understood, and agree to be bound by these Official
              Rules and any decisions made by the Organizer, which are final and binding in all respects.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
