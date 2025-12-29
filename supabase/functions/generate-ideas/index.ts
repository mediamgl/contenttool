import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface GenerateIdeasRequest {
  businessDescription: string;
  contentTypes: string[];
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
    const { businessDescription, contentTypes, count = 5 }: GenerateIdeasRequest = await req.json();

    if (!businessDescription || !contentTypes || contentTypes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: businessDescription and contentTypes' }),
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

    const prompt = `Generate ${count} creative content ideas for a business/creator with this description:

"${businessDescription}"

Content types they're interested in: ${contentTypes.join(', ')}

For each idea, provide:
1. A compelling title
2. A brief description (2-3 sentences)
3. The most suitable content type
4. Suggested platforms for distribution
5. A category (e.g., tutorial, opinion, how-to, case study, listicle)

CRITICAL: You must respond with ONLY a valid JSON array. Do not include markdown code blocks, explanations, or any other text. Just the raw JSON array.

Format: [{"title": "...", "description": "...", "contentType": "...", "platforms": ["..."], "category": "..."}]`;

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
        JSON.stringify({ error: 'Failed to generate ideas from AI', details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const aiResponse = anthropicData.content[0].text;

    let ideas;
    try {
      const cleanedResponse = aiResponse.replace(/```json\n?|```\n?/g, '').trim();
      const jsonMatch = cleanedResponse.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0]);
      } else {
        ideas = JSON.parse(cleanedResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      ideas = [
        {
          title: `Content Ideas for ${businessDescription}`,
          description: 'AI-generated content idea based on your business description.',
          contentType: contentTypes[0],
          platforms: ['medium', 'linkedin'],
          category: 'general',
        },
      ];
    }

    return new Response(JSON.stringify({ ideas }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ideas function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});