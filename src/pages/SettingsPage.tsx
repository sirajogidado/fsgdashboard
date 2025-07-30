
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Manage your application preferences and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
