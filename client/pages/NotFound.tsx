import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://cdn.builder.io/api/v1/image/assets%2F5bd1553efac94655a6a311a554d81a53%2F3f2ac2ddc7544ae1b748719e2dd93a11?format=webp&width=1600')",
        }}
      >
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-treksure-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white dark:text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              The page you're looking for doesn't exist. Let's get you back to SAARTHI.
            </p>
            <div className="space-y-3">
              <Link to="/">
                <Button className="w-full bg-treksure-blue hover:bg-treksure-blue-dark">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link
                  to="/contact"
                  className="text-treksure-blue hover:underline"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotFound;
