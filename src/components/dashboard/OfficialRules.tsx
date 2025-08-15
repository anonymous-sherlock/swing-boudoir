import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale } from "lucide-react";

export function OfficialRules() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h3 className="text-lg font-semibold mb-3">1. Eligibility</h3>
            <p className="text-muted-foreground">
              Participants must be 18 years or older and legal residents of eligible countries. 
              Employees and family members of contest organizers are not eligible to participate.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Entry Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Complete profile registration with valid information</li>
              <li>Upload required photos meeting quality standards</li>
              <li>Agree to all terms and conditions</li>
              <li>Submit entry before deadline</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Voting Process</h3>
            <p className="text-muted-foreground">
              Voting is conducted through our secure platform. Each user receives one free vote per 24-hour period. 
              Additional premium votes may be purchased. All votes are subject to fraud detection systems.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. Prize Distribution</h3>
            <p className="text-muted-foreground">
              Winners will be contacted within 48 hours of contest conclusion. Prizes must be claimed within 30 days. 
              Winners may be required to complete tax forms and provide identification.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. Disqualification</h3>
            <p className="text-muted-foreground">
              Participants may be disqualified for fraudulent voting, inappropriate content, 
              or violation of community guidelines. All decisions are final.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}