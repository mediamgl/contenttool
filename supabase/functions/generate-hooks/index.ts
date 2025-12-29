import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GenerateHooksRequest {
  topic: string;
  contentType: string;
  count?: number;
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
    const { topic, contentType, count = 5 }: GenerateHooksRequest = await req.json();

    if (!topic || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: topic and contentType' }),
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

    const prompt = `Generate ${count} compelling opening hooks for a ${contentType} about "${topic}".

Each hook should:
- Be attention-grabbing and make the reader want to continue
- Be suitable for the ${contentType} format
- Be different in style (question, statement, statistic, story, etc.)
- Be concise (1-2 sentences max)

CRITICAL: Respond with ONLY a valid JSON array of strings. No markdown, no code blocks, no explanations. Just: ["hook 1", "hook 2", "hook 3"]`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
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
        JSON.stringify({ error: 'Failed to generate hooks from AI', details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const aiResponse = anthropicData.content[0].text;

    let hooks;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|```\n?/g, '').trim();
      const jsonMatch = cleanedResponse.match(/\[\s*["'][\s\S]*["']\s*\]/);
      if (jsonMatch) {
        hooks = JSON.parse(jsonMatch[0]);
      } else {
        hooks = JSON.parse(cleanedResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      hooks = [
        `Discover the surprising truth about ${topic}`,
        `Why ${topic} matters more than you think`,
        `The complete guide to understanding ${topic}`,
        `What everyone gets wrong about ${topic}`,
        `${topic}: Everything you need to know`,
      ];
    }

    return new Response(JSON.stringify({ hooks }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-hooks function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});