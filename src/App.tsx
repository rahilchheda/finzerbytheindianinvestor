
// import { useState } from "react";
// import { WavyBackground } from "@/components/ui/wavy-background";

// interface Concept {
//   term: string;
//   simple_explanation: string;
// }

// interface AnalysisResult {
//   whats_happening: string;
//   why_this_happens: string;
//   concepts_involved: Concept[];
//   common_investor_behavior: string;
//   what_to_understand_better: string;
// }

// export default function App() {
//   const [headline, setHeadline] = useState("");
//   const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [copied, setCopied] = useState(false);

//   const handleAnalyze = async () => {
//     if (!headline.trim()) {
//       setError("Please enter a market or business headline");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setAnalysis(null);

//     try {
//       const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

//       const prompt = `Analyze this market/business headline and provide a structured educational breakdown for retail investors:

// Headline: "${headline}"

// Respond ONLY with valid JSON in this exact format:
// {
//   "whats_happening": "",
//   "why_this_happens": "",
//   "concepts_involved": [
//     { "term": "", "simple_explanation": "" }
//   ],
//   "common_investor_behavior": "",
//   "what_to_understand_better": ""
// }`;

//       const res = await fetch(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${groqApiKey}`,
//           },
//           body: JSON.stringify({
//             model: "llama-3.3-70b-versatile",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.7,
//             max_tokens: 2000,
//           }),
//         }
//       );

//       const data = await res.json();
//       const content = data.choices[0]?.message?.content;
//       const analysisResult = JSON.parse(content);
//       setAnalysis(analysisResult);
//     } catch (e) {
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setHeadline("");
//     setAnalysis(null);
//     setError("");
//   };

//   const handleCopy = async () => {
//     if (!analysis) return;

//     const text = `Headline:
// ${headline}

// What's happening:
// ${analysis.whats_happening}

// Why this is happening:
// ${analysis.why_this_happens}

// Key concepts:
// ${analysis.concepts_involved
//       .map((c) => `• ${c.term}: ${c.simple_explanation}`)
//       .join("\n")}

// Investor behaviour:
// ${analysis.common_investor_behavior}

// How to think about this:
// ${analysis.what_to_understand_better}`;

//     await navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-black">
//       {/* Header */}
//       <header className="w-full border-b border-white/10">
//         <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
//           <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white font-bold">
//             F
//           </div>
//           <div className="text-white font-semibold text-lg">
//             Finzer by TII
//           </div>
//         </div>
//       </header>

//       {/* HERO + INPUT */}
//       <div className="flex-1">
//         <WavyBackground
//           className="max-w-4xl mx-auto px-6 py-16"
//           colors={["#38bdf8", "#818cf8", "#c084fc"]}
//           waveWidth={60}
//           backgroundFill="#000000"
//           blur={15}
//           speed="fast"
//           waveOpacity={0.4}
//         >
//           {/* Hero */}
//           <div className="text-center mb-14">
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
//               Decode Market{" "}
//               <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
//                 Headlines
//               </span>
//             </h1>

//             <p
//               className="text-xl text-slate-300 max-w-2xl mx-auto"
//               style={{ fontFamily: "Times New Roman, Times, serif" }}
//             >
//               Transform complex financial news into clear, actionable insights using AI.
//             </p>
//           </div>

//           {/* Input */}
//           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-10">
//             <label className="block text-sm font-bold text-sky-300 mb-4 uppercase tracking-widest">
//               Market Headline
//             </label>

//             <textarea
//               value={headline}
//               onChange={(e) => setHeadline(e.target.value)}
//               rows={5}
//               placeholder={`RBI raises repo rate by 25 basis points`}
//               className="w-full rounded-xl p-5 text-base outline-none resize-none bg-white/10 text-white placeholder:text-slate-400 border border-white/20"
//             />

//             <div className="flex gap-4 mt-6">
//               <button
//                 onClick={handleAnalyze}
//                 disabled={loading}
//                 className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold py-4 rounded-xl"
//               >
//                 {loading ? "Analyzing..." : "Analyze Now"}
//               </button>

//               <button
//                 onClick={handleClear}
//                 className="px-8 py-4 rounded-xl border border-white/20 text-white"
//               >
//                 Clear
//               </button>
//             </div>

//             {error && (
//               <div className="mt-5 p-4 bg-red-500/20 border border-red-400 rounded-xl text-red-200 text-sm">
//                 {error}
//               </div>
//             )}
//           </div>
//         </WavyBackground>
//       </div>

//       {/* Analysis */}
//       {analysis && (
//         <div className="max-w-4xl mx-auto px-6 pb-20 text-white space-y-6">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">What’s happening</h2>
//             <p className="text-slate-300">{analysis.whats_happening}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-2">Why this happens</h2>
//             <p className="text-slate-300">{analysis.why_this_happens}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-2">Key concepts</h2>
//             {analysis.concepts_involved.map((c, i) => (
//               <p key={i} className="text-slate-300">
//                 • <b>{c.term}</b>: {c.simple_explanation}
//               </p>
//             ))}
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-2">Investor behaviour</h2>
//             <p className="text-slate-300">{analysis.common_investor_behavior}</p>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-2">How to think</h2>
//             <p className="text-slate-300">
//               {analysis.what_to_understand_better}
//             </p>
//           </div>

