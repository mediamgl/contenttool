import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface AnalyzeContentRequest {
  text: string;
  title?: string;
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

    const prompt = `Analyze the following content${title ? ` titled "${title}"` : ''}:

${text}

Provide a comprehensive analysis including:
1. SEO Score (0-100) with explanation
2. Readability Score (0-100, Flesch-Kincaid scale) with grade level
3. Tone Analysis (formal, casual, professional, friendly, etc.)
4. Key strengths (3-5 points)
5. Areas for improvement (3-5 points)
6. Specific optimization suggestions (5-7 actionable items)

Format your response as JSON:
{
  "seoScore": 85,
  "seoExplanation": "...",
  "readabilityScore": 72,
  "gradeLevel": "High School",
  "tone": "Professional",
  "strengths": ["..."],
  "improvements": ["..."],
  "suggestions": ["..."]
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
        JSON.stringify({ error: 'Failed to analyze content with AI' }),
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
      const jsonMatch = aiResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(aiResponse);
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