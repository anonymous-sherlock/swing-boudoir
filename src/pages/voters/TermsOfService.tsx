import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Swing Boudoir – Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing and participating in Swing Boudoir Ultimate Cover Model Competition, you agree to be bound by these Terms of Service. 
              If you do not agree, please discontinue use of the platform.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Eligibility</h3>
            <p className="text-muted-foreground">
              You must be at least 18 years old to register or participate. By using this platform, you confirm that you meet eligibility requirements 
              and that your participation complies with applicable laws and regulations.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. User Accounts</h3>
            <p className="text-muted-foreground">
              Participants are responsible for maintaining the confidentiality of their account details. You accept liability for all activities 
              carried out under your account and agree to notify Swing Boudoir immediately in case of unauthorized access.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Content Guidelines</h3>
            <p className="text-muted-foreground">
              All content submitted must be original and comply with community standards. Content that is defamatory, infringing, 
              obscene, or otherwise inappropriate will be removed at the sole discretion of Swing Boudoir.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Payments & Refunds</h3>
            <p className="text-muted-foreground">
              Premium features, such as paid voting or promotional services, may require payment. Payments are processed securely 
              through third-party providers. All sales are final unless otherwise required by law.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. Intellectual Property</h3>
            <p className="text-muted-foreground">
              Participants retain ownership of their content but grant Swing Boudoir a non-exclusive, royalty-free, worldwide license 
              to use, reproduce, and display submitted content in relation to the competition and promotional activities.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">7. Prohibited Activities</h3>
            <p className="text-muted-foreground">
              You may not manipulate votes, impersonate others, upload harmful material, or otherwise interfere with the platform. 
              Any violation may result in suspension or permanent account termination.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">8. Limitation of Liability</h3>
            <p className="text-muted-foreground">
              The platform is provided “as is” without warranties of any kind. Swing Boudoir is not responsible for interruptions, data loss, 
              or damages arising from use of the Service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">9. Changes to Terms</h3>
            <p className="text-muted-foreground">
              Swing Boudoir may update these Terms from time to time. Continued use of the platform after changes have been posted 
              constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">10. Contact Information</h3>
            <p className="text-muted-foreground">
              For questions regarding these Terms, please contact us at: <br />
              📧 <a href="mailto:submit@swingboudoirmag.com" className="underline">submit@swingboudoirmag.com</a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
