import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Calendar, Users } from "lucide-react";

const DAASPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Directorate of Aerodrome and Aerospace Standards (DAAS)
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive management for aerodrome standards and aerospace operations
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Construction className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Coming Soon</h2>
            <p className="text-muted-foreground max-w-md">
              This module is currently under development. It will include comprehensive
              features for managing aerodrome standards, aerospace operations, and related certifications.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aerodrome Certifications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">-</div>
            <p className="text-xs text-muted-foreground">
              Manage aerodrome certifications and compliance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Standards</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">-</div>
            <p className="text-xs text-muted-foreground">
              Track safety standards and inspections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">-</div>
            <p className="text-xs text-muted-foreground">
              Monitor personnel certifications and training
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expected Features */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3" />
              <div>
                <p className="font-medium">Aerodrome Licensing</p>
                <p className="text-sm text-muted-foreground">
                  Complete management of aerodrome licenses and certifications
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3" />
              <div>
                <p className="font-medium">Standards Compliance</p>
                <p className="text-sm text-muted-foreground">
                  Track and monitor compliance with aerospace standards
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3" />
              <div>
                <p className="font-medium">Inspection Management</p>
                <p className="text-sm text-muted-foreground">
                  Schedule and track aerodrome inspections and audits
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3" />
              <div>
                <p className="font-medium">Safety Reports</p>
                <p className="text-sm text-muted-foreground">
                  Generate comprehensive safety and compliance reports
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3" />
              <div>
                <p className="font-medium">Personnel Management</p>
                <p className="text-sm text-muted-foreground">
                  Manage personnel certifications, training, and qualifications
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DAASPage;
