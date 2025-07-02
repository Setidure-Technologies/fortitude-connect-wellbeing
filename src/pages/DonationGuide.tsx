
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, CreditCard, Users, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const DonationGuide = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="h-16 w-16 mx-auto text-brand-blue mb-4" />
          <h1 className="text-4xl font-bold mb-4">How to Support Our Mission</h1>
          <p className="text-lg text-slate-600">
            Learn how your donations help us support cancer patients and their families
          </p>
        </div>

        <div className="space-y-8">
          {/* Why Donate */}
          <Card>
            <CardHeader>
              <CardTitle>Why Your Support Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                Fortitude Network is a non-profit platform dedicated to providing free support for cancer patients, survivors, and their families. 
                Every donation helps us maintain and expand our services to reach more people in need.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto text-brand-blue mb-3" />
                  <h3 className="font-semibold mb-2">Community Support</h3>
                  <p className="text-sm text-slate-600">
                    Fund moderated support groups and community events
                  </p>
                </div>
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-brand-teal mb-3" />
                  <h3 className="font-semibold mb-2">Platform Maintenance</h3>
                  <p className="text-sm text-slate-600">
                    Keep our AI support and community features running 24/7
                  </p>
                </div>
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto text-brand-purple mb-3" />
                  <h3 className="font-semibold mb-2">Real-World Impact</h3>
                  <p className="text-sm text-slate-600">
                    Support blood drives, wellness outings, and awareness campaigns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Donate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-brand-blue" />
                How to Donate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Step 1: Choose Your Amount</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Every contribution makes a difference. You can donate any amount that feels comfortable for you.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm text-slate-700 space-y-1">
                      <p><strong>$25</strong> - Supports one person's access for a month</p>
                      <p><strong>$50</strong> - Funds a support group session</p>
                      <p><strong>$100</strong> - Sponsors a community workshop</p>
                      <p><strong>$250</strong> - Supports platform maintenance for a week</p>
                    </div>
                  </div>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80" 
                    alt="Donation process - secure online giving" 
                    className="w-full h-48 object-cover rounded-lg" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Step 2: Secure Payment</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    We use PayPal for secure payment processing. You can donate with:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 mb-4">
                    <li>• Credit or debit cards</li>
                    <li>• PayPal account</li>
                    <li>• Bank transfer</li>
                    <li>• One-time or recurring donations</li>
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Shield className="h-4 w-4" />
                    <span>All transactions are secure and encrypted</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Step 3: Optional Message</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Add a personal message of support that will be shared with the community (if you choose).
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Share why you're supporting the cause</li>
                    <li>• Offer words of encouragement</li>
                    <li>• Dedicate your donation to someone special</li>
                    <li>• Choose to remain anonymous if preferred</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Stories */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact in Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 mb-4">
                See how donations have made a real difference in our community:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-brand-blue/5 p-4 rounded-lg border-l-4 border-brand-blue">
                  <h4 className="font-semibold text-brand-blue mb-2">Community Events Funded</h4>
                  <p className="text-sm text-slate-600">
                    "Thanks to donations, we've been able to host monthly support groups that have helped over 200 families 
                    connect and find strength together."
                  </p>
                </div>
                <div className="bg-brand-teal/5 p-4 rounded-lg border-l-4 border-brand-teal">
                  <h4 className="font-semibold text-brand-teal mb-2">Platform Accessibility</h4>
                  <p className="text-sm text-slate-600">
                    "Donations help us keep the platform free for everyone, ensuring that financial constraints never 
                    prevent someone from accessing support when they need it most."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ready to Donate */}
          <Card>
            <CardHeader>
              <CardTitle>Ready to Make a Difference?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-6">
                Your support helps us continue providing free, accessible support to cancer patients and their families worldwide.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/donate">Donate Now</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/stories">Read Impact Stories</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationGuide;
