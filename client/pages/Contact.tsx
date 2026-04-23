import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Users,
  Building,
  Globe,
  CheckCircle,
  Send,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryTypes = [
    "General Inquiry",
    "Sales & Pricing",
    "Technical Support",
    "Partnership",
    "Media & Press",
    "Feature Request",
    "Bug Report",
    "API Access",
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@treksure.ai",
      description: "Send us an email and we'll respond within 24 hours",
      action: "mailto:hello@treksure.ai",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Safety Street, Tech District",
      description: "San Francisco, CA 94105",
      action: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM EST",
      description: "Weekend: Emergency support only",
      action: null,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="max-w-md w-full border-border">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Message Sent!
              </h2>
              <p className="text-muted-foreground mb-6">
                Thank you for contacting SafeZone AI. We've received your
                message and will get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen text-foreground bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://cdn.builder.io/api/v1/image/assets%2F5bd1553efac94655a6a311a554d81a53%2F0dd2b8b949b441ef88427284d5703901?format=webp&width=1600')",
        }}
      >
        {/* Header */}
        <section className="bg-transparent py-24 text-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-center mb-8">Contact SAARTHI</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Have questions about SafeZone AI? We'd love to hear from you. Send
              us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {info.title}
                          </h3>
                          {info.action ? (
                            <a
                              href={info.action}
                              className="text-primary hover:text-primary/80 font-medium"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-foreground font-medium">
                              {info.content}
                            </p>
                          )}
                          <p className="text-muted-foreground text-sm mt-1">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <a
                    href="/features"
                    className="block text-primary hover:text-primary/80"
                  >
                    Feature Overview
                  </a>
                  <a
                    href="/safety-map"
                    className="block text-primary hover:text-primary/80"
                  >
                    Safety Map Demo
                  </a>
                  <a
                    href="/community"
                    className="block text-primary hover:text-primary/80"
                  >
                    Community Guidelines
                  </a>
                  <a
                    href="#"
                    className="block text-primary hover:text-primary/80"
                  >
                    API Documentation
                  </a>
                  <a
                    href="#"
                    className="block text-primary hover:text-primary/80"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="font-medium">
                        10:00 AM - 4:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="font-medium">Emergency only</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
                <h2 className="text-2xl font-bold text-card-foreground mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="" className="bg-background text-foreground">
                        Select inquiry type
                      </option>
                      {inquiryTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-background text-foreground"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-card/80 backdrop-blur-sm py-16 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find quick answers to common questions about SafeZone AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How accurate is the safety data?
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes multiple real-time data sources including
                    community reports, official crime statistics, and local
                    conditions to provide highly accurate safety assessments.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Is SafeZone AI available worldwide?
                  </h3>
                  <p className="text-muted-foreground">
                    We currently cover 150+ major cities worldwide with plans to
                    expand coverage continuously based on user demand and data
                    availability.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How do I report an incident?
                  </h3>
                  <p className="text-muted-foreground">
                    Use our incident reporting feature accessible from the main
                    navigation or safety map. Reports are verified by our
                    community and update risk assessments in real-time.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Is my personal data secure?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we use enterprise-grade encryption and follow strict
                    privacy policies. Location data is anonymized and we never
                    share personal information with third parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Do you offer API access?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, we provide API access for businesses and developers.
                    Contact our sales team for pricing and integration details.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    What emergency features are available?
                  </h3>
                  <p className="text-muted-foreground">
                    Our platform includes emergency contact integration, local
                    emergency service information, and crisis response features
                    for serious incidents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
