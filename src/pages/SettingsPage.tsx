
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-ncaa-primary" />
        <h1 className="text-2xl font-bold text-ncaa-primary">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and general settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" value="English" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" value="Africa/Lagos" readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch id="sms-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="system-alerts">System Alerts</Label>
              <Switch id="system-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your security preferences and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="session-timeout">Auto Session Timeout</Label>
              <Switch id="session-timeout" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session-duration">Session Duration (minutes)</Label>
              <Input id="session-duration" type="number" value="30" />
            </div>
            
            <Button variant="outline" className="w-full">
              View Login History
            </Button>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Control your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-analytics">Usage Analytics</Label>
              <Switch id="data-analytics" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="data-backup">Automatic Data Backup</Label>
              <Switch id="data-backup" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Download My Data
              </Button>
              <Button variant="outline" className="w-full">
                Request Data Deletion
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>
              Current system status and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="font-medium">Application Version</Label>
                <p className="text-gray-600">v2.1.0</p>
              </div>
              <div>
                <Label className="font-medium">Last Updated</Label>
                <p className="text-gray-600">2024-12-20</p>
              </div>
              <div>
                <Label className="font-medium">Database Status</Label>
                <p className="text-green-600">Connected</p>
              </div>
              <div>
                <Label className="font-medium">User Role</Label>
                <p className="text-gray-600">{user?.role}</p>
              </div>
              <div>
                <Label className="font-medium">Directorate</Label>
                <p className="text-gray-600">{user?.directorate}</p>
              </div>
              <div>
                <Label className="font-medium">Server Status</Label>
                <p className="text-green-600">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-ncaa-primary hover:bg-opacity-90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
