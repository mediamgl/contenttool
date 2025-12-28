import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface TextOperationRequest {
  text: string;
  operation: 'expand' | 'condense' | 'improve' | 'rephrase';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text, operation }: TextOperationRequest = await req.json();

    if (!text || !operation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text and operation' }),
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

    let prompt = '';
    switch (operation) {
      case 'expand':
        prompt = `Expand the following text by adding more detail, examples, and context. Make it more comprehensive while maintaining the original meaning and tone:\n\n${text}`;
        break;
      case 'condense':
        prompt = `Condense the following text to make it more concise while preserving all key information and maintaining clarity:\n\n${text}`;
        break;
      case 'improve':
        prompt = `Improve the following text by enhancing grammar, flow, clarity, and engagement. Make it more professional and compelling:\n\n${text}`;
        break;
      case 'rephrase':
        prompt = `Rephrase the following text using different words and sentence structures while keeping the exact same meaning:\n\n${text}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation type' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }

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
        JSON.stringify({ error: 'Failed to process text with AI' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const resultText = anthropicData.content[0].text;

    return new Response(JSON.stringify({ result: resultText }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-text-operations function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});