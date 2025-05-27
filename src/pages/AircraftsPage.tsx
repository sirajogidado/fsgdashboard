
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Plane } from "lucide-react";

const AircraftsPage = () => {
  const mockAircrafts = [
    {
      id: '1',
      registration: '5N-ABC',
      type: 'Boeing 737-800',
      operator: 'Air Peace',
      status: 'Active',
      lastMaintenance: '2024-12-01'
    },
    {
      id: '2',
      registration: '5N-DEF',
      type: 'Airbus A320',
      operator: 'Arik Air',
      status: 'Maintenance',
      lastMaintenance: '2024-11-15'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aircraft Registry</h1>
          <p className="text-muted-foreground">
            Manage aircraft registrations and operational status
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Register Aircraft
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockAircrafts.map((aircraft) => (
          <Card key={aircraft.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                {aircraft.registration}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{aircraft.type}</p>
              <p className="text-sm text-gray-600">Operator: {aircraft.operator}</p>
              <div className="flex justify-between items-center">
                <Badge variant={aircraft.status === 'Active' ? 'default' : 'secondary'}>
                  {aircraft.status}
                </Badge>
                <span className="text-xs text-gray-500">
                  Last Maintenance: {aircraft.lastMaintenance}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AircraftsPage;
