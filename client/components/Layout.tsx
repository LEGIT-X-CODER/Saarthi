import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Shield,
  Map,
  AlertTriangle,
  Users,
  Phone,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Chatbot from "./Chatbot";
import { ThemeToggle } from "./ThemeToggle";
import SOSButton from "./SOSButton";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();
  const { isAdmin } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navigation = [
    { name: "Home", href: "/", icon: Shield },
    { name: "Safety Map", href: "/safety-map", icon: Map },
    { name: "Report Incident", href: "/report-incident", icon: AlertTriangle },
    { name: "Community", href: "/community", icon: Users },
    { name: "Features", href: "/features", icon: Shield },
    { name: "Reviews", href: "/reviews", icon: Users },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header
        className={cn(
          "z-50",
          location.pathname === "/"
            ? "absolute top-0 left-0 right-0 bg-transparent"
            : "sticky top-0 backdrop-blur-md bg-background/60 shadow-lg",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F5bd1553efac94655a6a311a554d81a53%2Feb3e34e99a9b4c59b134279ae535a885?format=webp&width=192"
                  alt="SAARTHI logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-foreground">SAARTHI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                      isActiveLink(item.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle and CTA Button or User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.photoURL || ''} />
                        <AvatarFallback className="bg-gradient-teal-blue text-white text-xs">
                          {userProfile ? getInitials(userProfile.displayName) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">
                          {userProfile?.displayName || 'User'}
                        </p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/authority-panel" className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            Authority Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-teal-blue hover:opacity-90 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                        isActiveLink(item.href)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                  {currentUser ? (
                    <div className="space-y-2">
                      <Link to="/profile">
                        <Button variant="outline" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                      <Button 
                        onClick={handleLogout}
                        variant="destructive" 
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="w-full bg-gradient-teal-blue hover:bg-gradient-lime-cyan text-white shadow-glow-teal hover:shadow-glow-blue transition-all duration-300">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F5bd1553efac94655a6a311a554d81a53%2Feb3e34e99a9b4c59b134279ae535a885?format=webp&width=128"
                    alt="SAARTHI logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-xl font-bold">SAARTHI</span>
              </div>
              <p className="text-blue-100 mb-4">
                Real-time travel safety intelligence powered by AI. Stay
                informed, stay safe, explore with confidence.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-100 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-100 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-blue-100 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <a href="/safety-map" className="hover:text-white">
                    Safety Heatmap
                  </a>
                </li>
                <li>
                  <a href="/report-incident" className="hover:text-white">
                    Incident Reporting
                  </a>
                </li>
                <li>
                  <a href="/features" className="hover:text-white">
                    Risk Assessment
                  </a>
                </li>
                <li>
                  <a href="/features" className="hover:text-white">
                    Real-time Alerts
                  </a>
                </li>
                <li>
                  <a href="/features" className="hover:text-white">
                    Travel Planning
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <a href="/features" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/features" className="hover:text-white">
                    API Access
                  </a>
                </li>
                <li>
                  <a href="/features" className="hover:text-white">
                    Partnerships
                  </a>
                </li>
                <li>
                  <a href="/features" className="hover:text-white">
                    Press Kit
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-400 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-100">
                © 2025 SAARTHI. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-blue-100 hover:text-white text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-blue-100 hover:text-white text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-blue-100 hover:text-white text-sm">
                  Data Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* SOS Button */}
      <SOSButton />
      
      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  );
}

export default Layout;
