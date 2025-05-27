
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

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
    const { action } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'check_all') {
      // Run the certificate expiry check function
      const { error } = await supabase.rpc('check_certificate_expiry');
      if (error) throw error;

      // Calculate compliance score
      const { data: certificates } = await supabase
        .from('certificates')
        .select('*');

      const { data: alerts } = await supabase
        .from('compliance_alerts')
        .select('*')
        .eq('status', 'active');

      const totalCerts = certificates?.length || 1;
      const activeAlerts = alerts?.length || 0;
      const complianceScore = Math.max(50, 100 - (activeAlerts / totalCerts * 100));

      return new Response(JSON.stringify({
        success: true,
        complianceScore: Math.round(complianceScore),
        totalCertificates: totalCerts,
        activeAlerts
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in compliance-monitor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
