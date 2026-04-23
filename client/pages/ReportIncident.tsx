import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  MapPin,
  Camera,
  Clock,
  Shield,
  CheckCircle,
  Upload,
  Navigation,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { IncidentService } from "@/lib/firestore";
import { useNavigate } from "react-router-dom";

export default function ReportIncident() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    incidentType: "",
    severityLevel: "",
    location: "",
    description: "",
    title: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const incidentTypes = [
    { value: "theft", label: "Theft/Robbery" },
    { value: "harassment", label: "Assault/Harassment" },
    { value: "accident", label: "Traffic Incident" },
    { value: "weather", label: "Weather/Natural Disaster" },
    { value: "medical", label: "Medical Emergency" },
    { value: "other", label: "Other" },
  ];

  const severityLevels = [
    { value: "low", label: "Low - Minor incident", color: "text-green-600 dark:text-green-400" },
    {
      value: "medium",
      label: "Medium - Moderate concern",
      color: "text-yellow-600 dark:text-yellow-400",
    },
    { value: "high", label: "High - Serious incident", color: "text-red-600 dark:text-red-400" },
    {
      value: "critical",
      label: "Critical - Immediate danger",
      color: "text-red-800 dark:text-red-300",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if user is authenticated
    if (!currentUser || !userProfile) {
      setError("Please log in to report an incident");
      navigate("/login");
      return;
    }

    // Validate form
    if (
      !formData.incidentType ||
      !formData.severityLevel ||
      !formData.location ||
      !formData.description ||
      !formData.title
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create incident using Firestore service
      await IncidentService.createIncident({
        reporterId: currentUser.uid,
        reporterName: userProfile.displayName,
        reporterAvatar: currentUser.photoURL || undefined,
        title: formData.title,
        description: formData.description,
        category: formData.incidentType as any,
        severity: formData.severityLevel as any,
        location: {
          address: formData.location
        }
      });

      // Show success message
      console.log("Incident reported successfully");
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset form data
      setFormData({
        incidentType: "",
        severityLevel: "",
        location: "",
        description: "",
        title: ""
      });
    } catch (error: any) {
      console.error("Error reporting incident:", error);
      setError(error.message || "Failed to submit incident report. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setFormData((prev) => ({
        ...prev,
        location: "Getting location...",
      }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setFormData((prev) => ({
            ...prev,
            location: locationString,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setFormData((prev) => ({
            ...prev,
            location: "Unable to get location",
          }));
          alert("Unable to get your location. Please enter manually.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-muted/50 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Report Submitted
              </h2>
              <p className="text-muted-foreground mb-6">
                Thank you for helping keep the community safe. Your incident
                report has been submitted and will be reviewed by our team.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-safezone-blue hover:bg-safezone-blue-dark"
                >
                  Submit Another Report
                </Button>
                <Button variant="outline" className="w-full">
                  View Safety Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen text-white dark:text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://cdn.builder.io/api/v1/image/assets%2F5bd1553efac94655a6a311a554d81a53%2Fc64ff1e0b6934305a0e3bb64f3afbb95?format=webp&width=1600')",
        }}
      >
        {/* Header Section */}
        <div className="text-white dark:text-white py-12 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-treksure-blue" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Report a safety incident
            </h1>
            <p className="text-xl text-blue-100 dark:text-blue-100">
              Help keep the SAARTHI community safe by reporting incidents and
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative -mt-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Authentication Check */}
                  {!currentUser && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                      <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        Please <a href="/login" className="underline font-medium">log in</a> to report incidents
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Incident Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Brief title describing the incident"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      disabled={!currentUser}
                    />
                  </div>

                  {/* Incident Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="incident-type"
                      className="text-base font-medium"
                    >
                      Incident Type *
                    </Label>
                    <Select
                      value={formData.incidentType}
                      onValueChange={(value) =>
                        handleInputChange("incidentType", value)
                      }
                      disabled={!currentUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Severity Level */}
                  <div className="space-y-2">
                    <Label htmlFor="severity" className="text-base font-medium">
                      Severity Level *
                    </Label>
                    <Select
                      value={formData.severityLevel}
                      onValueChange={(value) =>
                        handleInputChange("severityLevel", value)
                      }
                      disabled={!currentUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <span className={level.color}>{level.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base font-medium">
                      Location *
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="location"
                        placeholder="Street address or landmark"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="flex-1"
                        required
                        disabled={!currentUser}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={getCurrentLocation}
                        className="px-3"
                        disabled={!currentUser}
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click the location icon to use your current location
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-base font-medium"
                    >
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what happened..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      className="resize-none"
                      required
                      disabled={!currentUser}
                    />
                    <p className="text-sm text-muted-foreground">
                      Please provide as much detail as possible to help others
                      stay safe
                    </p>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Photos (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-border/80 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-foreground">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-teal-blue hover:bg-gradient-lime-cyan text-white dark:text-white py-3 text-lg font-semibold shadow-glow-teal hover:shadow-glow-blue transition-all duration-300"
                      disabled={
                        !currentUser ||
                        isSubmitting ||
                        !formData.incidentType ||
                        !formData.severityLevel ||
                        !formData.location ||
                        !formData.description ||
                        !formData.title
                      }
                    >
                      {isSubmitting && (
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      )}
                      {!currentUser ? "Please Log In" : isSubmitting ? "Submitting Report..." : "Submit Report"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      By submitting, you agree to our community guidelines and
                      data policy
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white/5 dark:bg-white/5 text-white dark:text-white py-16 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white dark:text-white mb-4">
                Live risk assessment for your location
              </h2>
              <p className="text-gray-300 dark:text-gray-300">
                AI-powered risk scores updated in real-time based on multiple
                data sources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current Location Risk */}
              <Card className="text-center">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <MapPin className="w-5 h-5 mr-2 text-safezone-blue dark:text-safezone-blue" />
                    Current Location Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(6 / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground dark:text-foreground">6</span>
                    </div>
                  </div>
                  <Badge className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">Low Risk</Badge>
                </CardContent>
              </Card>

              {/* Risk by Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk by Area</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-foreground dark:text-foreground">Downtown</p>
                        <p className="text-sm text-red-600 dark:text-red-400">High Risk</p>
                      </div>
                    </div>
                    <p className="font-bold text-foreground dark:text-foreground">85</p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-foreground dark:text-foreground">
                          Tourist District
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">Medium Risk</p>
                      </div>
                    </div>
                    <p className="font-bold text-foreground dark:text-foreground">45</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
