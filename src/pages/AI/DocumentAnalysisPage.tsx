
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Search, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const DocumentAnalysisPage = () => {
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('document_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Extract text (simplified - in real implementation you'd use OCR)
      const extractedText = `Extracted text from ${file.name}. This would contain the actual document content in a real implementation.`;

      setIsAnalyzing(true);

      // Call AI analysis function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('document-analysis', {
        body: {
          fileName: file.name,
          fileUrl: publicUrl,
          extractedText: extractedText
        }
      });

      if (analysisError) throw analysisError;

      setCurrentAnalysis(analysisData);
      fetchRecentAnalyses();

      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed successfully.",
      });

    } catch (error: any) {
      console.error('Error uploading/analyzing document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
      event.target.value = '';
    }
  };

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
              <Button disabled={isUploading} asChild>
                <label>
                  {isUploading ? "Uploading..." : "Choose File"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
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
              {recentAnalyses.length > 0 ? (
                recentAnalyses.map((analysis) => (
                  <div 
                    key={analysis.id} 
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setCurrentAnalysis(analysis)}
                  >
                    <p className="font-medium">{analysis.file_name}</p>
                    <p className="text-sm text-gray-500">
                      Analyzed {new Date(analysis.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600">Confidence: {(analysis.confidence_score * 100).toFixed(1)}%</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No analyses yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
              <span>Analyzing document...</span>
            </div>
          ) : currentAnalysis ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600">File Name</h4>
                  <p className="text-sm">{currentAnalysis.file_name || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600">Confidence Score</h4>
                  <p className="text-sm">{currentAnalysis.confidence ? (currentAnalysis.confidence * 100).toFixed(1) + '%' : 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Analysis Result</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {typeof currentAnalysis.analysis === 'object' ? (
                    <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(currentAnalysis.analysis, null, 2)}</pre>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{currentAnalysis.analysis || currentAnalysis.content || 'No analysis available'}</p>
                  )}
                </div>
              </div>
              
              {currentAnalysis.file_url && (
                <Button variant="outline" asChild>
                  <a href={currentAnalysis.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Upload a document or select a recent analysis to see results here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalysisPage;
