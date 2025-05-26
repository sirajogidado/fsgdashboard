
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Camera } from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    profileImage: user?.profileImage || "/placeholder.svg"
  });

  const canEditDetails = user?.role === "Super User";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({ 
          ...prev, 
          profileImage: event.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
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
      profileImage: user?.profileImage || "/placeholder.svg"
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
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
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-ncaa-primary text-white rounded-full p-2 cursor-pointer hover:bg-ncaa-primary/80">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">Click the camera icon to change your profile picture</p>
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
                disabled={!isEditing || !canEditDetails}
                className={!canEditDetails ? "bg-gray-100" : ""}
              />
              {!canEditDetails && (
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
                disabled={!isEditing || !canEditDetails}
                className={!canEditDetails ? "bg-gray-100" : ""}
              />
              {!canEditDetails && (
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
              <Label>Directorate</Label>
              <Badge variant="outline" className="bg-gray-100">
                {user.directorate}
              </Badge>
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

      {canEditDetails && (
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
