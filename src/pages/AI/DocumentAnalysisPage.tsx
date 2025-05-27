
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";

const DocumentAnalysisPage = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setProgress(20);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;

      setProgress(50);

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      setProgress(70);

      // Save document analysis record
      const { data: analysisRecord, error: dbError } = await supabase
        .from('document_analysis')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          status: 'processing'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setProgress(90);

      // Call AI analysis function
      await analyzeDocument(analysisRecord.id, publicUrl, file.name);

      setProgress(100);
      toast({
        title: "Upload Successful",
        description: "Document uploaded and analysis started.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const analyzeDocument = async (analysisId: string, fileUrl: string, fileName: string) => {
    setAnalyzing(true);

    try {
      // Call the document analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          analysisId,
          fileUrl,
          fileName,
          documentType: 'aviation_certificate'
        }
      });

      if (error) throw error;

      setAnalysisResult(data);

      toast({
        title: "Analysis Complete",
        description: "Document has been successfully analyzed.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Document Analysis & OCR</h1>
        <p className="text-muted-foreground">
          Upload aviation certificates and documents for AI-powered analysis and data extraction
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="document">Select Document</Label>
              <Input
                id="document"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                disabled={uploading || analyzing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG, TIFF
              </p>
            </div>

            {(uploading || analyzing) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{uploading ? "Uploading..." : "Analyzing..."}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || analyzing}
              className="w-full"
            >
              {uploading ? "Uploading..." : analyzing ? "Analyzing..." : "Choose File"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Analysis Complete</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Extracted Data:</h4>
                  <div className="grid gap-2">
                    {Object.entries(analysisResult.extractedData || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                        <span>{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Confidence Score</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={(analysisResult.confidence || 0) * 100} className="flex-1" />
                    <Badge variant="outline">
                      {Math.round((analysisResult.confidence || 0) * 100)}%
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Upload a document to see analysis results</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supported Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">AOC Certificates</h3>
              <p className="text-xs text-gray-500">Air Operator Certificates</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">ATO Certificates</h3>
              <p className="text-xs text-gray-500">Air Transport Operator</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium">AMO Certificates</h3>
              <p className="text-xs text-gray-500">Aircraft Maintenance</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-medium">Aircraft Registration</h3>
              <p className="text-xs text-gray-500">Registration Documents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAnalysisPage;
