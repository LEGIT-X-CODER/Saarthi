import { RequestHandler } from "express";

export interface ReportIncidentRequest {
  incidentType: string;
  severityLevel: string;
  location: string;
  description: string;
  yourName?: string;
  email?: string;
}

export interface ReportIncidentResponse {
  success: boolean;
  incidentId: string;
  message: string;
}

export const handleReportIncident: RequestHandler = (req, res) => {
  const { incidentType, severityLevel, location, description, yourName, email } = req.body as ReportIncidentRequest;

  // Validate required fields
  if (!incidentType || !severityLevel || !location || !description) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing required fields: incidentType, severityLevel, location, description" 
    });
  }

  // Generate incident ID
  const incidentId = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Log incident (in real app, save to database)
  console.log("New incident reported:", {
    incidentId,
    incidentType,
    severityLevel,
    location,
    description,
    yourName,
    email,
    timestamp: new Date().toISOString()
  });

  const response: ReportIncidentResponse = {
    success: true,
    incidentId,
    message: "Incident reported successfully. Thank you for helping keep the community safe!"
  };

  res.json(response);
};