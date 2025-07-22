import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="h-16 w-16 mx-auto text-brand-blue mb-4" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-slate-700">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing and using Fortitude Network, you accept and agree to be bound by the terms 
                and provision of this agreement. Fortitude Network is operated by Setidure Technologies Pvt. Ltd.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Fortitude Network is a cancer support platform that provides:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Community support and connection services</li>
                <li>Educational resources and information</li>
                <li>AI-powered assistance and chat features</li>
                <li>Event organization and participation</li>
                <li>Mental health and wellness support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Users agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Respect other community members</li>
                <li>Not share inappropriate or harmful content</li>
                <li>Maintain confidentiality of others' personal information</li>
                <li>Follow community guidelines and platform rules</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Medical Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold text-red-600">
                IMPORTANT: Fortitude Network does not provide medical advice.
              </p>
              <p>
                The information provided on this platform is for educational and support purposes only. 
                It is not intended as a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified health provider with any questions 
                you may have regarding a medical condition.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we 
                collect, use, and protect your information.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Setidure Technologies Pvt. Ltd. shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of Fortitude Network.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We reserve the right to terminate or suspend your account at any time for violation of these terms 
                or for any other reason we deem necessary to protect our community.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For questions about these Terms of Service, contact us at:{" "}
                <a href="mailto:legal@fortitudenetwork.in" className="text-brand-blue hover:underline">
                  legal@fortitudenetwork.in
                </a>
              </p>
              <p className="mt-4">
                <strong>Setidure Technologies Pvt. Ltd.</strong><br />
                Email: support@setidure.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;