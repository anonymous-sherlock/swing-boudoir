import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground">
              By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. User Accounts</h3>
            <p className="text-muted-foreground">
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Content Guidelines</h3>
            <p className="text-muted-foreground">
              All uploaded content must comply with our community guidelines. Inappropriate, offensive, or copyrighted material is prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Payment Terms</h3>
            <p className="text-muted-foreground">
              All payments for premium services are processed securely. Refunds are subject to our refund policy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Limitation of Liability</h3>
            <p className="text-muted-foreground">
              The platform is provided "as is" without warranties. We are not liable for any damages arising from use of the service.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}