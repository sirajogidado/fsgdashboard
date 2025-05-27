
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, includeRecommendations } = await req.json();

    // Mock intelligent search results
    const mockResults = [
      {
        id: '1',
        type: 'certificate',
        title: `Air Operator Certificate - ${query}`,
        description: 'AOC for scheduled passenger operations, expires March 2025',
        relevance: 0.95,
        category: 'AOC',
        lastUpdated: '2024-12-15'
      },
      {
        id: '2',
        type: 'document',
        title: `Flight Operations Manual - ${query}`,
        description: 'Emergency procedures and safety protocols',
        relevance: 0.88,
        category: 'Documentation',
        lastUpdated: '2024-12-10'
      },
      {
        id: '3',
        type: 'regulation',
        title: `NCAA Regulation Part 6 - ${query}`,
        description: 'Requirements for air operator certificate applications',
        relevance: 0.82,
        category: 'Regulation',
        lastUpdated: '2024-11-20'
      }
    ];

    const recommendations = includeRecommendations ? [
      {
        id: 'rec1',
        type: 'certificate',
        title: 'Related AOC Requirements',
        description: 'Based on your search, you might need these documents',
        relevance: 0.90
      }
    ] : [];

    return new Response(JSON.stringify({
      results: mockResults,
      recommendations,
      query,
      totalResults: mockResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in intelligent-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
