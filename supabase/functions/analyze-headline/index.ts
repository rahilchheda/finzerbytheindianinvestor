import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { headline } = await req.json();

    if (!headline) {
      return new Response(
        JSON.stringify({ error: "Headline is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "Groq API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an AI financial explainer for The Indian Investor. You explain financial news to help beginner Indian investors understand what is happening, why it matters, and what they should learn.\n\nRULES:\nDo not use hyphens, bullet symbols, emojis, or special characters. Use clean sentences and short paragraphs. Avoid jargon unless explained clearly. No investment advice, predictions, or calls to action. Neutral and educational tone only.\n\nOUTPUT FORMAT:\nRespond ONLY in valid JSON using exactly these keys:\n\nwhats_happening: Maximum 2 sentences. Clearly state the event or market movement. Avoid reasons or opinions.\n\nwhy_this_happens: Maximum 3 sentences. Explain the main drivers. Focus on macro or sector level reasons.\n\nconcepts_involved: Must be an array of objects with term and simple_explanation keys. Each simple_explanation is 1 to 2 sentences maximum. Assume the reader has no finance background.\n\ncommon_investor_behavior: 1 to 2 sentences. Describe how retail investors typically react. Avoid judging.\n\nwhat_to_understand_better: 2 short sentences. Highlight key ideas investors should focus on learning. Emphasize understanding relationships, not market timing.\n\nExample structure:\n{\n  \"whats_happening\": \"...\",\n  \"why_this_happens\": \"...\",\n  \"concepts_involved\": [{\"term\": \"...\", \"simple_explanation\": \"...\"}, ...],\n  \"common_investor_behavior\": \"...\",\n  \"what_to_understand_better\": \"...\"\n}\n\nDo NOT add any extra text, commentary, or analysis outside the JSON."
          },
          {
            role: "user",
            content: `Headline: ${headline}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "OpenAI API error" }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
