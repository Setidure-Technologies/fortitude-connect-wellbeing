
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, ShieldCheck } from "lucide-react";

const Donate = () => {
  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Support Our Mission</h1>
            <p className="text-lg text-slate-700 mb-6">
              Fortitude Network is a non-profit initiative dedicated to providing free support for cancer patients and their families. Your donation helps us maintain our platform, develop new resources, and organize impactful community campaigns.
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Your contribution makes a difference.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  We are currently setting up our secure donation portal. Please check back soon to contribute. Thank you for your support!
                </p>
                <Button size="lg" className="w-full" disabled>
                  <Heart className="mr-2 h-4 w-4" /> Donate Securely (Coming Soon)
                </Button>
                <div className="flex items-center justify-center text-xs text-slate-500">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Secure Payment Processing
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">How Your Donation Helps</h2>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start">
                <Heart className="h-5 w-5 text-brand-blue mt-1 mr-3 flex-shrink-0" />
                <span><span className="font-semibold">Maintain Our Platform:</span> Keep our community hub, AI bot, and resource library running and accessible to all, for free.</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-5 w-5 text-brand-blue mt-1 mr-3 flex-shrink-0" />
                <span><span className="font-semibold">Fund Campaigns:</span> Power real-world initiatives like blood donation drives and wellness outings for patients.</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-5 w-5 text-brand-blue mt-1 mr-3 flex-shrink-0" />
                <span><span className="font-semibold">Expand Resources:</span> Allow us to partner with mental health professionals and create more high-quality support content.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
