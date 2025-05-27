
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration form state
  const [regEmail, setRegEmail] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPhoneNumber, setRegPhoneNumber] = useState("");
  const [regDirectorate, setRegDirectorate] = useState("");
  const [regRole, setRegRole] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(loginEmail, loginPassword);
      
      if (success) {
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regEmail || !regFullName || !regDirectorate || !regRole) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      const { error } = await supabase
        .from('pending_registrations')
        .insert({
          email: regEmail,
          full_name: regFullName,
          phone_number: regPhoneNumber || null,
          requested_directorate: regDirectorate,
          requested_role: regRole,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Error",
            description: "An account with this email already exists or is pending approval",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Registration Submitted",
          description: "Your registration request has been submitted for approval. You will be contacted once approved.",
        });
        
        // Clear form
        setRegEmail("");
        setRegFullName("");
        setRegPhoneNumber("");
        setRegDirectorate("");
        setRegRole("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const directorates = [
    "ICT",
    "Flight Safety",
    "Airworthiness",
    "Air Transport",
    "Personnel Licensing",
    "Aerodrome and Airspace",
    "Legal",
    "Finance and Administration"
  ];

  const roles = [
    "Read and View",
    "Technical"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ncaa-primary to-ncaa-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/660cad38-3239-4b0f-8012-a92a08141716.png" 
              alt="NCAA Logo" 
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-2xl text-center">
            NCAA Aviation Dashboard
          </CardTitle>
          <p className="text-center text-gray-600">
            Sign in to access the aviation management system
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegistration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email *</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={isRegistering}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name *</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    disabled={isRegistering}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={regPhoneNumber}
                    onChange={(e) => setRegPhoneNumber(e.target.value)}
                    disabled={isRegistering}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-directorate">Directorate *</Label>
                  <Select 
                    value={regDirectorate} 
                    onValueChange={setRegDirectorate}
                    disabled={isRegistering}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your directorate" />
                    </SelectTrigger>
                    <SelectContent>
                      {directorates.map((directorate) => (
                        <SelectItem key={directorate} value={directorate}>
                          {directorate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-role">Requested Role *</Label>
                  <Select 
                    value={regRole} 
                    onValueChange={setRegRole}
                    disabled={isRegistering}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select requested role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Registration
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Your registration will be reviewed by an administrator
                </p>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-center text-gray-500">
              Nigerian Civil Aviation Authority<br />
              Aviation Safety Management System
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
