import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MapPin, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare
} from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";

interface Incident {
  id: string;
  type: string;
  location: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "pending" | "investigating" | "resolved";
  reportedAt: string;
  reportedBy: string;
}

interface DashboardStats {
  totalIncidents: number;
  pendingIncidents: number;
  resolvedIncidents: number;
  activeUsers: number;
  criticalAlerts: number;
}

const AuthorityPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    pendingIncidents: 0,
    resolvedIncidents: 0,
    activeUsers: 0,
    criticalAlerts: 0
  });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Mock data - in real app, this would come from Firebase/API
      const mockStats: DashboardStats = {
        totalIncidents: 156,
        pendingIncidents: 23,
        resolvedIncidents: 133,
        activeUsers: 1247,
        criticalAlerts: 3
      };

      const mockIncidents: Incident[] = [
        {
          id: "1",
          type: "Theft",
          location: "Central Park, Delhi",
          description: "Mobile phone snatching reported near gate 2",
          severity: "high",
          status: "pending",
          reportedAt: "2024-01-15T10:30:00Z",
          reportedBy: "user123@example.com"
        },
        {
          id: "2",
          type: "Harassment",
          location: "Metro Station, Connaught Place",
          description: "Verbal harassment reported in metro",
          severity: "medium",
          status: "investigating",
          reportedAt: "2024-01-15T09:15:00Z",
          reportedBy: "user456@example.com"
        },
        {
          id: "3",
          type: "Suspicious Activity",
          location: "India Gate Area",
          description: "Suspicious person loitering near tourist area",
          severity: "low",
          status: "resolved",
          reportedAt: "2024-01-14T16:45:00Z",
          reportedBy: "user789@example.com"
        },
        {
          id: "4",
          type: "Emergency",
          location: "Karol Bagh Market",
          description: "Medical emergency - person collapsed",
          severity: "critical",
          status: "pending",
          reportedAt: "2024-01-15T11:00:00Z",
          reportedBy: "user101@example.com"
        }
      ];

      setTimeout(() => {
        setStats(mockStats);
        setIncidents(mockIncidents);
        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "text-green-600";
      case "investigating": return "text-yellow-600";
      case "pending": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4" />;
      case "investigating": return <Clock className="h-4 w-4" />;
      case "pending": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Authority Panel...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Authority Panel</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome, {user?.email} - SafeZone.ai Administrative Dashboard
          </p>
        </div>

        {/* Critical Alerts */}
        {stats.criticalAlerts > 0 && (
          <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              <strong>{stats.criticalAlerts} Critical Alert(s)</strong> require immediate attention!
            </AlertDescription>
          </Alert>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">All time reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingIncidents}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedIncidents}</div>
              <p className="text-xs text-muted-foreground">Successfully handled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Platform users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</div>
              <p className="text-xs text-muted-foreground">Urgent attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="incidents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incidents">Incident Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>
                  Manage and review reported incidents across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`${getSeverityColor(incident.severity)} text-white`}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{incident.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {incident.location}
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${getStatusColor(incident.status)}`}>
                          {getStatusIcon(incident.status)}
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </div>
                      </div>
                      
                      <p className="text-sm">{incident.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Reported by: {incident.reportedBy}</span>
                        <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Reporter
                        </Button>
                        {incident.status === "pending" && (
                          <Button size="sm">
                            Mark as Investigating
                          </Button>
                        )}
                        {incident.status === "investigating" && (
                          <Button size="sm" variant="default">
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Trends</CardTitle>
                  <CardDescription>Weekly incident reporting patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    📊 Chart visualization would go here
                    <br />
                    (Integration with charting library needed)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Hotspots</CardTitle>
                  <CardDescription>Areas with highest incident reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Central Park, Delhi</span>
                      <Badge variant="destructive">12 incidents</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Connaught Place Metro</span>
                      <Badge variant="destructive">8 incidents</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Karol Bagh Market</span>
                      <Badge className="bg-orange-500">6 incidents</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>India Gate Area</span>
                      <Badge className="bg-yellow-500">4 incidents</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  👥 User management interface
                  <br />
                  (Feature to be implemented)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authority Panel Settings</CardTitle>
                <CardDescription>Configure dashboard preferences and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  ⚙️ Settings configuration
                  <br />
                  (Feature to be implemented)
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AuthorityPanel;