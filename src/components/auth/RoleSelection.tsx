import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserStore } from "@/stores/userStore";
import { User, Stethoscope, Shield } from "lucide-react";

type UserRole = "patient" | "doctor" | "admin";

interface RoleSelectionProps {
  authUser: any;
  onComplete: () => void;
}

export const RoleSelection = ({ authUser, onComplete }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [fullName, setFullName] = useState(authUser.user_metadata?.full_name || "");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useUserStore();

  const roleOptions = [
    {
      value: "patient" as const,
      label: "Patient",
      description: "Book appointments and access medical records",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      value: "doctor" as const,
      label: "Doctor",
      description: "Manage patients and appointments",
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      value: "admin" as const,
      label: "Admin", 
      description: "Manage clinic operations and staff",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Creating profile for role:', selectedRole);

      let profileData: any = null;

      if (selectedRole === "patient") {
        const { data, error } = await supabase
          .from('patients')
          .insert({
            user_id: authUser.id,
            full_name: fullName,
            phone: phone || null,
          })
          .select()
          .single();

        if (error) throw error;
        profileData = data;

      } else if (selectedRole === "doctor") {
        if (!specialization.trim()) {
          toast({
            title: "Specialization required",
            description: "Please enter your medical specialization.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('doctors')
          .insert({
            user_id: authUser.id,
            full_name: fullName,
            email: authUser.email,
            specialization: specialization,
            phone: phone || null,
          })
          .select()
          .single();

        if (error) throw error;
        profileData = data;

      } else if (selectedRole === "admin") {
        const { data, error } = await supabase
          .from('admins')
          .insert({
            user_id: authUser.id,
            full_name: fullName,
            email: authUser.email,
            phone: phone || null,
          })
          .select()
          .single();

        if (error) throw error;
        profileData = data;
      }

      // Log the user in with their selected role
      login({
        id: authUser.id,
        email: authUser.email,
        fullName: fullName,
        role: selectedRole
      });

      toast({
        title: "Profile created successfully!",
        description: `Welcome to AloraMed! Your ${selectedRole} account is ready.`,
      });

      onComplete();

    } catch (error: any) {
      console.error('Error creating profile:', error);
      
      // Handle duplicate user errors
      if (error.code === '23505') {
        toast({
          title: "Profile already exists",
          description: "A profile for this role already exists. Please contact support if you need assistance.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile creation failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-slate-600">
            Choose your role to get started with AloraMed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Select Your Role</h3>
              
              <div className="grid gap-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`relative rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRole === option.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedRole(option.value)}
                    >
                      <div className="flex items-center p-4">
                        <div className={`${option.bgColor} p-2 rounded-lg mr-4`}>
                          <Icon className={`h-6 w-6 ${option.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{option.label}</h4>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedRole === option.value
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}>
                          {selectedRole === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Role-specific fields */}
            {selectedRole === "doctor" && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Medical Specialization *</Label>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Practice">General Practice</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {specialization === "Other" && (
                  <Input
                    placeholder="Please specify your specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full healthcare-gradient text-white hover:opacity-90 transition-opacity"
              disabled={isLoading || !fullName.trim()}
            >
              {isLoading ? "Creating Profile..." : `Continue as ${roleOptions.find(r => r.value === selectedRole)?.label}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};