
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin } from "lucide-react";

const OperationsPage = () => {
  const mockOperations = [
    {
      id: '1',
      flightNumber: 'AP101',
      route: 'LOS - ABV',
      aircraft: '5N-ABC',
      status: 'On Time',
      departure: '08:00',
      arrival: '09:30'
    },
    {
      id: '2',
      flightNumber: 'W3502',
      route: 'ABV - LOS',
      aircraft: '5N-DEF',
      status: 'Delayed',
      departure: '14:30',
      arrival: '16:00'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flight Operations</h1>
          <p className="text-muted-foreground">
            Monitor and manage flight operations and schedules
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Operation
        </Button>
      </div>

      <div className="space-y-4">
        {mockOperations.map((operation) => (
          <Card key={operation.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-medium">{operation.flightNumber}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    {operation.route}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={operation.status === 'On Time' ? 'default' : 'destructive'}>
                    {operation.status}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {operation.departure} - {operation.arrival}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OperationsPage;