//           <button
//             onClick={handleCopy}
//             className="mt-4 px-6 py-3 bg-white/10 border border-white/20 rounded-lg"
//           >
//             {copied ? "Copied!" : "Copy Analysis"}
//           </button>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="border-t border-white/10 py-6 text-center text-slate-400 text-sm">
//         © 2026 The Indian Investor • Educational Insight Engine
//       </footer>
//     </div>
//   );
// }

// import { useState } from "react";
// import { WavyBackground } from "@/components/ui/wavy-background";

// interface Concept {
//   term: string;
//   simple_explanation: string;
// }

// interface AnalysisResult {
//   whats_happening: string;
//   why_this_happens: string;
//   concepts_involved: Concept[];
//   common_investor_behavior: string;
//   what_to_understand_better: string;
// }

// export default function App() {
//   const [headline, setHeadline] = useState("");
//   const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [copied, setCopied] = useState(false);

//   const handleAnalyze = async () => {
//     if (!headline.trim()) {
//       setError("Please enter a market or business headline");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setAnalysis(null);

//     try {
//       const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

//       const prompt = `Analyze this market/business headline and provide a structured educational breakdown for retail investors:
//       Headline: "${headline}"
//       Respond ONLY with valid JSON in this exact format:
//       {
//         "whats_happening": "",
//         "why_this_happens": "",
//         "concepts_involved": [{ "term": "", "simple_explanation": "" }],
//         "common_investor_behavior": "",
//         "what_to_understand_better": ""
//       }`;

//       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${groqApiKey}`,
//         },
//         body: JSON.stringify({
//           model: "llama-3.3-70b-versatile",
//           messages: [{ role: "user", content: prompt }],
//           temperature: 0.7,
//         }),
//       });

//       const data = await res.json();
//       const content = data.choices[0]?.message?.content;
//       setAnalysis(JSON.parse(content));
//     } catch (e) {
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col font-sans">
//       {/* Header */}
//       <header className="p-6 flex items-center justify-center sm:justify-start gap-3">
//         <img src="/tiilogo.png" alt="Logo" className="w-8 h-8 object-contain" />
//         <span className="text-xl font-serif" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
//           Finzer by TII
//         </span>
//       </header>

//       {/* Hero & Input Section */}
//       <main className="relative flex-1 flex flex-col items-center pt-12">
        
//         {/* Wavy Component in the Centre Background */}
//         <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
//           <WavyBackground
//             className="w-full h-[400px]"
//             containerClassName="h-full"
//             colors={["#38bdf8", "#818cf8", "#c084fc"]}
//             waveWidth={50}
//             backgroundFill="transparent"
//             blur={10}
//             speed="slow"
//             waveOpacity={0.5}
//           />
//         </div>

//         {/* Content Layer */}
//         <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">
//           <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
//             Decode Market Headlines
//           </h1>
          
//           <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
//   We translate Wall Street language into simple thinking.
//   Understand the event, the logic behind it,
//   and the behavior it typically triggers in markets.
// </p>

//           {/* Glass Card */}
//           <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
//             <div className="text-left mb-4">
//               <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
//                 Market Headline
//               </label>
//             </div>
            
//             <textarea
//               value={headline}
//               onChange={(e) => setHeadline(e.target.value)}
//               className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none h-32"
//               placeholder="e.g., 'RBI raises repo rate by 25 basis points' or 'Tech stocks rally as inflation cools'"
//             />

//             <button
//               onClick={handleAnalyze}
//               disabled={loading}
//               className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
//             >
//               {loading ? "Analyzing..." : "Analyze Now"}
//             </button>
            
//             {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
//           </div>
//         </div>

//         {/* Analysis Result (Toggles Down) */}
//         {analysis && (
//           <div className="w-full max-w-3xl px-6 py-20 animate-in fade-in slide-in-from-top-4 duration-1000">
//             <div className="space-y-10 border-t border-white/10 pt-10">
//               <section>
//                 <h2 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">The Breakdown</h2>
//                 <h3 className="text-2xl font-semibold mb-4 text-white">What’s happening</h3>
//                 <p className="text-slate-300 leading-relaxed">{analysis.whats_happening}</p>
//               </section>

//               <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
//                 <h3 className="text-xl font-semibold mb-4 text-white">Key Concepts Involved</h3>
//                 <div className="grid gap-4">
//                   {analysis.concepts_involved.map((c, i) => (
//                     <div key={i}>
//                       <span className="font-bold text-blue-300">{c.term}:</span>
//                       <span className="text-slate-300 ml-2">{c.simple_explanation}</span>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section>
//                 <h3 className="text-2xl font-semibold mb-4 text-white">Investor Behaviour</h3>
//                 <p className="text-slate-300 italic">"{analysis.common_investor_behavior}"</p>
//               </section>
              
//               <button 
//                 onClick={() => {
//                   navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
//                   setCopied(true);
//                   setTimeout(() => setCopied(false), 2000);
//                 }}
//                 className="text-xs uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
//               >
//                 {copied ? "Copied!" : "Copy Full Analysis"}
//               </button>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="p-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.3em]">
//         © 2026 The Indian Investor • Educational Insight Engine
//       </footer>
//     </div>
//   );
// }

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
          waveOpacity={0.6}
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
             <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
 We translate Wall Street language into simple thinking.
   Understand the event, the logic behind it,   and the behavior it typically triggers in markets.
 </p>
          </div>

          {/* Input */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 mb-10 transition-all hover:border-white/30">
            <label className="block text-sm font-bold text-sky-400 mb-4 uppercase tracking-[0.2em]">
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