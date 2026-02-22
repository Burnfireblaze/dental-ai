import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Loader2,
  Zap,
  Shield,
  Users,
  FileText,
  MessageSquare,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { DentalAILogo, DentalAILogoBlue } from "../components/dental-ai-logo";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        onLogin();
        navigate("/home");
      } else {
        setError("Please enter valid credentials");
        setLoading(false);
      }
    }, 1000);
  };

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description:
        "Advanced AI detection of dental conditions with high accuracy",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description:
        "Separate interfaces for doctors, patients, and administrators",
    },
    {
      icon: FileText,
      title: "Clinical Reports",
      description:
        "Professional PDF-ready reports with AI findings and recommendations",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description:
        "Chat with AI for clinical insights and treatment recommendations",
    },
    {
      icon: Share2,
      title: "Secure Sharing",
      description:
        "Share records securely with patients and other healthcare providers",
    },
  ];

  const stats = [{ value: "<2s", label: "Average Analysis Time" }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Information Panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 mb-12">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center p-1.5">
              <DentalAILogoBlue className="h-full w-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">DentalAI</h1>
              <p className="text-blue-100 text-sm">
                Clinical Intelligence Platform
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-12">
            <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Transform Your <br />
              Dental Practice with <br />
              AI-Powered Insights
            </h2>
            <p className="text-blue-100 text-lg xl:text-xl">
              Comprehensive dental imaging analysis platform for modern
              healthcare professionals
            </p>
          </div>

          {/* Stats */}
          <div className="mb-12">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl xl:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 p-2">
              <DentalAILogo className="h-full w-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">DentalAI</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-Assisted Dental Imaging
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {/* Desktop Welcome */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to access your clinical dashboard
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">
                    Demo Access
                  </h4>
                  <p className="text-xs text-blue-800 mb-2">
                    Enter any credentials to explore the platform
                  </p>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Doctor:</span>
                      <span>View all clinical features</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Patient:</span>
                      <span>Access your records</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Admin:</span>
                      <span>Manage system settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secure • Encrypted</span>
              </div>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Request Access
              </button>
            </p>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden mt-8 grid grid-cols-1 gap-4 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
