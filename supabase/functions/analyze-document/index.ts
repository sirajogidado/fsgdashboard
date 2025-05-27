
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysisId, fileUrl, fileName, documentType } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Simulate OCR and document analysis
    const mockAnalysis = {
      extractedData: {
        certificate_number: "AOC-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        issue_date: "2024-01-15",
        expiry_date: "2025-01-15",
        issuing_authority: "Nigerian Civil Aviation Authority",
        certificate_type: documentType === 'aviation_certificate' ? 'AOC' : 'Unknown',
        holder_name: "Sample Aviation Company",
        aircraft_types: ["Boeing 737", "Airbus A320"]
      },
      confidence: 0.92,
      text_content: "This is extracted text from the aviation certificate...",
      document_classification: documentType
    };

    // Update the document analysis record
    const { error: updateError } = await supabase
      .from('document_analysis')
      .update({
        analysis_result: mockAnalysis,
        extracted_text: mockAnalysis.text_content,
        confidence_score: mockAnalysis.confidence,
        status: 'completed'
      })
      .eq('id', analysisId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({
      success: true,
      extractedData: mockAnalysis.extractedData,
      confidence: mockAnalysis.confidence,
      analysisId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-document function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
