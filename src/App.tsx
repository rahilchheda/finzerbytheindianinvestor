import { useState } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { motion } from "framer-motion";

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

interface AnalysisCardProps {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
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

      const prompt = `
You are a Wall Street level market analyst.

Explain the headline in a detailed, educational, but simple way for retail investors.

Headline: "${headline}"

Rules:
- Write at least 2-4 sentences per section.
- Be clear, not academic.
- Give practical understanding.
- Expand properly.
- Avoid short answers.

Respond ONLY with JSON in this format:

{
  "whats_happening": "",
  "why_this_happens": "",
  "concepts_involved": [
    { "term": "", "simple_explanation": "" }
  ],
  "common_investor_behavior": "",
  "what_to_understand_better": ""
}
`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setAnalysis(JSON.parse(data.choices[0]?.message?.content || "{}"));
    } catch (e) {
      setError("Something went wrong with the analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!analysis) return;
    const text = `Finzer Analysis: ${headline}\n\nSummary: ${analysis.whats_happening}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
const handleClear = () => {
  setHeadline("");
  setAnalysis(null);
  setError("");
};

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden relative bg-slate-950">
      {/* Waves */}
      <div className="fixed inset-0 z-0">
        <WavyBackground
          className="w-full h-full"
          colors={["#0ea5e9", "#6366f1", "#a855f7", "#2dd4bf"]}
          waveWidth={80}
          backgroundFill="#000000"
          blur={10}
          speed="fast"
          waveOpacity={0.8}
        />
      </div>

      {/* Page */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex items-center gap-4">
              <img
                src="/tiilogo.png"
                alt="The Indian Investor"
                className="h-10 w-auto object-contain"
              />
              <div
                className="font-bold text-white text-xl"
                style={{ fontFamily: "Segoe Serif, Georgia, 'Times New Roman', serif" }}
              >
                Finzer by TII
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 flex-1">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Decode Market {" "} <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Headlines
              </span>
            </h1>
            {/* <p
              className="text-xl text-slate-300 max-w-2xl mx-auto font-medium"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              Transform complex financial news into clear, actionable insights using AI.
            </p> */}
             <p 
  className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed font-black" 
  
>
 We translate Wall Street language into simple thinking.
   Understand the event, the logic behind it,   and the behavior it typically triggers in markets.
 </p>
          </div>

          {/* Input */}
          <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-12 md:p-16 mb-10 transition-all">
  <label className="block text-sm font-bold text-sky-400 mb-6 uppercase tracking-[0.2em]">
    Market Headline
  </label>

            <textarea
  value={headline}
  onChange={(e) => setHeadline(e.target.value)}
  className="
    w-full h-40 rounded-xl
    bg-black/60
    border border-white/20
    text-white
    text-xl  {/* This increases the font size */}
    placeholder:text-slate-400
    p-4
    backdrop-blur-md
    focus:outline-none
    focus:ring-2 focus:ring-blue-500/40
  "
  placeholder="e.g., 'RBI raises repo rate by 25 basis points' or 'Tech stocks rally as inflation cools'"
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
    className="px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/10"
  >
    Clear
  </button>
</div>


            {error && (
              <div className="mt-4 text-rose-400 text-sm font-semibold">
                {error}
              </div>
            )}
          </div>

          {/* Output */}
          {/* Analysis */}
{analysis && (
  <div className="max-w-5xl mx-auto px-6 pb-28 text-white space-y-10">

    {/* What's happening */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
      <div className="mb-4">
        <p className="text-sm text-cyan-400 uppercase tracking-widest">
          Market Overview
        </p>
        <h2 className="text-2xl font-semibold text-white">
          What’s happening
        </h2>
      </div>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
        {analysis.whats_happening}
      </p>
    </div>

    {/* Why */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
      <div className="mb-4">
        <p className="text-sm text-purple-400 uppercase tracking-widest">
          Market Dynamics
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Why this happens
        </h2>
      </div>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
        {analysis.why_this_happens}
      </p>
    </div>

    {/* Concepts */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
      <div className="mb-4">
        <p className="text-sm text-pink-400 uppercase tracking-widest">
          Knowledge Layer
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Key concepts involved
        </h2>
      </div>

      <div className="space-y-4">
        {analysis.concepts_involved.map((c, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="font-semibold text-white">{c.term}</p>
            <p className="text-slate-300 text-sm mt-1">
              {c.simple_explanation}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Behaviour */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
      <div className="mb-4">
        <p className="text-sm text-yellow-400 uppercase tracking-widest">
          Crowd Reaction
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Common investor behaviour
        </h2>
      </div>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
        {analysis.common_investor_behavior}
      </p>
    </div>

    {/* Think */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
      <div className="mb-4">
        <p className="text-sm text-green-400 uppercase tracking-widest">
          Strategic Perspective
        </p>
        <h2 className="text-2xl font-semibold text-white">
          How to think about this
        </h2>
      </div>
      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
        {analysis.what_to_understand_better}
      </p>
    </div>

    {/* Copy */}
    <div className="text-center">
      <button
        onClick={handleCopy}
        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full"
      >
        {copied ? "Copied!" : "Copy Full Analysis"}
      </button>
    </div>
  </div>
)}

        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-white/10 py-6 bg-black/50 backdrop-blur-xl text-center">
          <p className="text-sm text-slate-500 font-medium tracking-widest uppercase">
            © 2026 The Indian Investor • Educational Insight Engine
          </p>
        </footer>
      </div>
    </div>
  );
}

function AnalysisCard({ title, subtitle, icon, children }: AnalysisCardProps) {
  return (
    <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/20 to-white/5">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] overflow-hidden hover:border-white/20 transition-all">
        <div className="bg-white/5 border-b border-white/10 px-8 py-6 flex items-center gap-4">
          <span className="text-3xl">{icon}</span>
          <div>
            <h2 className="font-bold text-white text-xl">{title}</h2>
            <p className="text-sm text-sky-400/80 font-medium tracking-wide uppercase">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="p-8 text-slate-200 text-lg leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
