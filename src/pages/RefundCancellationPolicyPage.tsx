import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function RefundCancellationPolicyPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <h1 className="text-2xl font-bold text-foreground">Refund & Cancellation Policy</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-foreground font-bold">
            <Shield className="mr-2 h-5 w-5" />
            Refund & Cancellation Terms
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <section className="text-muted-foreground">
            <p>
              <h4 className="text-lg font-bold text-foreground mb-3">Swing Boudoir</h4>
              manages the Ultimate Cover Model Competition ("Service"), which includes entry payments, optional upgrades, paid voting credits, and promotional services.
            </p>
            <p>By submitting entries, purchasing upgrades, or participating in the competition, you acknowledge and agree to the following Refund & Cancellation Policy.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">1. 3-Day Refund Window (Entry Fee & Upgrades)</h3>
            <p className="text-muted-foreground">
              You are eligible for a refund within <strong>3 days (72 hours)</strong> of payment IF:
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Your profile has not been published or approved by the contest team.</li>
              <li>You have not used any included promotional services or digital upgrades.</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              After 3 days or once services are delivered, <strong>payments become non-refundable.</strong>
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">2. Paid Votes / Voting Credits Are Non-Refundable</h3>
            <p className="text-muted-foreground">
              Paid votes are applied instantly to the leaderboard and therefore
              <strong>cannot be reversed or refunded</strong> under any circumstance.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">3. Cancellations</h3>
            <p className="text-muted-foreground">
              Contestants may cancel participation at any time; however, no refund will be provided after the 3-day window or after services are rendered.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">4. Chargebacks & Payment Disputes</h3>
            <p className="text-muted-foreground">Unauthorized chargebacks may result in:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Contestant disqualification</li>
              <li>Removal of votes and progress</li>
              <li>Legal recovery of dispute costs</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-foreground mb-3">5. Contact for Refund Requests</h3>
            <p className="text-muted-foreground">Refund requests must be emailed within 3 days of purchase:</p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> submit@swingboudoirmag.com
            </p>
            <p className="text-muted-foreground mt-2">Please include your name, email, and payment receipt for faster processing.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
