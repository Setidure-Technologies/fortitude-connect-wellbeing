
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, ShieldCheck, Users, Calendar, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Donate = () => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch community stats and real donation totals
  const { data: stats } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const [statsResponse, donationResponse] = await Promise.all([
        supabase.from('community_stats').select('*').single(),
        supabase.from('donations').select('amount').eq('status', 'completed')
      ]);
      
      if (statsResponse.error) throw statsResponse.error;
      
      const totalDonations = donationResponse.data?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
      
      return {
        ...statsResponse.data,
        total_donations: totalDonations
      };
    },
  });

  const predefinedAmounts = [25, 50, 100, 250];

  const createDonationMutation = useMutation({
    mutationFn: async (donationData: any) => {
      const { data, error } = await supabase
        .from('donations')
        .insert({
          user_id: user?.id || null,
          amount: donationData.amount,
          donor_name: donationData.donorName,
          donor_email: donationData.donorEmail,
          message: donationData.message,
          is_anonymous: donationData.isAnonymous,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Donation Initiated",
        description: "You'll be redirected to PayPal to complete your donation.",
      });
    },
  });

  const handleDonate = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (finalAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      const donation = await createDonationMutation.mutateAsync({
        amount: finalAmount,
        donorName: donorName || (user?.user_metadata?.full_name || "Anonymous"),
        donorEmail: donorEmail || user?.email || "",
        message,
        isAnonymous
      });

      // Here you would integrate with PayPal
      // For now, we'll simulate the PayPal redirect
      window.open(`https://www.paypal.com/donate?amount=${finalAmount}&item_name=Fortitude Network Donation`, '_blank');
      
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Heart className="h-16 w-16 mx-auto text-brand-blue mb-4" />
            <h1 className="text-4xl font-bold mb-4">Support Our Mission</h1>
            <p className="text-lg text-slate-700">
              Fortitude Network is a non-profit initiative providing free support for cancer patients and their families.
            </p>
          </div>

          {/* Impact Stats */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-brand-blue">{stats.total_members}</div>
                <div className="text-sm text-slate-600">Members Supported</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-brand-teal">{stats.total_stories}</div>
                <div className="text-sm text-slate-600">Stories Shared</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-brand-purple">{stats.total_events}</div>
                <div className="text-sm text-slate-600">Events Hosted</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-brand-green">₹{stats.total_donations?.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Funds Raised</div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Your contribution makes a real difference.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-medium">Choose Amount</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {predefinedAmounts.map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset && !customAmount ? "default" : "outline"}
                        onClick={() => {
                          setAmount(preset);
                          setCustomAmount("");
                        }}
                        className="h-12"
                      >
                        ₹{preset}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Label htmlFor="custom-amount">Custom Amount</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount(0);
                      }}
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="donor-name">Name (Optional)</Label>
                    <Input
                      id="donor-name"
                      placeholder="Your name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="donor-email">Email (Optional)</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      placeholder="your@email.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
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
                      Make this donation anonymous
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleDonate} 
                  size="lg" 
                  className="w-full"
                  disabled={createDonationMutation.isPending}
                >
                  <Heart className="mr-2 h-4 w-4" /> 
                  Donate ₹{customAmount || amount} via PayPal
                </Button>
                
                <div className="flex items-center justify-center text-xs text-slate-500">
                  <ShieldCheck className="mr-1 h-3 w-3" /> 
                  Secure Payment Processing via PayPal
                </div>
              </CardContent>
            </Card>

            {/* Impact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How Your Donation Helps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Maintain Our Platform</h4>
                      <p className="text-sm text-slate-600">
                        Keep our community hub, AI bot, and resource library running and accessible to all, for free.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-brand-teal mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Fund Community Programs</h4>
                      <p className="text-sm text-slate-600">
                        Support real-world initiatives like blood donation drives and wellness outings for patients.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-brand-purple mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Expand Resources</h4>
                      <p className="text-sm text-slate-600">
                        Partner with mental health professionals and create more high-quality support content.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-brand-blue mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Host Events</h4>
                      <p className="text-sm text-slate-600">
                        Organize support groups, workshops, and community events that bring people together.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-brand-blue text-white">
                <CardHeader>
                  <CardTitle className="text-white">Thank You</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100">
                    Every donation, no matter the size, makes a meaningful impact. 
                    Together, we're building a stronger support network for cancer patients and their families worldwide.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
