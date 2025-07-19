import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, ShieldCheck, Users, Calendar, BookOpen, CheckCircle, Gift, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [supporterName, setSupporterName] = useState<string>("");
  const [supporterEmail, setSupporterEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const createSupportMutation = useMutation({
    mutationFn: async (supportData: any) => {
      const { data, error } = await supabase
        .from('donations')
        .insert({
          user_id: user?.id || null,
          amount: supportData.amount,
          tier: supportData.tier,
          donor_name: supportData.supporterName,
          donor_email: supportData.supporterEmail,
          message: supportData.message,
          is_anonymous: supportData.isAnonymous,
          status: 'pending',
          payment_method: 'razorpay',
          subscription_type: 'support'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Support Subscription Initiated",
        description: "You'll be redirected to Razorpay to complete your payment.",
      });
    },
  });

  const handleSupport = async () => {
    let finalAmount: number;
    let tier: number;

    if (selectedTier) {
      const tierData = supportTiers.find(t => t.tier === selectedTier);
      if (customAmount && selectedTier === 3) {
        finalAmount = parseFloat(customAmount);
      } else {
        finalAmount = tierData?.amount || 0;
      }
      tier = selectedTier;
    } else {
      toast({
        title: "Please Select a Tier",
        description: "Choose a support tier to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (finalAmount < 500) {
      toast({
        title: "Invalid Amount",
        description: "Minimum support amount is ₹500.",
        variant: "destructive",
      });
      return;
    }

    try {
      const support = await createSupportMutation.mutateAsync({
        amount: finalAmount,
        tier,
        supporterName: supporterName || (user?.user_metadata?.full_name || "Anonymous"),
        supporterEmail: supporterEmail || user?.email || "",
        message,
        isAnonymous
      });

      // Razorpay integration - you would implement the actual payment flow here
      // For now, show success message
      toast({
        title: "Redirecting to Payment",
        description: "Please complete your payment with Razorpay.",
      });
      
    } catch (error) {
      console.error('Support error:', error);
      toast({
        title: "Error",
        description: "There was an error processing your support subscription. Please try again.",
        variant: "destructive",
      });
    }
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

          {/* Support Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {supportTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card 
                  key={tier.tier}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTier === tier.tier 
                      ? 'ring-2 ring-brand-blue shadow-lg' 
                      : 'hover:shadow-md'
                  } ${tier.color}`}
                  onClick={() => setSelectedTier(tier.tier)}
                >
                  <CardHeader className="text-center">
                    <IconComponent className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-brand-blue">
                      {tier.range}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-brand-green mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Support Form and Information */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Support Form */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Support Subscription</CardTitle>
                <CardDescription>
                  {selectedTier ? `Selected: ${supportTiers.find(t => t.tier === selectedTier)?.name} Tier` : 'Please select a tier above'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Custom Amount for Patron Tier */}
                {selectedTier === 3 && (
                  <div>
                    <Label htmlFor="custom-amount">Custom Amount (₹8,000 minimum)</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      min="8000"
                      step="100"
                    />
                  </div>
                )}

                {/* Supporter Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supporter-name">Name (Optional)</Label>
                    <Input
                      id="supporter-name"
                      placeholder="Your name"
                      value={supporterName}
                      onChange={(e) => setSupporterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supporter-email">Email (Optional)</Label>
                    <Input
                      id="supporter-email"
                      type="email"
                      placeholder="your@email.com"
                      value={supporterEmail}
                      onChange={(e) => setSupporterEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Share a message of support..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      Make this support subscription anonymous
                    </Label>
                  </div>
                </div>

                {selectedTier ? (
                  <div className="space-y-4">
                    <Button 
                      onClick={handleSupport} 
                      size="lg" 
                      className="w-full"
                      disabled={createSupportMutation.isPending || !selectedTier}
                    >
                      <Heart className="mr-2 h-4 w-4" /> 
                      Support with ₹{
                        selectedTier === 3 && customAmount 
                          ? customAmount 
                          : supportTiers.find(t => t.tier === selectedTier)?.amount
                      }
                    </Button>
                    
                    {/* Razorpay Payment Button */}
                    <div className="border-t pt-4">
                      <p className="text-sm text-center text-slate-600 mb-3">Or pay directly with Razorpay:</p>
                      <div className="flex justify-center">
                        <form>
                          <script 
                            src="https://checkout.razorpay.com/v1/payment-button.js" 
                            data-payment_button_id="pl_QumiJn7uhqwMeB" 
                            async
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-100 rounded-lg">
                    <p className="text-slate-600">Please select a support tier above to continue</p>
                  </div>
                )}
                
                <div className="flex items-center justify-center text-xs text-slate-500">
                  <ShieldCheck className="mr-1 h-3 w-3" /> 
                  Secure Payment Processing via Razorpay
                </div>
              </CardContent>
            </Card>

            {/* Impact Information & Statistics */}
            <div className="space-y-6">
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

              <Card className="bg-brand-blue text-white">
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
            </div>
          </div>

          {/* Legal Disclaimer */}
          <Card className="mt-12 bg-slate-100 border-l-4 border-brand-blue">
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