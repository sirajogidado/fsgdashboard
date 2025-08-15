
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Camera, User } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [directorates, setDirectorates] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    profileImage: user?.profileImage || "/placeholder.svg",
    directorate: user?.directorate || ""
  });

  const isSuperUser = user?.role === "Super User";

  useEffect(() => {
    fetchDirectorates();
  }, []);

  const fetchDirectorates = async () => {
    try {
      const { data, error } = await supabase
        .from('directorates')
        .select('*')
        .order('directorate_name');

      if (error) throw error;
      setDirectorates(data || []);
    } catch (error) {
      console.error('Error fetching directorates:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Upload to Supabase storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id || 'user'}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        setProfileData(prev => ({ 
          ...prev, 
          profileImage: publicUrl 
        }));

        toast({
          title: "Image uploaded",
          description: "Your profile image has been updated.",
        });
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      profileImage: user?.profileImage || "/placeholder.svg",
      directorate: user?.directorate || ""
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {profileData.profileImage && profileData.profileImage !== "/placeholder.svg" ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-ncaa-primary text-white rounded-full p-2 cursor-pointer hover:bg-ncaa-primary/80 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Click the camera icon to upload your profile picture
              <br />
              <span className="text-xs text-gray-500">Maximum file size: 5MB</span>
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing || !isSuperUser}
                className={!isSuperUser ? "bg-gray-100" : ""}
              />
              {!isSuperUser && (
                <p className="text-xs text-gray-500">Only Super Users can edit name</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing || !isSuperUser}
                className={!isSuperUser ? "bg-gray-100" : ""}
              />
              {!isSuperUser && (
                <p className="text-xs text-gray-500">Only Super Users can edit email</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Badge
                className={
                  user.role === "Super User"
                    ? "bg-purple-100 text-purple-800 border-purple-300"
                    : user.role === "Technical"
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }
              >
                {user.role}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorate">Directorate</Label>
              {isEditing && isSuperUser ? (
                <Select
                  value={profileData.directorate}
                  onValueChange={(value) => setProfileData(prev => ({ ...prev, directorate: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select directorate" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {directorates.map((dir) => (
                      <SelectItem key={dir.id} value={dir.directorate_name}>
                        {dir.directorate_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="bg-gray-100">
                  {user?.directorate}
                </Badge>
              )}
              {!isSuperUser && (
                <p className="text-xs text-gray-500">Only Super Users can edit directorate</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isSuperUser && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
