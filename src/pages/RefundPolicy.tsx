import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <CreditCard className="h-16 w-16 mx-auto text-brand-blue mb-4" />
            <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
            <p className="text-lg text-slate-700">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Fortitude Network, operated by Setidure Technologies Pvt. Ltd., we are committed to 
                providing valuable support services to our cancer support community. This refund policy 
                outlines the conditions under which refunds may be processed.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. Support Contributions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Support contributions made to Fortitude Network are generally non-refundable as they 
                help us maintain and improve our platform services. However, we may consider refunds 
                in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Technical errors resulting in duplicate payments</li>
                <li>Unauthorized transactions (subject to investigation)</li>
                <li>Service unavailability for extended periods</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. Refund Request Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To request a refund:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact us within 30 days of the payment</li>
                <li>Provide transaction details and reason for refund</li>
                <li>Allow 5-7 business days for review</li>
                <li>Approved refunds will be processed within 10-14 business days</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Event Tickets and Paid Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>For specific events or paid services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cancellations 48 hours before the event: Full refund</li>
                <li>Cancellations 24-48 hours before: 50% refund</li>
                <li>Cancellations less than 24 hours: No refund</li>
                <li>Event cancellation by us: Full refund</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Processing Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Approved refunds will be processed back to the original payment method within 10-14 business days. 
                The time it takes for the refund to appear in your account may vary depending on your bank or 
                payment provider.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>6. Non-Refundable Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The following are non-refundable:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>General platform support contributions after 30 days</li>
                <li>Services already consumed or utilized</li>
                <li>Digital content or resources that have been accessed</li>
                <li>Administrative or processing fees</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>7. Contact for Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To request a refund or ask questions about this policy, contact us at:{" "}
                <a href="mailto:refunds@fortitudenetwork.in" className="text-brand-blue hover:underline">
                  refunds@fortitudenetwork.in
                </a>
              </p>
              <p className="mt-4">
                <strong>Setidure Technologies Pvt. Ltd.</strong><br />
                Email: support@setidure.com<br />
                Response time: 2-3 business days
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-amber-800">
                <strong>Note:</strong> This refund policy is subject to change. We will notify users of any 
                significant changes via email or platform notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;