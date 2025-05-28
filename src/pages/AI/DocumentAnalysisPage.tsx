
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Search } from "lucide-react";

const DocumentAnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered analysis of aviation documents and certificates
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Upload a document for analysis</p>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
              </p>
              <Button>
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recent Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="font-medium">AOC Certificate Analysis</p>
                <p className="text-sm text-gray-500">Analyzed 2 hours ago</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium">Maintenance Manual Review</p>
                <p className="text-sm text-gray-500">Analyzed 1 day ago</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-medium">Pilot Training Certificate</p>
                <p className="text-sm text-gray-500">Analyzed 2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Upload a document to see AI analysis results here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalysisPage;
