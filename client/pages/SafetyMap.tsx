import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Filter,
  AlertTriangle,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Navigation,
  Layers,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import L from "leaflet";
import "leaflet.heat";

// Extend Leaflet types for heatLayer
declare module 'leaflet' {
  function heatLayer(latlngs: Array<[number, number, number]>, options?: any): L.Layer;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Incident {
  id: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  timestamp: Date;
  intensity: number; // For heatmap intensity
  isWomenSpecific?: boolean;
}

interface SafetyZone {
  id: string;
  name: string;
  level: "High Risk" | "Elevated Risk" | "Medium Risk" | "Low Risk";
  score: number;
  color: string;
  bgColor: string;
  incidents: number;
  lastUpdate: string;
  center: [number, number];
  radius: number;
  womenSafetyLevel?: "Safe" | "Caution" | "Unsafe";
}

export default function SafetyMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showWomenSafety, setShowWomenSafety] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [heatmapLayer, setHeatmapLayer] = useState<L.Layer | null>(null);
  const [incidentMarkers, setIncidentMarkers] = useState<L.Marker[]>([]);
  const [zoneCircles, setZoneCircles] = useState<L.Circle[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  // Kanpur incident data with real coordinates mapped to new zones
  const dummyIncidents: Incident[] = [
    { id: "1", type: "Robbery", location: "Kidwai Nagar - Main Block", lat: 26.4385, lng: 80.3235, severity: "critical", description: "Armed robbery reported in commercial zone.", timestamp: new Date(Date.now() - 5 * 60 * 1000), intensity: 1.0 },
    { id: "2", type: "Theft", location: "Kanpur Cantonment Area", lat: 26.4468, lng: 80.3540, severity: "high", description: "Chain snatching incident during evening hours.", timestamp: new Date(Date.now() - 15 * 60 * 1000), intensity: 0.8, isWomenSpecific: true },
    { id: "3", type: "Harassment", location: "Civil Lines - Mall Road", lat: 26.4678, lng: 80.3458, severity: "medium", description: "Public harassment reported near the shopping complex.", timestamp: new Date(Date.now() - 40 * 60 * 1000), intensity: 0.6, isWomenSpecific: true },
    { id: "4", type: "Traffic", location: "Jajmau - Highway", lat: 26.4172, lng: 80.4077, severity: "low", description: "Minor traffic congestion near the bridge.", timestamp: new Date(Date.now() - 60 * 60 * 1000), intensity: 0.4 },
    { id: "5", type: "Vandalism", location: "Fazalganj Industrial Area", lat: 26.4446, lng: 80.3204, severity: "critical", description: "Vandalism and property damage reported at local factory.", timestamp: new Date(Date.now() - 25 * 60 * 1000), intensity: 0.95 },
    { id: "6", type: "Assault", location: "Babupurwa Market", lat: 26.4352, lng: 80.3361, severity: "critical", description: "Physical altercation resulting in injuries.", timestamp: new Date(Date.now() - 30 * 60 * 1000), intensity: 0.9 },
    { id: "7", type: "Theft", location: "Govind Nagar", lat: 26.4402, lng: 80.3123, severity: "high", description: "Two-wheeler theft reported from residential parking.", timestamp: new Date(Date.now() - 45 * 60 * 1000), intensity: 0.75 },
    { id: "8", type: "Eve-teasing", location: "Kakadeo - Geeta Nagar", lat: 26.4632, lng: 80.3015, severity: "critical", description: "Multiple complains of eve-teasing near coaching centers.", timestamp: new Date(Date.now() - 55 * 60 * 1000), intensity: 1.0, isWomenSpecific: true },
    { id: "9", type: "Traffic", location: "IIT Kanpur Gate", lat: 26.5123, lng: 80.2329, severity: "low", description: "Routine vehicle checks causing minor delays.", timestamp: new Date(Date.now() - 110 * 60 * 1000), intensity: 0.2 },
    { id: "10", type: "Protest", location: "Swaroop Nagar", lat: 26.4699, lng: 80.3344, severity: "low", description: "Peaceful demonstration by local union.", timestamp: new Date(Date.now() - 120 * 60 * 1000), intensity: 0.3 },
    { id: "11", type: "Theft", location: "Barra - South", lat: 26.4190, lng: 80.2980, severity: "medium", description: "House break-in reported during daylight.", timestamp: new Date(Date.now() - 80 * 60 * 1000), intensity: 0.65 },
    { id: "12", type: "Harassment", location: "Yashoda Nagar", lat: 26.4250, lng: 80.3250, severity: "high", description: "Repeated harassment complaints in the area from female residents.", timestamp: new Date(Date.now() - 95 * 60 * 1000), intensity: 0.85, isWomenSpecific: true },
    { id: "13", type: "Weather", location: "Chakeri Airport", lat: 26.4011, lng: 80.4100, severity: "low", description: "Heavy smog reducing visibility significantly.", timestamp: new Date(Date.now() - 150 * 60 * 1000), intensity: 0.25 },
    { id: "14", type: "Suspicious Activity", location: "Rawatpur Crossing", lat: 26.4660, lng: 80.3100, severity: "medium", description: "Suspicious individuals loitering near ladies hostel.", timestamp: new Date(Date.now() - 70 * 60 * 1000), intensity: 0.55, isWomenSpecific: true },
    { id: "15", type: "Traffic", location: "Nawabganj", lat: 26.4950, lng: 80.3150, severity: "low", description: "Road blocked for municipality maintenance.", timestamp: new Date(Date.now() - 160 * 60 * 1000), intensity: 0.3 },
    { id: "16", type: "Theft", location: "Pandu Nagar", lat: 26.4610, lng: 80.3200, severity: "low", description: "Bicycle stolen outside commercial store.", timestamp: new Date(Date.now() - 200 * 60 * 1000), intensity: 0.35 },
    { id: "17", type: "Accident", location: "Transport Nagar", lat: 26.4100, lng: 80.3400, severity: "critical", description: "Severe collision between multi-axle trucks.", timestamp: new Date(Date.now() - 18 * 60 * 1000), intensity: 0.95 },
    { id: "18", type: "Stalking", location: "Juhi Area", lat: 26.4450, lng: 80.3300, severity: "high", description: "Complaint of being followed after dark.", timestamp: new Date(Date.now() - 35 * 60 * 1000), intensity: 0.88, isWomenSpecific: true },
    { id: "19", type: "Assault", location: "Naubasta Bypass", lat: 26.4000, lng: 80.3200, severity: "medium", description: "Road rage incident escalated into assault.", timestamp: new Date(Date.now() - 50 * 60 * 1000), intensity: 0.6 },
    { id: "20", type: "Theft", location: "Bithoor Pilgrimage", lat: 26.6133, lng: 80.2721, severity: "low", description: "Tourist reported a bag snatching incident.", timestamp: new Date(Date.now() - 300 * 60 * 1000), intensity: 0.45 },
    { id: "21", type: "Safe Route", location: "Swaroop Nagar Mall", lat: 26.4715, lng: 80.3360, severity: "low", description: "Well lit pathways and active police patrol. Safe for night walks.", timestamp: new Date(Date.now() - 10 * 60 * 1000), intensity: 0.2, isWomenSpecific: true },
  ];

  const safetyZones: SafetyZone[] = [
    { id: "kidwai-nagar", name: "Kidwai Nagar", level: "High Risk", score: 15, color: "text-red-500 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20", incidents: 8, lastUpdate: "Just now", center: [26.4385, 80.3235], radius: 1800, womenSafetyLevel: "Unsafe" },
    { id: "fazalganj", name: "Fazalganj", level: "High Risk", score: 12, color: "text-red-500 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20", incidents: 5, lastUpdate: "10 mins ago", center: [26.4446, 80.3204], radius: 1500, womenSafetyLevel: "Unsafe" },
    { id: "babupurwa", name: "Babupurwa", level: "High Risk", score: 18, color: "text-red-500 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20", incidents: 7, lastUpdate: "5 mins ago", center: [26.4352, 80.3361], radius: 1600, womenSafetyLevel: "Unsafe" },
    { id: "transport-nagar", name: "Transport Nagar", level: "High Risk", score: 22, color: "text-red-500 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/20", incidents: 4, lastUpdate: "18 mins ago", center: [26.4100, 80.3400], radius: 1700, womenSafetyLevel: "Caution" },
    
    { id: "kanpur-cantt", name: "Kanpur Cantonment", level: "Elevated Risk", score: 45, color: "text-orange-500 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-900/20", incidents: 5, lastUpdate: "15 mins ago", center: [26.4468, 80.3540], radius: 1500, womenSafetyLevel: "Safe" },
    { id: "govind-nagar", name: "Govind Nagar", level: "Elevated Risk", score: 42, color: "text-orange-500 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-900/20", incidents: 3, lastUpdate: "45 mins ago", center: [26.4402, 80.3123], radius: 1300, womenSafetyLevel: "Safe" },
    { id: "yashoda-nagar", name: "Yashoda Nagar", level: "Elevated Risk", score: 38, color: "text-orange-500 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-900/20", incidents: 4, lastUpdate: "1 hour ago", center: [26.4250, 80.3250], radius: 1450, womenSafetyLevel: "Unsafe" },
    { id: "juhi", name: "Juhi", level: "Elevated Risk", score: 40, color: "text-orange-500 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-900/20", incidents: 3, lastUpdate: "35 mins ago", center: [26.4450, 80.3300], radius: 1600, womenSafetyLevel: "Caution" },
    
    { id: "civil-lines", name: "Civil Lines", level: "Medium Risk", score: 65, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", incidents: 2, lastUpdate: "1 hour ago", center: [26.4678, 80.3458], radius: 1300, womenSafetyLevel: "Caution" },
    { id: "kakadeo", name: "Kakadeo", level: "Medium Risk", score: 58, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", incidents: 3, lastUpdate: "55 mins ago", center: [26.4632, 80.3015], radius: 1200, womenSafetyLevel: "Unsafe" },
    { id: "barra", name: "Barra", level: "Medium Risk", score: 60, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", incidents: 2, lastUpdate: "2 hours ago", center: [26.4190, 80.2980], radius: 1400, womenSafetyLevel: "Caution" },
    { id: "rawatpur", name: "Rawatpur", level: "Medium Risk", score: 62, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", incidents: 1, lastUpdate: "1.5 hours ago", center: [26.4660, 80.3100], radius: 1100, womenSafetyLevel: "Caution" },
    { id: "naubasta", name: "Naubasta", level: "Medium Risk", score: 68, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", incidents: 2, lastUpdate: "50 mins ago", center: [26.4000, 80.3200], radius: 1500, womenSafetyLevel: "Unsafe" },
    
    { id: "jajmau", name: "Jajmau", level: "Low Risk", score: 88, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 0, lastUpdate: "2 hours ago", center: [26.4172, 80.4077], radius: 2000, womenSafetyLevel: "Safe" },
    { id: "iit-kanpur", name: "IIT Kanpur", level: "Low Risk", score: 95, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 0, lastUpdate: "12 hours ago", center: [26.5123, 80.2329], radius: 2200, womenSafetyLevel: "Safe" },
    { id: "swaroop-nagar", name: "Swaroop Nagar", level: "Low Risk", score: 85, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 1, lastUpdate: "3 hours ago", center: [26.4699, 80.3344], radius: 1500, womenSafetyLevel: "Safe" },
    { id: "bithoor", name: "Bithoor", level: "Low Risk", score: 92, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 0, lastUpdate: "5 hours ago", center: [26.6133, 80.2721], radius: 2500, womenSafetyLevel: "Caution" },
    { id: "chakeri", name: "Chakeri (Airport)", level: "Low Risk", score: 90, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 0, lastUpdate: "8 hours ago", center: [26.4011, 80.4100], radius: 1800, womenSafetyLevel: "Safe" },
    { id: "nawabganj", name: "Nawabganj", level: "Low Risk", score: 82, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 1, lastUpdate: "3 hours ago", center: [26.4950, 80.3150], radius: 1400, womenSafetyLevel: "Safe" },
    { id: "pandu-nagar", name: "Pandu Nagar", level: "Low Risk", score: 86, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/20", incidents: 1, lastUpdate: "4 hours ago", center: [26.4610, 80.3200], radius: 1200, womenSafetyLevel: "Safe" },
  ];

  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      try {
        setIsMapLoading(true);
        setMapError(null);
        
        // Initialize map centered on Kanpur Kidwai Nagar area
        const map = L.map(mapRef.current).setView([26.445, 80.355], 12);
        
        // Add OpenStreetMap tiles with error handling
        const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        });
        
        tileLayer.on('tileerror', (e) => {
          console.warn('Tile loading error:', e);
        });
        
        tileLayer.on('load', () => {
          setIsMapLoading(false);
        });
        
        tileLayer.addTo(map);

        setMapInstance(map);

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map. Please refresh the page.');
        setIsMapLoading(false);
      }
    }

    // Cleanup function
    return () => {
      if (mapInstance) {
        try {
          // Clean up markers
          incidentMarkers.forEach(marker => {
            mapInstance.removeLayer(marker);
          });
          
          // Clean up circles
          zoneCircles.forEach(circle => {
            mapInstance.removeLayer(circle);
          });
          
          // Clean up heatmap
          if (heatmapLayer) {
            mapInstance.removeLayer(heatmapLayer);
          }
          
          // Remove map instance
          mapInstance.remove();
          setMapInstance(null);
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, []); // Empty dependency array for mount/unmount only

  useEffect(() => {
    if (!mapInstance) return;

    try {
      // Clean up existing layers
      if (heatmapLayer) {
        mapInstance.removeLayer(heatmapLayer);
        setHeatmapLayer(null);
      }

      // Clean up existing incident markers
      incidentMarkers.forEach(marker => {
        mapInstance.removeLayer(marker);
      });
      setIncidentMarkers([]);

      // Clean up existing zone circles
      zoneCircles.forEach(circle => {
        mapInstance.removeLayer(circle);
      });
      setZoneCircles([]);

      const newMarkers: L.Marker[] = [];
      const newCircles: L.Circle[] = [];

      // Add safety zone circles
      safetyZones.forEach((zone) => {
        let level = zone.level;
        let score = zone.score;
        let color = level === "High Risk" ? "#ef4444" : 
                      level === "Elevated Risk" ? "#f97316" : 
                      level === "Medium Risk" ? "#eab308" : 
                      "#10b981";

        if (showWomenSafety && zone.womenSafetyLevel) {
          level = "Women Rating: " + zone.womenSafetyLevel;
          color = zone.womenSafetyLevel === "Unsafe" ? "#ef4444" :
                  zone.womenSafetyLevel === "Caution" ? "#f97316" :
                  "#10b981";
        }

        const circle = L.circle(zone.center, {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 2,
          radius: zone.radius,
        }).addTo(mapInstance).bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${zone.name}</h3>
            <p class="text-sm font-semibold" style="color: ${color}">${level}</p>
            <p class="text-sm mt-1">Safety Score: ${score}/100</p>
            <p class="text-sm">Recent Incidents: ${zone.incidents}</p>
          </div>
        `);
        newCircles.push(circle);
      });
      setZoneCircles(newCircles);

      const activeIncidents = showWomenSafety 
        ? dummyIncidents.filter(i => i.isWomenSpecific) 
        : dummyIncidents;

      // Add heatmap layer if enabled
      if (showHeatmap) {
        const heatmapData = activeIncidents.map(incident => [
          incident.lat,
          incident.lng,
          incident.intensity
        ] as [number, number, number]);

        const heatmap = L.heatLayer(heatmapData, {
          radius: 35,
          blur: 25,
          maxZoom: 12,
          gradient: {
            0.4: '#10b981', // Green for low risk
            0.6: '#eab308', // Yellow for medium risk
            0.8: '#f97316', // Orange for elevated risk
            1.0: '#ef4444'  // Red for high risk
          }
        }).addTo(mapInstance);

        setHeatmapLayer(heatmap);
      }

      // Add incident markers if enabled
      if (showIncidents) {
        activeIncidents.forEach(incident => {
          const color = incident.severity === "critical" ? "#ef4444" : 
                        incident.severity === "high" ? "#f97316" :
                        incident.severity === "medium" ? "#eab308" : "#10b981";
          
          const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.4);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          const marker = L.marker([incident.lat, incident.lng], { icon })
            .addTo(mapInstance)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-bold text-lg">${incident.type}</h3>
                <p class="text-sm text-gray-600">${incident.location}</p>
                <p class="text-sm mt-1">${incident.description}</p>
                <p class="text-sm text-gray-500 mt-1">${incident.timestamp.toLocaleTimeString()}</p>
              </div>
            `);
          
          newMarkers.push(marker);
        });
        
        setIncidentMarkers(newMarkers);
      }
    } catch (error) {
      console.error('Error updating map layers:', error);
    }
  }, [mapInstance, showHeatmap, showIncidents, showWomenSafety]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case "low":
        return <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  // Memoize recent incidents calculation
  const recentIncidents = useMemo(() => {
    return dummyIncidents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  }, []);

  // Callback for refresh functionality
  const handleRefresh = useCallback(() => {
    if (mapInstance) {
      // Force re-render of layers
      setShowHeatmap(prev => {
        const current = prev;
        setShowHeatmap(false);
        setTimeout(() => setShowHeatmap(current), 100);
        return current;
      });
    }
  }, [mapInstance]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Map Section */}
          <div className="lg:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                     Safety Map
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={showHeatmap ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowHeatmap(!showHeatmap)}
                    >
                      {showHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      Heatmap
                    </Button>
                    <Button
                      variant={showIncidents ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowIncidents(!showIncidents)}
                    >
                      {showIncidents ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      Incidents
                    </Button>
                    <Button
                      variant={showWomenSafety ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowWomenSafety(!showWomenSafety)}
                      className={showWomenSafety ? "bg-pink-600 hover:bg-pink-700 text-white" : "border-pink-200 text-pink-700 hover:bg-pink-50"}
                    >
                      <Users className="w-4 h-4" />
                      Women Safety
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {mapError ? (
                    <div className="w-full h-[600px] rounded-lg border flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                      <div className="text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Map Loading Error</h3>
                        <p className="text-red-600 dark:text-red-400 mb-4">{mapError}</p>
                        <Button 
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reload Page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        ref={mapRef}
                        className="w-full h-[600px] rounded-lg border"
                        style={{ zIndex: 1 }}
                      />
                      {isMapLoading && (
                        <div className="absolute inset-0 bg-background/75 backdrop-blur-sm flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                            <p className="text-muted-foreground">Loading map...</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="absolute top-4 left-4 z-10" style={{ pointerEvents: 'none' }}>
                    <div className="bg-card p-3 rounded-lg shadow-lg border border-border pointer-events-auto">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">Risk Zones</h4>
                      <div className="space-y-1 text-xs text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>High Risk (Red Zone)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>Elevated Risk (Orange Zone)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Medium Risk (Yellow Zone)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Low Risk (Green Zone)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Search for location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Risk Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Risk Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {safetyZones.length === 0 ? (
                  <p className="text-muted-foreground">No risk areas available</p>
                ) : (
                  <div className="space-y-3">
                    {safetyZones.map((area) => (
                      <div
                        key={area.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                           selectedArea === area.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedArea(area.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{area.name}</h4>
                            <p className={`text-sm ${area.color}`}>{area.level}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{area.score}</div>
                            <div className="text-xs text-muted-foreground">Safety Score</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                          <span>{area.incidents} incidents</span>
                          <span>{area.lastUpdate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(incident.severity)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{incident.type}</h4>
                          <p className="text-xs text-muted-foreground">{incident.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {incident.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
