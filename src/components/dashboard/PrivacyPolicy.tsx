import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Privacy & Data Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, participate in competitions, or contact us for support.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide and maintain our services</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To communicate with you about products, services, and events</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Your Rights</h3>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}