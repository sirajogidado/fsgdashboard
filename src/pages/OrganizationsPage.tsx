
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building } from "lucide-react";

const OrganizationsPage = () => {
  const mockOrganizations = [
    {
      id: '1',
      name: 'Air Peace Limited',
      type: 'Air Operator',
      status: 'Active',
      certificates: ['AOC', 'ATO'],
      location: 'Lagos'
    },
    {
      id: '2',
      name: 'Arik Air Limited',
      type: 'Air Operator',
      status: 'Active',
      certificates: ['AOC'],
      location: 'Lagos'
    },
    {
      id: '3',
      name: 'Caverton Helicopters',
      type: 'AMO',
      status: 'Active',
      certificates: ['AMO'],
      location: 'Lagos'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage aviation organizations and their certifications
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockOrganizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {org.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="font-medium">{org.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="font-medium">{org.location}</span>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-gray-600">Certificates:</span>
                <div className="flex gap-1 flex-wrap">
                  {org.certificates.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge variant={org.status === 'Active' ? 'default' : 'secondary'}>
                {org.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrganizationsPage;
