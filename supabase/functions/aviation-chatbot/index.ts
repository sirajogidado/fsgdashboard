
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, context } = await req.json();

    // Aviation-specific knowledge base for responses
    const aviationKnowledge = {
      'aoc': 'Air Operator Certificate (AOC) is required for commercial air transport operations. Applications must include: 1) Completed Form NCAA-AOC-001, 2) Operations Manual, 3) Maintenance Program, 4) Financial documentation, 5) Insurance certificates. Processing time is typically 90-120 days.',
      'ato': 'Air Transport Operator license is for airlines conducting scheduled services. Requirements include valid AOC, route licensing, slot coordination, and compliance with Part 6 regulations.',
      'amo': 'Aircraft Maintenance Organization approval is required for maintenance service providers. Submit Form NCAA-AMO-001 with facility documentation, staff qualifications, and maintenance procedures manual.',
      'renewal': 'Certificate renewals should begin 60 days before expiry. Required documents include current certificate, updated manuals, recent audit reports, and renewal fees.',
      'forms': 'All NCAA forms are available on this platform under respective certificate sections. Common forms: AOC-001 (Air Operator), AMO-001 (Maintenance), ATO-001 (Transport).'
    };

    // Simple keyword matching for responses
    const lowerMessage = message.toLowerCase();
    let response = '';

    for (const [keyword, info] of Object.entries(aviationKnowledge)) {
      if (lowerMessage.includes(keyword)) {
        response = info;
        break;
      }
    }

    if (!response) {
      response = `Thank you for your question about "${message}". 

For specific guidance, I recommend:

• **Certificate Applications**: Visit the respective certificate section (AOC, ATO, AMO, etc.)
• **Forms**: All required forms are available in this platform
• **Regulations**: Refer to NCAA Civil Aviation Regulations
• **Support**: Contact your assigned inspector or our help desk

Is there a specific certificate type or procedure you'd like to know more about?`;
    }

    return new Response(JSON.stringify({
      response,
      sessionId,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in aviation-chatbot function:', error);
    return new Response(JSON.stringify({ 
      response: "I apologize, but I'm experiencing technical difficulties. Please contact support for immediate assistance with your aviation-related questions.",
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
