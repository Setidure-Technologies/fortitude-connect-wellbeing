
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Users, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

const CommunityRules = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 mx-auto text-brand-blue mb-4" />
          <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
          <p className="text-lg text-slate-600">
            Creating a safe, supportive space for everyone in our community
          </p>
        </div>

        <div className="space-y-8">
          {/* Core Values */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-brand-blue" />
                Our Core Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-10 w-10 mx-auto text-brand-teal mb-3" />
                  <h3 className="font-semibold mb-2">Compassion</h3>
                  <p className="text-sm text-slate-600">
                    We treat every member with kindness, understanding, and empathy
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-10 w-10 mx-auto text-brand-purple mb-3" />
                  <h3 className="font-semibold mb-2">Respect</h3>
                  <p className="text-sm text-slate-600">
                    We honor each person's journey, choices, and experiences
                  </p>
                </div>
                <div className="text-center">
                  <MessageSquare className="h-10 w-10 mx-auto text-brand-blue mb-3" />
                  <h3 className="font-semibold mb-2">Support</h3>
                  <p className="text-sm text-slate-600">
                    We're here to lift each other up through difficult times
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                What We Encourage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700">Positive Interactions</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Share personal experiences and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Offer emotional support and encouragement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ask thoughtful questions and listen actively</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Celebrate milestones and victories together</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700">Respectful Communication</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use inclusive and welcoming language</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Respect privacy and confidentiality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Be patient with those learning to navigate cancer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Acknowledge different perspectives and experiences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                What's Not Allowed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-700">Harmful Content</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Medical advice or treatment recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Harassment, bullying, or discriminatory language</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Sharing personal medical information of others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Spam, self-promotion, or commercial content</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-700">Disruptive Behavior</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Arguing about treatment choices or decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Political debates or controversial topics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Sharing graphic or disturbing content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Impersonating healthcare professionals</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Important Medical Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-orange-700 space-y-3">
                <p>
                  <strong>This platform is for emotional support and community connection only.</strong> 
                  We are not medical professionals and cannot provide medical advice.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">What We Offer:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Personal experiences and stories</li>
                      <li>• Emotional support and encouragement</li>
                      <li>• Community connections</li>
                      <li>• Resources for further information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Always Consult Your Doctor For:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Treatment decisions and options</li>
                      <li>• Side effect management</li>
                      <li>• Medication questions</li>
                      <li>• Emergency medical situations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting and Enforcement */}
          <Card>
            <CardHeader>
              <CardTitle>Reporting and Enforcement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">How to Report Issues</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    If you encounter behavior that doesn't align with our community guidelines:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Use the report function on posts or comments</li>
                    <li>• Contact our moderation team directly</li>
                    <li>• Chat with Forti AI for immediate support</li>
                    <li>• Block users who make you uncomfortable</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Our Response</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    We take all reports seriously and will:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Review reports within 24 hours</li>
                    <li>• Take appropriate action based on severity</li>
                    <li>• Provide support to affected community members</li>
                    <li>• Follow up with reporters when appropriate</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Possible Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Warning</Badge>
                  <Badge variant="outline">Content Removal</Badge>
                  <Badge variant="outline">Temporary Suspension</Badge>
                  <Badge variant="outline">Permanent Ban</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Commitment */}
          <Card className="bg-brand-blue text-white">
            <CardHeader>
              <CardTitle className="text-white">Our Commitment to You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 mb-4">
                We're committed to maintaining a safe, supportive environment where everyone feels welcome to share their journey. 
                Together, we can create a community that truly makes a difference in the lives of those affected by cancer.
              </p>
              <p className="text-blue-100 text-sm">
                Thank you for being part of the Fortitude Network community and helping us support each other through this journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityRules;
