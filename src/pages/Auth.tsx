import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("otp");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - any 6-digit OTP works for now
    if (otp.length === 6) {
      navigate("/ad-adas-cars/homepage");
    }
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
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border focus:border-primary/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-400 hover:from-green-700 hover:to-emerald-500 text-white font-semibold"
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground text-center block">Enter One-Time Password</Label>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Sent to {email}
                </p>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-400 hover:from-green-700 hover:to-emerald-500 text-white font-semibold"
                disabled={otp.length !== 6}
              >
                Access Platform
              </Button>
              <Button 
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setStep("email")}
              >
                Back to Email
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Powered by CompassIQ Analytics</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
