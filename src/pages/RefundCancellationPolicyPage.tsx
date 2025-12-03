import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Undo2 } from "lucide-react";

export function RefundCancellationPolicyPage(): JSX.Element {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Refund & Cancellation Policy</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground font-bold">
            <Undo2 className="mr-2 h-5 w-5" />
            Refund & Cancellation Terms
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-muted-foreground">
          {/* Last Updated */}
          <section>
            <p className="mb-2">
              <strong>Last Updated:</strong> December 2, 2025
            </p>
            <p>
              This Refund & Cancellation Policy applies to all digital product purchases, contestant upgrades, and bonus vote allocations associated with the Swing Boudoir Ultimate
              Cover Model Competition ("Competition"). By completing a purchase, you agree to this policy.
            </p>
          </section>

          {/* 1. Nature of Digital Goods */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">1. All Products Are Non-Refundable (Digital Goods)</h3>
            <p>
              All purchases made through our platform are for <strong>non-tangible digital goods</strong>, including but not limited to:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>Digital magazines and features</li>
              <li>Photo packs and exclusive media</li>
              <li>Digital wallpapers or bundles</li>
              <li>Contestant upgrade packages</li>
              <li>Bonus support votes included with digital goods</li>
            </ul>
            <p className="mt-3">
              Because these products are delivered instantly and cannot be “returned,” all sales are
              <strong>final and non-refundable</strong>.
            </p>
          </section>

          {/* 2. No Refunds for Votes */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">2. No Refunds for Bonus Votes</h3>
            <p>
              Bonus support votes are granted as part of a digital product purchase. They are not sold separately and are not eligible for refunds, reversals, or cancellation once
              issued.
            </p>
            <p className="mt-2">
              <strong>All vote allocations are final.</strong> Vote totals cannot be reversed or adjusted after a completed transaction.
            </p>
          </section>

          {/* 3. Payment Errors */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">3. Payment Errors or Duplicate Charges</h3>
            <p>
              If you believe you were charged incorrectly (e.g., duplicate charge, incorrect amount), contact us within <strong>72 hours</strong> at:
            </p>
            <p className="mt-2 font-medium">submit@swingboudoirmag.com</p>

            <p className="mt-4">We will assist with:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Duplicate payment detection</li>
              <li>Incorrect transaction amount</li>
              <li>Technical issues during checkout</li>
            </ul>
            <p className="mt-2">Valid payment errors will be reviewed and refunded if confirmed by our payment processor (Stripe, Razorpay, PayPal).</p>
          </section>

          {/* 4. Chargebacks */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">4. Chargebacks & Disputes</h3>
            <p>
              Filing a chargeback for a legitimate digital purchase may result in the removal of bonus votes associated with that transaction. Excessive or fraudulent chargebacks
              may lead to:
            </p>

            <ul className="list-disc list-inside mt-2">
              <li>Vote reversal</li>
              <li>Temporary suspension of your account</li>
              <li>Permanent disqualification of the Contestant (if abuse is confirmed)</li>
            </ul>

            <p className="mt-2">To avoid misunderstandings, contact our support team before filing a dispute. We are happy to help resolve issues directly and quickly.</p>
          </section>

          {/* 5. Contestant Cancellations */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">5. Contestant Withdrawal or Disqualification</h3>
            <p>
              If a Contestant withdraws, is removed, or is disqualified for violating Competition Rules,
              <strong>no refunds</strong> will be issued for previously purchased digital goods or bonus votes associated with that Contestant.
            </p>
          </section>

          {/* 6. Technical Failures */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">6. Technical Issues During Voting</h3>
            <p>
              In the event of server errors, incomplete transactions, or technical failures, we will assist in restoring access to purchased digital goods and ensuring votes are
              credited correctly.
            </p>
            <p className="mt-2">If your payment was captured but votes were not applied, our team will assign them manually after verification.</p>
          </section>

          {/* 7. Special Promotions */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">7. Special Promotions or Bonus Multipliers</h3>
            <p>
              Promotional events (2x, 5x, 10x bonus vote days), coupon codes, discounts, and limited-time bundles are all final. No refunds will be issued once a promotion is
              redeemed.
            </p>
          </section>

          {/* 8. No Cancellation After Purchase */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">8. No Cancellation After Purchase</h3>
            <p>Since digital products are delivered immediately upon checkout, purchases cannot be canceled once completed. Orders are processed in real time.</p>
          </section>

          {/* 9. Contact */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">9. Contact Us</h3>
            <p>For questions, billing support, or refund-related inquiries, contact our support team:</p>

            <div className="mt-2 space-y-1">
              <p>Email: submit@swingboudoirmag.com</p>
              <p>Competition Support: submit@swingboudoirmag.com</p>
              <p>
                BUNTECH LLC
                <br />
                DBA Swing Boudoir Magazine
                <br />
                30 N Gould St STE
                <br />
                Sheridan, WY 82801
                <br />
                United States
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
