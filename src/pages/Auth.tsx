import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to AD/ADAS homepage
    navigate("/ad-adas-cars/homepage");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse animation-delay-200" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse animation-delay-300" />
      </div>

      <Card className="w-full max-w-md mx-4 bg-black/40 backdrop-blur-lg border-primary/20 shadow-2xl animate-fade-in">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl text-center bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent font-bold">
            Welcome to CompassIQ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border focus:border-primary/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-400 hover:from-green-700 hover:to-emerald-500 text-white font-semibold"
            >
              Access Platform
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Powered by CompassIQ Analytics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
