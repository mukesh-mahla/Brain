import { useRef, useState } from "react";
import { CrossIcon } from "../icons/croos";
import { Button } from "./button";
import { Input } from "./Input";
import axios from "axios";
import { getYouTubeEmbedUrl } from "../utils/youtybeUrl";
import { getTags } from "../utils/AIcall";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

enum ContentType {
  youtube = "youtube",
  twitter = "twitter",
  facebook = "facebook",
}

export interface AiRes {
  summary: string;
  tags: string[];
}

export function CreateContentmodal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<ContentType>(ContentType.youtube);
  const [loading, setLoading] = useState(false);
  const [AxiosError, setError] = useState<string | null>(null)

  async function addContent() {
    setError(null);
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;




    if (!title || !link) {
      setError("Title and link are required");
      return;
    }
    const finalLink =
      type === ContentType.youtube ? getYouTubeEmbedUrl(link) : link;

    if (
      type === ContentType.youtube &&
      !finalLink?.includes("youtube.com") &&
      !finalLink?.includes("youtu.be")
    ) {
      setError("Enter a valid YouTube URL");
      return;
    }
    setLoading(true);

    const ingestionPrompt = `
      You are analyzing content a user wants to save in their second brain.

        Title: ${title}
        Type: ${type}
        Link: ${link}

Generate:
- A concise 2–3 sentence summary explaining why this content might be useful
- 3–5 short tags that represent key ideas

Return ONLY valid JSON in this format:
{
  "summary": "...",
  "tags": ["tag1", "tag2", "tag3"]
}
`;

    let summary = "";
    let tags: string[] = [];

    try {
      const res: AiRes = await getTags(ingestionPrompt);
      summary = res.summary;
      tags = res.tags;
    } catch {
      setError("cant able to generate a summary,storing without summary")
      console.warn("AI failed — saving without enrichment");

    }



    try {
      await axios.post(
        `${BACKEND_URL}/addcontent`,
        { title, link: finalLink, type, summary, tags },
        { withCredentials: true }
      );
      onClose();
    } catch (e: any) {
      setError(e.response?.data || e.message)
      return
    }
    setLoading(false);

  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add to your brain
            </h2>
            <p className="text-sm text-slate-500">
              Save knowledge, not just links
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <CrossIcon />
          </button>
        </div>

        {/* CONTENT TYPE */}
        <div className="mb-6">
          <p className="text-xs font-medium text-slate-500 mb-2">
            CONTENT TYPE
          </p>

          <div className="flex gap-2">
            {Object.values(ContentType).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`
                  px-3 py-2 rounded-lg text-sm border transition
                  ${type === t
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <Input ref={titleRef} placeholder="Title (what is this about?)" />
          <Input ref={linkRef} placeholder="Paste the link here" />
        </div>
        {AxiosError && <p className="text-red-500 text-xs">{AxiosError}</p>}
        {/* ACTION */}
        <div className="mt-6 flex justify-end">
          <Button
            loading={loading}
            onClick={addContent}
            varient="primary"
            size="md"
            text={loading ? "Thinking..." : AxiosError ? "Try Again" : "Save to Brain"}
          />
        </div>
      </div>
    </div>
  );
}
