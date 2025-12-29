import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GenerateOutlineRequest {
  topic: string;
  hook: string;
  contentType: string;
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
    const { topic, hook, contentType }: GenerateOutlineRequest = await req.json();

    if (!topic || !hook || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: topic, hook, and contentType' }),
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

    const prompt = `Create a detailed content outline for a ${contentType} about "${topic}".

Opening Hook: "${hook}"

Provide a structured outline with:
1. 3-5 main sections, each with:
   - A clear heading
   - 3-5 key points to cover
2. A compelling call-to-action at the end

CRITICAL: Respond with ONLY valid JSON. No markdown code blocks, no explanations. Just raw JSON:
{"sections": [{"id": 1, "heading": "Section Title", "keyPoints": ["point 1", "point 2", "point 3"]}], "cta": "Your call to action"}`;

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
        JSON.stringify({ error: 'Failed to generate outline from AI', details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const aiResponse = anthropicData.content[0].text;

    let outline;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|```\n?/g, '').trim();
      const jsonMatch = cleanedResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        outline = JSON.parse(jsonMatch[0]);
      } else {
        outline = JSON.parse(cleanedResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      outline = {
        sections: [
          {
            id: 1,
            heading: `Introduction to ${topic}`,
            keyPoints: ['Context', 'Why it matters', 'What we will cover'],
          },
          {
            id: 2,
            heading: 'Key Concepts',
            keyPoints: ['Definition', 'Historical context', 'Current applications'],
          },
          {
            id: 3,
            heading: 'Best Practices',
            keyPoints: ['Tip 1', 'Tip 2', 'Common mistakes to avoid'],
          },
          {
            id: 4,
            heading: 'Conclusion',
            keyPoints: ['Summary', 'Key takeaways', 'Next steps'],
          },
        ],
        cta: 'Learn more and get started today',
      };
    }

    return new Response(JSON.stringify({ outline }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-outline function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});