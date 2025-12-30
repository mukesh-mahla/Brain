import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 text-slate-800 relative overflow-hidden">

      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-3xl" />

      {/* TOP RIGHT AUTH */}
      <div className="absolute top-6 right-6 flex gap-4 animate-fade-in">
        <button
          onClick={() => navigate("/signin")}
          className="text-slate-600 hover:text-slate-900 transition"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
        >
          Sign Up
        </button>
      </div>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl text-center animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-float">
              Second Brain
            </span>
            ,<br />
            powered by AI
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 animate-fade-in">
            Save links, tweets, videos and notes.
            <br />
            Find them later by meaning — not memory.
          </p>

          <div className="mt-10 flex justify-center gap-4 animate-fade-in">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600
                         hover:scale-[1.03] hover:shadow-lg transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700
                         hover:bg-slate-100 hover:scale-[1.02] transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <Feature title="Save Anything" description="Store YouTube videos, tweets, articles and notes in one place." />
          <Feature title="Search by Meaning" description="Type what you remember. AI finds what you forgot." />
          <Feature title="AI Recall" description="Ask questions and let your brain answer using your data." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <Step number="1" text="Save content you care about" />
            <Step number="2" text="AI understands & stores meaning" />
            <Step number="3" text="Search or ask — instantly recall" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h2 className="text-4xl font-bold">Stop forgetting what you already learned</h2>
          <p className="mt-4 text-lg opacity-90">
            Build a brain that grows smarter with you.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-8 px-8 py-4 bg-white text-slate-800 rounded-lg font-semibold
                       hover:scale-[1.04] hover:shadow-xl transition"
          >
            Start Building Your Brain
          </button>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-slate-500 animate-fade-in">
        Built with 🧠 + 🤖 by you
      </footer>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="
      p-6 rounded-xl border border-slate-200 bg-slate-50
      hover:shadow-xl hover:-translate-y-2
      transition duration-300
    ">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="
      p-6 rounded-xl bg-white border border-slate-200
      hover:shadow-lg hover:-translate-y-1
      transition duration-300
    ">
      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mx-auto">
        {number}
      </div>
      <p className="mt-4 text-slate-600">{text}</p>
    </div>
  );
}
