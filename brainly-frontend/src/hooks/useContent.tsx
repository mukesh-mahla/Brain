import axios from "axios";
import { useRef, useState } from "react";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

type Content = {
  id: string;
  type: "twitter" | "youtube";
  link: string;
  title: string;
  summary: string;
  tags: string[];
};

export function useContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const cursorRef = useRef<string | null>(null);

    async function refresh(reset = false) {
    const response = await axios.get(
      `${VITE_BACKEND_URL}/document?limit=10${!reset && cursorRef.current ? `&cursor=${cursorRef.current}` : ""
      }`,
      { withCredentials: true }
    );

    const newData = response.data.content || [];

    if (reset) {
      setContents(newData);
    } else {
      setContents(prev => [...prev, ...newData]);
    }

    cursorRef.current = response.data.nextCursor;
  }

  const deleteContent = async (id: string) => {
    await axios.delete(
      `${VITE_BACKEND_URL}/delete/${id}`,
      { withCredentials: true }
    );

    setContents(prev => prev.filter(item => item.id !== id));
  };

  return { contents, refresh, deleteContent,hasMore:cursorRef.current };
}