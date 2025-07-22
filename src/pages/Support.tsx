
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ShieldCheck, Users, Calendar, BookOpen, CheckCircle, Gift, Crown, Calculator } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Support = () => {
  const [customAmount, setCustomAmount] = useState<string>("");

  // Fetch community stats and support totals
  const { data: stats } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const [statsResponse, supportResponse] = await Promise.all([
        supabase.from('community_stats').select('*').single(),
        supabase.from('donations').select('amount').eq('status', 'completed')
      ]);
      
      if (statsResponse.error) throw statsResponse.error;
      
      const totalSupport = supportResponse.data?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
      
      return {
        ...statsResponse.data,
        total_donations: totalSupport
      };
    },
  });

  const supportTiers = [
    {
      tier: 1,
      name: "Supporter",
      range: "₹500 - ₹1,999",
      amount: 500,
      maxAmount: 1999,
      benefits: [
        "Recognition Certificate",
        "Name Featured on Website"
      ],
      icon: CheckCircle,
      color: "border-brand-green bg-green-50"
    },
    {
      tier: 2,
      name: "Advocate",
      range: "₹2,000 - ₹7,999",
      amount: 2000,
      maxAmount: 7999,
      benefits: [
        "All Tier 1 benefits",
        "Event Notifications",
        "2 Paid Event Passes",
        "Gift Hamper"
      ],
      icon: Gift,
      color: "border-brand-teal bg-teal-50"
    },
    {
      tier: 3,
      name: "Patron",
      range: "₹8,000+",
      amount: 8000,
      maxAmount: null,
      benefits: [
        "All Tier 2 Benefits",
        "VIP Event Access for 1 Year",
        "Super Hamper",
        "Spotlight at Events & Online"
      ],
      icon: Crown,
      color: "border-brand-purple bg-purple-50"
    }
  ];

  const handleCustomAmountSupport = () => {
    const amount = parseFloat(customAmount);
    if (amount < 500) {
      alert("Minimum support amount is ₹500");
      return;
    }
    // Payment integration coming soon
    alert("Payment integration coming soon. Please contact us directly for support.");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Heart className="h-16 w-16 mx-auto text-brand-blue mb-4" />
            <h1 className="text-4xl font-bold mb-4">Support Fortitude Network — Join Our Circle of Impact</h1>
            <p className="text-lg text-slate-700 max-w-3xl mx-auto">
              Choose a support tier that aligns with your commitment to our cancer support community. 
              Your subscription helps us maintain and enhance our platform for patients and families worldwide.
            </p>
          </div>

          {/* Support Tier Cards with Direct Payment Buttons */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {supportTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card 
                  key={tier.tier}
                  className={`transition-all duration-200 hover:shadow-lg ${tier.color}`}
                >
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-brand-blue">
                      {tier.range}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 mb-6">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-brand-green mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Support Information */}
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => alert("Payment integration coming soon. Please contact us directly for support.")}
                        className="w-full" 
                        size="lg"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Support with ₹{tier.amount.toLocaleString()}
                      </Button>
                      <div className="flex items-center justify-center text-xs text-slate-500 mt-2">
                        <ShieldCheck className="mr-1 h-3 w-3" /> 
                        Contact us for payment details
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Custom Amount Section */}
          <Card className="mb-8 border-2 border-dashed border-brand-blue">
            <CardHeader className="text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <CardTitle className="text-xl">Custom Amount</CardTitle>
              <CardDescription>
                Choose your own support amount (minimum ₹500)
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-amount">Enter Amount (₹)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="500"
                    step="100"
                  />
                </div>
                <Button 
                  onClick={handleCustomAmountSupport}
                  className="w-full" 
                  size="lg"
                  disabled={!customAmount || parseFloat(customAmount) < 500}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Support with ₹{customAmount || "0"}
                </Button>
                <div className="flex items-center justify-center text-xs text-slate-500">
                  <ShieldCheck className="mr-1 h-3 w-3" /> 
                  Contact us for payment details
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Impact Stats & Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Community Impact Stats */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle>Our Community Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-blue">{stats.total_members}</div>
                      <div className="text-sm text-slate-600">Active Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-teal">{stats.total_stories}</div>
                      <div className="text-sm text-slate-600">Stories Shared</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-purple">{stats.total_events}</div>
                      <div className="text-sm text-slate-600">Events Hosted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-green">₹{stats.total_donations?.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Community Support</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* How Your Support Helps */}
            <Card>
              <CardHeader>
                <CardTitle>How Your Support Helps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Platform Maintenance</h4>
                    <p className="text-sm text-slate-600">
                      Keep our community hub, AI assistance, and resource library running 24/7 for all users.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-brand-teal mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Community Programs</h4>
                    <p className="text-sm text-slate-600">
                      Fund real-world initiatives including wellness events, blood drives, and support meetups.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-brand-purple mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Enhanced Features</h4>
                    <p className="text-sm text-slate-600">
                      Develop new features, partnerships with healthcare professionals, and premium content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Events & Workshops</h4>
                    <p className="text-sm text-slate-600">
                      Organize specialized support groups, expert sessions, and community gatherings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Thank You Message */}
          <Card className="mt-8 bg-brand-blue text-white">
            <CardHeader>
              <CardTitle className="text-white">Thank You for Your Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100">
                Every subscription strengthens our ability to serve the cancer community. 
                Together, we're building a comprehensive support ecosystem for patients and families worldwide.
              </p>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <Card className="mt-8 bg-slate-100 border-l-4 border-brand-blue">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-3">Legal Disclaimer</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Fortitude Network</strong> is a project owned and operated by <strong>Setidure Technologies Pvt. Ltd.</strong> 
                Your support amount will be treated as a voluntary subscription to access benefits and services associated with the platform. 
                This is <strong>not a donation</strong> and is <strong>not eligible for tax exemptions</strong> under Section 80G or similar laws. 
                All contributions go directly toward maintaining and enhancing this cancer support community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
