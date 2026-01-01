import {   useEffect, useRef, useState } from "react";
import { Button } from "../component/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export function RAGpage(){


    
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const textref = useRef<HTMLTextAreaElement>(null);
    const ansRef = useRef<HTMLDivElement>(null);

    async function askBrainStream() {
        const newquestion = textref.current?.value;
  setAnswer("");
  setLoading(true);
  

  const res = await fetch(`${BACKEND_URL}/rag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ question:newquestion })
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
      if (line.startsWith("data: ")) {
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
  
    ansRef.current!.scrollIntoView({ behavior: "smooth" });
}, [answer]);

    

return <div ref={ansRef} className="mt-8 bg-white p-6 rounded-xl border">
  <h3 className="font-semibold mb-2">Ask your brain</h3>

  <textarea
    
    ref={textref}
    className="w-full p-3 border rounded mb-3"
    placeholder="Ask anything about your saved content..."
  />

  <Button
    onClick={askBrainStream}
    disabled={loading}
    text={loading ? "Thinking..." : "Ask"}
    varient="primary"
    size="md"
  />

  {answer && (
    <div className="mt-4 p-4 bg-slate-50 rounded whitespace-pre-wrap">
      {answer}
    </div>
  )}
</div>


}
