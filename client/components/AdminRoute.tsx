import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Lock } from "lucide-react";
import Layout from "./Layout";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthorized, loading, checkAdminAccess } = useAdminAuth();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verifying admin access...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const accessCheck = checkAdminAccess();

  if (!accessCheck.authorized) {
    if (accessCheck.reason === "not_authenticated") {
      return <Navigate to="/login" replace />;
    }

    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Access Denied
                </CardTitle>
                <CardDescription>
                  You don't have permission to access the Authority Panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    {accessCheck.reason === "not_admin" 
                      ? "This area is restricted to authorized personnel only."
                      : "Authentication required to access this resource."
                    }
                  </AlertDescription>
                </Alert>
                
                <div className="text-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 inline mr-1" />
                  SafeZone.ai Authority Panel
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;