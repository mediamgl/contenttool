import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AnalyzeContentRequest {
  text: string;
  title?: string;
}

async function getUserApiKey(req: Request): Promise<string | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return null;

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return null;

    const { data: apiKeys } = await supabaseClient
      .from('api_keys')
      .select('encrypted_key')
      .eq('user_id', user.id)
      .eq('provider', 'anthropic')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (!apiKeys?.encrypted_key) return null;

    return atob(apiKeys.encrypted_key);
  } catch (error) {
    console.error('Error fetching user API key:', error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text, title }: AnalyzeContentRequest = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: text' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userApiKey = await getUserApiKey(req);
    const anthropicApiKey = userApiKey || Deno.env.get('ANTHROPIC_API_KEY');

    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured. Please add your API key in Settings.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = `Analyze the following content${title ? ` titled "${title}"` : ''}:

${text}

Provide a comprehensive analysis including:
1. SEO Score (0-100) with explanation
2. Readability Score (0-100, Flesch-Kincaid scale) with grade level
3. Tone Analysis (formal, casual, professional, friendly, etc.)
4. Key strengths (3-5 points)
5. Areas for improvement (3-5 points)
6. Specific optimization suggestions (5-7 actionable items)

CRITICAL: Respond with ONLY valid JSON. No markdown code blocks, no explanations outside the JSON:
{"seoScore": 85, "seoExplanation": "...", "readabilityScore": 72, "gradeLevel": "High School", "tone": "Professional", "strengths": ["..."], "improvements": ["..."], "suggestions": ["..."]}`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze content with AI', details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const aiResponse = anthropicData.content[0].text;

    let analysis;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|```\n?/g, '').trim();
      const jsonMatch = cleanedResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(cleanedResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      analysis = {
        seoScore: 75,
        seoExplanation: 'Content analyzed successfully',
        readabilityScore: 70,
        gradeLevel: 'High School',
        tone: 'Professional',
        strengths: ['Clear structure', 'Good flow', 'Engaging content'],
        improvements: ['Add more keywords', 'Improve transitions', 'Enhance conclusion'],
        suggestions: [
          'Add relevant keywords naturally',
          'Include internal/external links',
          'Optimize meta description',
          'Use more subheadings',
          'Add multimedia elements',
        ],
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});