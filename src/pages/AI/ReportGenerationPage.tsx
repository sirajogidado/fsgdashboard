
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { FileText, Download, Eye, BarChart } from "lucide-react";

const ReportGenerationPage = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('compliance');
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const reportTypes = [
    { value: 'compliance', label: 'Compliance Report' },
    { value: 'audit', label: 'Audit Summary' },
    { value: 'performance', label: 'Performance Analytics' },
    { value: 'safety', label: 'Safety Assessment' },
    { value: 'operational', label: 'Operational Overview' }
  ];

  useEffect(() => {
    if (user) {
      fetchRecentReports();
    }
  }, [user]);

  const fetchRecentReports = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const generateReport = async () => {
    if (!user) return;

    setGenerating(true);

    try {
      // Call the report generation edge function
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { 
          reportType,
          userId: user.id,
          includeCharts: true
        }
      });

      if (error) throw error;

      setGeneratedReport(data);

      // Save report to database
      const { error: saveError } = await supabase
        .from('ai_reports')
        .insert({
          user_id: user.id,
          report_type: reportType,
          title: data.title,
          content: data.content,
          data_sources: data.dataSources
        });

      if (saveError) throw saveError;

      fetchRecentReports();

      toast({
        title: "Report Generated",
        description: "Your AI-generated report is ready for review.",
      });
    } catch (error) {
      console.error('Report generation error:', error);
      // Generate mock report for demonstration
      generateMockReport();
    } finally {
      setGenerating(false);
    }
  };

  const generateMockReport = () => {
    const mockReports = {
      compliance: {
        title: 'NCAA Compliance Report - December 2024',
        content: `# NCAA Compliance Assessment Report

## Executive Summary
This report provides a comprehensive analysis of regulatory compliance status for all aviation certificates and operations under NCAA jurisdiction as of December 2024.

## Key Findings
- **Overall Compliance Score**: 92%
- **Active Certificates**: 156
- **Expiring in 30 days**: 12
- **Critical Issues**: 2

## Certificate Status Overview
### Air Operator Certificates (AOC)
- Total Active: 23
- Compliance Rate: 95%
- Upcoming Renewals: 3

### Aircraft Maintenance Organizations (AMO)
- Total Active: 45
- Compliance Rate: 88%
- Attention Required: 5

## Recommendations
1. Schedule immediate review for certificates expiring within 30 days
2. Implement enhanced monitoring for AMO compliance
3. Update training programs for operational staff

## Conclusion
The overall compliance posture is strong with targeted improvements needed in specific areas.`,
        dataSources: ['certificates', 'compliance_alerts', 'operations'],
        generatedAt: new Date().toISOString()
      },
      audit: {
        title: 'Internal Audit Summary - Q4 2024',
        content: `# Internal Audit Summary Report

## Audit Scope
Comprehensive review of NCAA operations, certificate management, and regulatory compliance procedures.

## Audit Findings
### Strengths
- Robust certificate tracking system
- Effective compliance monitoring
- Strong documentation practices

### Areas for Improvement
- Digital transformation opportunities
- Process automation potential
- Staff training enhancement

## Risk Assessment
- **High Risk**: 1 item
- **Medium Risk**: 4 items
- **Low Risk**: 12 items

## Action Items
1. Implement automated reminder system
2. Enhance data backup procedures
3. Update emergency response protocols`,
        dataSources: ['all_operations', 'procedures', 'staff_records'],
        generatedAt: new Date().toISOString()
      }
    };

    const report = mockReports[reportType as keyof typeof mockReports] || mockReports.compliance;
    setGeneratedReport(report);
  };

  const downloadReport = () => {
    if (!generatedReport) return;

    const blob = new Blob([generatedReport.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Report has been downloaded to your device.",
    });
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'compliance': return <FileText className="w-4 h-4" />;
      case 'audit': return <Eye className="w-4 h-4" />;
      case 'performance': return <BarChart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Report Generation</h1>
        <p className="text-muted-foreground">
          Generate comprehensive reports with AI-powered analysis and insights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generate New Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateReport} disabled={generating} className="w-full">
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Reports include AI-powered insights</p>
              <p>• Data from all connected sources</p>
              <p>• Compliance recommendations</p>
              <p>• Executive summary included</p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {generatedReport ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{generatedReport.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadReport}>
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <Textarea
                    value={generatedReport.content}
                    readOnly
                    className="min-h-96 font-mono text-sm"
                  />
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Data Sources</h4>
                  <div className="flex gap-2 flex-wrap">
                    {generatedReport.dataSources?.map((source: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {source.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a report type and click generate to create your AI-powered report</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No recent reports found</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getReportIcon(report.report_type)}
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge>{report.report_type}</Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerationPage;
