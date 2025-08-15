import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileUrl, extractedText } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user context
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const analysisPrompt = `Analyze this aviation document and extract key information:
    
    Document: ${fileName}
    Content: ${extractedText}
    
    Please analyze for:
    1. Document type (AOC, ATO certificate, maintenance manual, etc.)
    2. Key dates (issue date, expiry date, renewal dates)
    3. Certificate numbers or reference numbers
    4. Issuing authority
    5. Compliance status
    6. Any potential issues or flags
    7. Recommendations
    
    Return analysis in JSON format with structured data.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert aviation document analyst for NCAA Nigeria.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    let parsedAnalysis;
    let confidenceScore = 0.8;
    
    try {
      parsedAnalysis = JSON.parse(analysis);
      confidenceScore = 0.9;
    } catch {
      parsedAnalysis = { raw_analysis: analysis, structured: false };
      confidenceScore = 0.7;
    }

    // Store analysis result
    const { data: analysisRecord } = await supabase
      .from('document_analysis')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_url: fileUrl,
        extracted_text: extractedText,
        analysis_result: parsedAnalysis,
        confidence_score: confidenceScore,
        status: 'completed'
      })
      .select()
      .single();

    return new Response(JSON.stringify({ 
      analysis: parsedAnalysis,
      confidence: confidenceScore,
      id: analysisRecord.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in document-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});