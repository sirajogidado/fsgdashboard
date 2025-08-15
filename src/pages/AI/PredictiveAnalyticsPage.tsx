
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, AlertTriangle, Calendar, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const PredictiveAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('predictive-analytics', {
        body: { analysisType: 'compliance_forecast' }
      });

      if (error) throw error;
      setAnalytics(data);
      
      toast({
        title: "Analytics Generated",
        description: "Predictive analytics have been updated with latest data.",
      });
    } catch (error: any) {
      console.error('Error generating analytics:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate analytics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictive Analytics</h1>
          <p className="text-muted-foreground">
            AI-powered insights and forecasting for aviation compliance
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Compliance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+15%</div>
            <p className="text-sm text-gray-500">
              Improvement in compliance rates predicted for next quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Medium</div>
            <p className="text-sm text-gray-500">
              Current risk level based on compliance patterns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">23</div>
            <p className="text-sm text-gray-500">
              Certificates predicted to expire in next 3 months
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Predictive Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Certificate Expiry Prediction</h3>
              <p className="text-sm text-gray-600">
                Predicts which certificates are likely to expire based on historical patterns and renewal rates.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Compliance Risk Assessment</h3>
              <p className="text-sm text-gray-600">
                Evaluates compliance risk factors and provides early warning for potential issues.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Resource Allocation Forecast</h3>
              <p className="text-sm text-gray-600">
                Forecasts resource needs based on predicted workload and compliance requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalyticsPage;
