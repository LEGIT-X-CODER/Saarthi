import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Map,
  AlertTriangle,
  Smartphone,
  Brain,
  Clock,
  Users,
  Globe,
  BarChart3,
  Bell,
  Navigation,
  Zap,
  CheckCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Features() {
  const mainFeatures = [
    {
      icon: Map,
      title: "Real-time Safety Heatmap",
      description:
        "Interactive map with color-coded risk zones updated in real-time based on incidents, crowd density, and local conditions.",
      features: [
        "Live incident tracking",
        "Color-coded risk zones",
        "Historical data analysis",
        "Crowd density monitoring",
      ],
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F612e9a82b86748da836eaf9bc77dd81e%2F5d9ea8f2974646f7b075c8849f3fd9ab?format=webp&width=600",
    },
    {
      icon: AlertTriangle,
      title: "Community Incident Reporting",
      description:
        "Crowdsourced safety intelligence with instant map updates and community-driven alerts for real-time awareness.",
      features: [
        "Instant incident reporting",
        "Photo and location tagging",
        "Community verification",
        "Real-time notifications",
      ],
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F612e9a82b86748da836eaf9bc77dd81e%2F400e461dde3d44bebc2f433b0e527c0e?format=webp&width=600",
    },
    {
      icon: Brain,
      title: "AI Risk Assessment",
      description:
        "Advanced machine learning algorithms analyze multiple data sources to provide accurate, personalized risk scores.",
      features: [
        "Multi-source data analysis",
        "Predictive risk modeling",
        "Personalized recommendations",
        "Continuous learning",
      ],
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F612e9a82b86748da836eaf9bc77dd81e%2F454debd2cb5740d29a0d97806f0d6a93?format=webp&width=600",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Experience",
      description:
        "Seamless experience across all devices with offline capabilities and push notifications for critical alerts.",
      features: [
        "Offline map access",
        "Push notifications",
        "Cross-device sync",
        "Emergency contacts",
      ],
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F612e9a82b86748da836eaf9bc77dd81e%2F2337ee8402c644b0b07074f9fb5864ce?format=webp&width=600",
    },
  ];

  const additionalFeatures = [
    {
      icon: Clock,
      title: "Real-time Alerts",
      description:
        "Instant notifications about incidents and safety updates in your area.",
      category: "Notifications",
    },
    {
      icon: Navigation,
      title: "Safe Route Planning",
      description:
        "AI-optimized routes that avoid high-risk areas and dangerous zones.",
      category: "Navigation",
    },
    {
      icon: Users,
      title: "Travel Community",
      description:
        "Connect with fellow travelers and share safety insights and experiences.",
      category: "Social",
    },
    {
      icon: BarChart3,
      title: "Personal Safety Score",
      description:
        "Track your safety awareness and get personalized safety recommendations.",
      category: "Analytics",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description:
        "Comprehensive safety data for major cities and destinations worldwide.",
      category: "Coverage",
    },
    {
      icon: Zap,
      title: "Emergency Response",
      description:
        "Quick access to local emergency services and safety resources.",
      category: "Emergency",
    },
  ];

  const stats = [
    {
      number: "2.5M+",
      label: "Active Users",
      description: "Travelers trust SAARTHI",
    },
    {
      number: "50K+",
      label: "Incidents Reported",
      description: "Community-driven safety data",
    },
    {
      number: "150+",
      label: "Cities Covered",
      description: "Global safety intelligence",
    },
    {
      number: "99.9%",
      label: "Uptime",
      description: "Reliable safety monitoring",
    },
  ];

  const useCases = [
    {
      title: "Solo Travelers",
      description:
        "Enhanced safety for independent travelers with real-time alerts and community support.",
      icon: Users,
      benefits: [
        "Personal safety tracking",
        "Emergency contacts",
        "Solo travel tips",
        "Community support",
      ],
    },
    {
      title: "Business Travelers",
      description:
        "Professional travel safety with corporate reporting and risk management tools.",
      icon: BarChart3,
      benefits: [
        "Corporate dashboards",
        "Travel risk reports",
        "Policy compliance",
        "Team tracking",
      ],
    },
    {
      title: "Tourism Boards",
      description:
        "Destination safety monitoring and visitor protection with comprehensive analytics.",
      icon: Shield,
      benefits: [
        "Destination analytics",
        "Visitor safety",
        "Crisis management",
        "Reputation protection",
      ],
    },
  ];

  return (
    <Layout>
      <div
        className="min-h-screen text-foreground bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://cdn.builder.io/api/v1/image/assets%2F5bd1553efac94655a6a311a554d81a53%2Fe75ca4bc41174c9585429f7e36dd82a1?format=webp&width=1600')",
        }}
      >
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-primary/10 text-primary mb-4">
              <Shield className="w-4 h-4 mr-1" />
              Advanced Safety Intelligence
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white dark:text-white">
              Comprehensive Safety Features for Every Journey
            </h1>
            <p className="text-xl text-white/80 dark:text-white/80 mb-8 max-w-3xl mx-auto">
              Discover how SAARTHI's cutting-edge technology and
              community-driven insights keep travelers safe worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/safety-map">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3">
                  Explore Safety Map
                </Button>
              </Link>
              <Link to="/report-incident">
                <Button
                  variant="outline"
                  className="border-white dark:border-white text-white dark:text-white hover:bg-white dark:hover:bg-white hover:text-foreground dark:hover:text-foreground px-8 py-3"
                >
                  Report Incident
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-white dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/70 dark:text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Core Safety Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive suite of safety tools designed to protect
                travelers at every step of their journey.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="p-3 bg-primary rounded-lg mr-4">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-center text-sm text-muted-foreground"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Additional Safety Tools
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools and resources to enhance your travel safety
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-primary rounded-lg mr-3">
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Perfect for Every Traveler
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Whether you're a solo adventurer, family traveler, or business
                professional, SAARTHI adapts to your unique safety needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => {
                const Icon = useCase.icon;
                return (
                  <Card key={index} className="bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl text-foreground">{useCase.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center mb-6">
                        {useCase.description}
                      </p>
                      <ul className="space-y-2">
                        {useCase.benefits.map((benefit, benefitIndex) => (
                          <li
                            key={benefitIndex}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Travel with Confidence?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Join thousands of travelers who trust SAARTHI for their safety
              needs. Start your secure journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-background text-foreground hover:bg-background/90 px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/safety-map">
                <Button
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3"
                >
                  Explore Safety Map
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
