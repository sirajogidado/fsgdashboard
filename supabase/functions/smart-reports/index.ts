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
    const { reportType, title, dataFilters } = await req.json();
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

    // Gather comprehensive data from all relevant tables
    const [
      certificates,
      aocData,
      atoData,
      documentAnalysis,
      predictiveData,
      auditTrail
    ] = await Promise.all([
      supabase.from('certificates').select('*'),
      supabase.from('aoc_certificates').select('*'),
      supabase.from('ato_certificates').select('*').limit(50),
      supabase.from('document_analysis').select('*').limit(50),
      supabase.from('predictive_analytics').select('*').limit(20),
      supabase.from('audit_trail').select('*').limit(100)
    ]);

    const comprehensiveData = {
      certificates: certificates.data || [],
      aoc_certificates: aocData.data || [],
      ato_certificates: atoData.data || [],
      document_analyses: documentAnalysis.data || [],
      predictive_insights: predictiveData.data || [],
      audit_activities: auditTrail.data || [],
      report_type: reportType,
      generated_at: new Date().toISOString()
    };

    const reportPrompt = `Generate a comprehensive ${reportType} report for NCAA Flight Standards Group:

    Title: ${title}
    
    Data Available:
    - Certificates: ${comprehensiveData.certificates.length}
    - AOC Certificates: ${comprehensiveData.aoc_certificates.length}
    - ATO Certificates: ${comprehensiveData.ato_certificates.length}
    - Document Analyses: ${comprehensiveData.document_analyses.length}
    - Predictive Insights: ${comprehensiveData.predictive_insights.length}
    - Audit Activities: ${comprehensiveData.audit_activities.length}

    Please create a professional report with:
    1. Executive Summary
    2. Key Performance Indicators
    3. Compliance Status Overview
    4. Risk Assessment
    5. Trends and Patterns
    6. Recommendations
    7. Action Items
    8. Appendices with data insights

    Format as structured HTML report that can be displayed in a web interface.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a senior aviation compliance analyst creating professional reports for NCAA Nigeria.' },
          { role: 'user', content: reportPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const reportContent = data.choices[0].message.content;

    // Store report
    const { data: reportRecord } = await supabase
      .from('ai_reports')
      .insert({
        user_id: user.id,
        report_type: reportType,
        title: title,
        content: reportContent,
        data_sources: comprehensiveData,
        status: 'generated'
      })
      .select()
      .single();

    return new Response(JSON.stringify({ 
      reportId: reportRecord.id,
      content: reportContent,
      dataSources: Object.keys(comprehensiveData).length,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in smart-reports function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});