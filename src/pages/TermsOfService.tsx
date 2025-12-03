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
            Swing Boudoir – Terms of Service
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 1. Acceptance */}
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing BUNTECH LLC, doing business as Swing Boudoir, or participating in the Swing Boudoir Ultimate Cover Model Competition ("Competition"), you agree to be
              bound by these Terms of Service. If you do not agree, please discontinue use of the platform immediately.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h3 className="text-lg font-semibold mb-3">2. Eligibility</h3>
            <p className="text-muted-foreground">
              You must be at least 18 years old to participate. By registering, you confirm that all information provided is accurate and that your participation complies with
              applicable laws in your region.
            </p>
          </section>

          {/* 3. Nature of the Competition */}
          <section>
            <h3 className="text-lg font-semibold mb-3">3. Nature of the Competition</h3>
            <p className="text-muted-foreground">
              The Competition is a skill-based promotional contest. Winners are determined solely by the total number of verified votes they receive. No element of chance, lottery,
              or gambling is present.
              <br />
              <br />
              <strong>No purchase is necessary to participate or vote.</strong> A free voting method is always available.
            </p>
          </section>

          {/* 4. User Accounts */}
          <section>
            <h3 className="text-lg font-semibold mb-3">4. User Accounts</h3>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account. All actions performed under your account are your responsibility. Please notify us
              immediately of any unauthorized access.
            </p>
          </section>

          {/* 5. Digital Products & Paid Support Votes */}
          <section>
            <h3 className="text-lg font-semibold mb-3">5. Digital Products & Support Votes</h3>
            <p className="text-muted-foreground">
              Swing Boudoir sells digital products such as magazines, photo sets, or digital credits. When you purchase a digital product, you may receive{" "}
              <strong>bonus support votes</strong> as a promotional reward.
              <br />
              <br />
              Support votes are not a product or service being sold and do not guarantee any outcome in the Competition.
            </p>
          </section>

          {/* 6. Free Voting */}
          <section>
            <h3 className="text-lg font-semibold mb-3">6. Free Voting</h3>
            <p className="text-muted-foreground">
              Users may cast free votes daily through email verification or other verification methods. Free voting ensures all participants have equal opportunity without making a
              purchase.
            </p>
          </section>

          {/* 7. Payments & Refunds */}
          <section>
            <h3 className="text-lg font-semibold mb-3">7. Payments & Refunds</h3>
            <p className="text-muted-foreground">
              Purchases of digital products are final and non-refundable except where required by law. Payments are processed securely by third-party payment providers such as
              Stripe.
              <br />
              <br />
              Attempting to dispute valid payments or performing chargeback abuse may result in account suspension and removal from the Competition.
            </p>
          </section>

          {/* 8. Content Rights */}
          <section>
            <h3 className="text-lg font-semibold mb-3">8. Intellectual Property & Content Rights</h3>
            <p className="text-muted-foreground">
              Participants retain ownership of their submitted content. By submitting content, you grant Swing Boudoir a non-exclusive, royalty-free license to use, reproduce, and
              display your content for Competition-related and promotional purposes.
            </p>
          </section>

          {/* 9. Prohibited Conduct */}
          <section>
            <h3 className="text-lg font-semibold mb-3">9. Prohibited Activities</h3>
            <p className="text-muted-foreground">
              Users may not engage in fraudulent voting, use bots or scripts, impersonate others, upload harmful content, interfere with platform operations, or violate any
              applicable laws. Violations may result in suspension or permanent account termination.
            </p>
          </section>

          {/* 10. Competition Integrity */}
          <section>
            <h3 className="text-lg font-semibold mb-3">10. Competition Integrity</h3>
            <p className="text-muted-foreground">
              Swing Boudoir reserves the right to review, audit, and verify votes. Fraudulent or suspicious voting may be removed. Vote totals displayed on the platform may be
              subject to verification.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h3 className="text-lg font-semibold mb-3">11. Limitation of Liability</h3>
            <p className="text-muted-foreground">
              The platform and services are provided "as is" without warranties of any kind. Swing Boudoir is not liable for service interruptions, technical issues, lost data, or
              damages resulting from use of the platform or third-party services.
            </p>
          </section>

          {/* 12. Changes to Terms */}
          <section>
            <h3 className="text-lg font-semibold mb-3">12. Changes to These Terms</h3>
            <p className="text-muted-foreground">
              Swing Boudoir may update these Terms at any time. Continued use of the platform after changes are published constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* 13. Contact */}
          <section>
            <h3 className="text-lg font-semibold mb-3">13. Contact Information</h3>
            <p className="text-muted-foreground">
              For questions regarding these Terms, please contact us:
              <br />
              📧{" "}
              <a href="mailto:submit@swingboudoirmag.com" className="underline">
                submit@swingboudoirmag.com
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
