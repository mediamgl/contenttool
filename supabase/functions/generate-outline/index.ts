import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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

    const prompt = `Create a detailed content outline for a ${contentType} about "${topic}".

Opening Hook: "${hook}"

Provide a structured outline with:
1. 3-5 main sections, each with:
   - A clear heading
   - 3-5 key points to cover
2. A compelling call-to-action at the end

Format your response as JSON with this structure:
{
  "sections": [
    {
      "id": 1,
      "heading": "Section Title",
      "keyPoints": ["point 1", "point 2", "point 3"]
    }
  ],
  "cta": "Your call to action"
}`;

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
        JSON.stringify({ error: 'Failed to generate outline from AI' }),
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
      const jsonMatch = aiResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        outline = JSON.parse(jsonMatch[0]);
      } else {
        outline = JSON.parse(aiResponse);
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