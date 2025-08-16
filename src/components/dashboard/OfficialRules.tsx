import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale } from "lucide-react";

export function OfficialRules() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Official Rules</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="mr-2 h-5 w-5" />
            Contest Rules & Regulations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">Swing Boudoir Ultimate Cover Model Competition</h3>
            <p className="text-muted-foreground">
              These Official Rules govern the Swing Boudoir Ultimate Cover Model Competition ("Competition"). 
              By entering, you agree to be bound by these rules and the decisions of the judges, which are final and binding.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1. Eligibility</h3>
            <div className="text-muted-foreground space-y-2">
              <p>To be eligible for the Competition, you must:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be 18 years of age or older at the time of entry</li>
                <li>Be a legal resident of an eligible country (restrictions may apply)</li>
                <li>Have a valid government-issued photo identification</li>
                <li>Possess all necessary rights to submitted photos and content</li>
                <li>Not be an employee, contractor, or immediate family member of Swing Boudoir Magazine or its affiliates</li>
                <li>Agree to appear in promotional materials if selected as a winner</li>
              </ul>
              <p>Models with existing exclusive contracts with competing publications may be restricted from participation.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Entry Requirements & Process</h3>
            <div className="text-muted-foreground space-y-2">
              <p><strong>To Enter:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Reply "I'M IN" to our official competition announcement</li>
                <li>Complete the onboarding form sent by Swing Boudoir</li>
                <li>Submit 3-5 high-quality photos meeting our technical standards</li>
                <li>Provide valid contact information and social media handles</li>
                <li>Accept these Official Rules and Privacy Policy</li>
              </ul>
              <p><strong>Photo Requirements:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>High-resolution images (minimum 1080x1080 pixels)</li>
                <li>Professional quality with good lighting and composition</li>
                <li>Appropriate for boudoir/fashion modeling content</li>
                <li>No watermarks, logos, or third-party branding</li>
                <li>Must be original work owned by contestant</li>
              </ul>
              <p><strong>Entry is 100% FREE.</strong> No purchase necessary to enter or win.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Competition Timeline</h3>
            <div className="text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Entry Confirmation Deadline:</strong> [Insert specific date]</li>
                <li><strong>Voting Opens:</strong> [Insert specific date and time]</li>
                <li><strong>Voting Closes:</strong> [Insert specific date and time]</li>
                <li><strong>Winner Announcement:</strong> Within 48 hours of voting closure</li>
                <li><strong>Magazine Issue Release:</strong> [Insert month/year]</li>
              </ul>
              <p>All times are in [Time Zone]. Swing Boudoir reserves the right to modify dates with advance notice.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Voting Process & Rankings</h3>
            <div className="text-muted-foreground space-y-2">
              <p><strong>Free Voting:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>One free vote per verified email address per 24-hour period</li>
                <li>Email verification required for all free votes</li>
                <li>IP address tracking to prevent fraud</li>
              </ul>
              <p><strong>Premium Voting (Optional):</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Additional votes may be purchased to support favorite contestants</li>
                <li>All payments processed through secure third-party providers</li>
                <li>No refunds on vote purchases</li>
              </ul>
              <p><strong>Voter Rewards:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Voters can spin the reward wheel for chances to win extra votes, exclusive content access, and digital magazine copies</li>
                <li>Prizes awarded randomly and subject to availability</li>
              </ul>
              <p><strong>Rankings:</strong> Real-time leaderboard updates may be shared throughout the competition period. Final rankings determined by total vote count at competition close.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Prizes & Awards</h3>
            <div className="text-muted-foreground space-y-2">
              <p><strong>🥇 1st Place Winner (Most Votes Overall):</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>$999 cash prize (subject to applicable taxes)</li>
                <li>Front & Back Cover Feature in Swing Boudoir Magazine</li>
                <li>Full-length editorial interview</li>
                <li>Instagram collaboration post from our verified page</li>
                <li>Complimentary digital magazine copy</li>
                <li>30-day website spotlight on SwingBoudoir.com</li>
              </ul>
              <p><strong>🖐 Top 5 Models:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Magazine interview feature</li>
                <li>Instagram collaboration post</li>
                <li>Permanent listing in "Final 5" Hall of Fame</li>
                <li>Early access to next edition features</li>
              </ul>
              <p><strong>🔟 Top 10 Models:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Digital magazine interview</li>
                <li>Instagram collaboration post</li>
                <li>Spotlight in "Top Boudoir Stars to Watch" segment</li>
              </ul>
              <p><strong>Prize Conditions:</strong> Winners must claim prizes within 30 days. Cash prizes subject to tax reporting requirements. Non-cash prizes have no monetary value and are non-transferable.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. Contestant Responsibilities</h3>
            <div className="text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Actively promote personal voting links across social media platforms</li>
                <li>Maintain professional conduct throughout the competition</li>
                <li>Respond to Swing Boudoir communications in a timely manner</li>
                <li>Be available for winner interviews and promotional activities</li>
                <li>Comply with all applicable laws and platform terms of service</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">7. Prohibited Conduct & Disqualification</h3>
            <div className="text-muted-foreground space-y-2">
              <p>The following actions may result in immediate disqualification:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vote manipulation, fraud, or use of automated voting systems</li>
                <li>Harassment of other contestants, voters, or Swing Boudoir staff</li>
                <li>Submission of inappropriate, offensive, or copyrighted content</li>
                <li>False information in application or promotional materials</li>
                <li>Violation of social media platform terms while promoting the competition</li>
                <li>Any attempt to compromise the integrity of the competition</li>
              </ul>
              <p>Swing Boudoir reserves the right to investigate suspicious activity and disqualify contestants at its sole discretion. All decisions are final.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">8. Intellectual Property & Media Rights</h3>
            <div className="text-muted-foreground space-y-2">
              <p>By entering the competition, contestants grant Swing Boudoir:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Rights to use submitted photos in competition promotions and materials</li>
                <li>Permission to feature contestant names, photos, and likenesses in magazine and digital content</li>
                <li>Rights to create derivative works for promotional purposes</li>
                <li>License to use competition-related content across all media platforms</li>
              </ul>
              <p>Contestants retain ownership of original photos but grant Swing Boudoir perpetual, worldwide, royalty-free license for competition and promotional use.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">9. Limitation of Liability</h3>
            <p className="text-muted-foreground">
              Swing Boudoir Magazine and its affiliates are not responsible for technical failures, 
              lost or delayed entries, voting irregularities beyond our control, or any damages arising 
              from participation in this competition. Contestants participate at their own risk.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">10. Modifications & Cancellation</h3>
            <p className="text-muted-foreground">
              Swing Boudoir reserves the right to modify these rules, extend deadlines, or cancel 
              the competition if circumstances warrant such action. Participants will be notified 
              of any material changes via email and social media announcements.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">11. Governing Law & Disputes</h3>
            <p className="text-muted-foreground">
              These Official Rules are governed by the laws of [State/Country]. Any disputes arising 
              from this competition shall be resolved through binding arbitration. Winners may be 
              required to sign additional legal documents before receiving prizes.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">12. Contact Information</h3>
            <div className="text-muted-foreground">
              <p>For questions about these Official Rules or the competition:</p>
              <p><strong>Email:</strong> competition@swingboudoir.com</p>
              <p><strong>Support:</strong> support@swingboudoir.com</p>
              <p><strong>Address:</strong><br/>
              Swing Boudoir Magazine<br/>
              [Business Address]<br/>
              [City, State, ZIP Code]</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}