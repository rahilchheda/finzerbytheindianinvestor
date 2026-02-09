
import { useState } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";

interface Concept {
  term: string;
  simple_explanation: string;
}

interface AnalysisResult {
  whats_happening: string;
  why_this_happens: string;
  concepts_involved: Concept[];
  common_investor_behavior: string;
  what_to_understand_better: string;
}

export default function App() {
  const [headline, setHeadline] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!headline.trim()) {
      setError("Please enter a market or business headline");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

      const prompt = `Analyze this market/business headline and provide a structured educational breakdown for retail investors:

Headline: "${headline}"

Respond ONLY with valid JSON in this exact format:
{
  "whats_happening": "",
  "why_this_happens": "",
  "concepts_involved": [
    { "term": "", "simple_explanation": "" }
  ],
  "common_investor_behavior": "",
  "what_to_understand_better": ""
}`;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        }
      );

      const data = await res.json();
      const content = data.choices[0]?.message?.content;
      const analysisResult = JSON.parse(content);
      setAnalysis(analysisResult);
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setHeadline("");
    setAnalysis(null);
    setError("");
  };

  const handleCopy = async () => {
    if (!analysis) return;

    const text = `Headline:
${headline}

What's happening:
${analysis.whats_happening}

Why this is happening:
${analysis.why_this_happens}

Key concepts:
${analysis.concepts_involved
      .map((c) => `• ${c.term}: ${c.simple_explanation}`)
      .join("\n")}

Investor behaviour:
${analysis.common_investor_behavior}

How to think about this:
${analysis.what_to_understand_better}`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header */}
      <header className="w-full border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">
            F
          </div>
          <div className="text-white font-semibold text-lg">
            Finzer by TII
          </div>
        </div>
      </header>

      {/* HERO + INPUT */}
      <div className="flex-1">
        <WavyBackground
          className="max-w-4xl mx-auto px-6 py-16"
          colors={["#38bdf8", "#818cf8", "#c084fc"]}
          waveWidth={60}
          backgroundFill="#000000"
          blur={15}
          speed="fast"
          waveOpacity={0.4}
        >
          {/* Hero */}
          <div className="text-center mb-14">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Decode Market{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Headlines
              </span>
            </h1>

            <p
              className="text-xl text-slate-300 max-w-2xl mx-auto"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              Transform complex financial news into clear, actionable insights using AI.
            </p>
          </div>

          {/* Input */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-10">
            <label className="block text-sm font-bold text-sky-300 mb-4 uppercase tracking-widest">
              Market Headline
            </label>

            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              rows={5}
              placeholder={`RBI raises repo rate by 25 basis points`}
              className="w-full rounded-xl p-5 text-base outline-none resize-none bg-white/10 text-white placeholder:text-slate-400 border border-white/20"
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold py-4 rounded-xl"
              >
                {loading ? "Analyzing..." : "Analyze Now"}
              </button>

              <button
                onClick={handleClear}
                className="px-8 py-4 rounded-xl border border-white/20 text-white"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-5 p-4 bg-red-500/20 border border-red-400 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}
          </div>
        </WavyBackground>
      </div>

      {/* Analysis */}
      {analysis && (
        <div className="max-w-4xl mx-auto px-6 pb-20 text-white space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">What’s happening</h2>
            <p className="text-slate-300">{analysis.whats_happening}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Why this happens</h2>
            <p className="text-slate-300">{analysis.why_this_happens}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Key concepts</h2>
            {analysis.concepts_involved.map((c, i) => (
              <p key={i} className="text-slate-300">
                • <b>{c.term}</b>: {c.simple_explanation}
              </p>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Investor behaviour</h2>
            <p className="text-slate-300">{analysis.common_investor_behavior}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">How to think</h2>
            <p className="text-slate-300">
              {analysis.what_to_understand_better}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-lg"
          >
            {copied ? "Copied!" : "Copy Analysis"}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-slate-400 text-sm">
        © 2026 The Indian Investor • Educational Insight Engine
      </footer>
    </div>
  );
}
