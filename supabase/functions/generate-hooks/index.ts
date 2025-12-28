import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
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

Return ONLY a JSON array of strings, with each string being one hook. No other text or explanation.`;

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
        JSON.stringify({ error: 'Failed to generate hooks from AI' }),
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
      const jsonMatch = aiResponse.match(/\[\s*["'][\s\S]*["']\s*\]/);
      if (jsonMatch) {
        hooks = JSON.parse(jsonMatch[0]);
      } else {
        hooks = JSON.parse(aiResponse);
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