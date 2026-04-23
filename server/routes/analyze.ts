import { RequestHandler } from "express";

export interface AnalyzeLocationRequest {
  location: string;
}

export interface AnalyzeLocationResponse {
  location: string;
  riskScore: number;
  riskLevel: string;
  recommendation: string;
  incidents: Array<{
    type: string;
    distance: string;
    time: string;
  }>;
}

export const handleAnalyzeLocation: RequestHandler = (req, res) => {
  const { location } = req.body as AnalyzeLocationRequest;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  // Simulate risk analysis
  const riskScore = Math.floor(Math.random() * 100);
  const riskLevel = getRiskLevel(riskScore);
  const recommendation = getRecommendation(riskLevel);

  const response: AnalyzeLocationResponse = {
    location,
    riskScore,
    riskLevel,
    recommendation,
    incidents: generateMockIncidents(),
  };

  res.json(response);
};

function getRiskLevel(score: number): string {
  if (score < 25) return "Low";
  if (score < 50) return "Medium";
  if (score < 75) return "High";
  return "Critical";
}

function getRecommendation(level: string): string {
  const recommendations = {
    Low: "Safe for travel - enjoy your visit!",
    Medium: "Exercise normal precautions",
    High: "Be extra cautious and avoid isolated areas", 
    Critical: "Avoid if possible, high risk area"
  };
  return recommendations[level as keyof typeof recommendations];
}

function generateMockIncidents() {
  const incidents = [
    { type: "Theft", distance: "0.2km", time: "2 hours ago" },
    { type: "Traffic", distance: "0.5km", time: "4 hours ago" },
    { type: "Harassment", distance: "0.8km", time: "1 day ago" }
  ];
  return incidents.slice(0, Math.floor(Math.random() * 3) + 1);
}