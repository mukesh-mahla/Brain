import { useEffect, useRef, useState } from "react";
import { Button } from "../component/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function RAGpage() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const answerEndRef = useRef<HTMLDivElement>(null);

  async function askBrainStream() {
    const question = textRef.current?.value?.trim();
    if (!question) return;

    setAnswer("");
    setLoading(true);

    const res = await fetch(`${BACKEND_URL}/rag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ") || line.startsWith("") ) {
          const text = line.replace("data: ", "");
          if (text === "[DONE]") {
            setLoading(false);
            return;
          }
          setAnswer(prev => prev + text);
        }
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    answerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer]);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col">

      {/* HEADER */}
      <div className="px-10 py-6 border-b border-slate-200">
        <h1 className="text-lg font-semibold tracking-tight">
          Recall
        </h1>
        <p className="text-sm text-slate-500">
          Ask your saved knowledge
        </p>
      </div>

      {/* ANSWER */}
      <div className="flex-1 overflow-y-auto px-10 py-12">
        {!answer && !loading && (
          <div className="max-w-2xl text-slate-500 leading-relaxed">
            <p className="mb-4">Try asking:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>What did I save about authentication?</li>
              <li>Summarize my YouTube videos</li>
              <li>What do my notes say about AI?</li>
            </ul>
          </div>
        )}

        {(answer || loading) && (
          <div className="max-w-3xl text-lg leading-relaxed whitespace-pre-wrap">
            {answer}
            {loading && (
              <span className="inline-block ml-1 text-indigo-600 animate-pulse">▍</span>
            )}
            <div ref={answerEndRef} />
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t border-slate-200 bg-white px-8 py-4">
        <div className="max-w-4xl mx-auto flex gap-4 items-end">
          <textarea
            ref={textRef}
            rows={1}
            placeholder="Ask your brain…"
            className="
              flex-1 resize-none
              border border-slate-300 rounded-xl
              px-4 py-3 text-slate-900
              placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500
            "
          />

          <Button
            onClick={askBrainStream}
            text={loading ? "Thinking…" : "Ask"}
            varient="primary"
            size="md"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
