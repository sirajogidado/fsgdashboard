
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Plane } from "lucide-react";

const AerodromesPage = () => {
  const mockAerodromes = [
    {
      id: '1',
      name: 'Murtala Muhammed International Airport',
      code: 'DNMM',
      location: 'Lagos',
      status: 'Operational',
      runways: 2,
      category: 'International'
    },
    {
      id: '2',
      name: 'Nnamdi Azikiwe International Airport',
      code: 'DNAA',
      location: 'Abuja',
      status: 'Operational',
      runways: 1,
      category: 'International'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aerodromes</h1>
          <p className="text-muted-foreground">
            Manage aerodrome certifications and operational status
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Aerodrome
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockAerodromes.map((aerodrome) => (
          <Card key={aerodrome.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                {aerodrome.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ICAO Code:</span>
                <span className="font-medium">{aerodrome.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="font-medium">{aerodrome.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Runways:</span>
                <span className="font-medium">{aerodrome.runways}</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="default">{aerodrome.category}</Badge>
                <Badge variant={aerodrome.status === 'Operational' ? 'default' : 'secondary'}>
                  {aerodrome.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AerodromesPage;
