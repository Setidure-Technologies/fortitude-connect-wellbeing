import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import ResponsiveContainer from '@/components/ResponsiveContainer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show an alert. In future, this would send the message
    alert("Thank you for your message. We'll get back to you within 24-48 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <ResponsiveContainer maxWidth="6xl">
        <div className="text-center mb-8 lg:mb-12">
          <MessageCircle className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-brand-blue mb-4" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-slate-700">
              We're here to help. Reach out to us anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-brand-blue mt-1" />
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="text-slate-600">support@fortitudenetwork.in</p>
                      <p className="text-sm text-slate-500">We respond within 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-brand-blue mt-1" />
                    <div>
                      <h3 className="font-semibold">Call Us</h3>
                      <p className="text-slate-600">+91-XXX-XXX-XXXX</p>
                      <p className="text-sm text-slate-500">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-brand-blue mt-1" />
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-slate-600">
                        Setidure Technologies Pvt. Ltd.<br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">How do I join the community?</h4>
                    <p className="text-sm text-slate-600">
                      Simply sign up for a free account and start connecting with our support community.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Is the platform free to use?</h4>
                    <p className="text-sm text-slate-600">
                      Yes, our core community features are free. Premium features are available through support tiers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">How can I support the platform?</h4>
                    <p className="text-sm text-slate-600">
                      Visit our Support page to learn about different ways to contribute to our community.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </ResponsiveContainer>
    </div>
  );
};

export default ContactUs;