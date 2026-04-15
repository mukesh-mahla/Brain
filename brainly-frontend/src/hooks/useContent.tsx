import axios from "axios";
import { useState } from "react";
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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false)
  async function refresh(pageNumber = page) {
    setLoading(true)
    try {

      const response = await axios.get(
        `${VITE_BACKEND_URL}/document?page=${pageNumber}&limit=10`,
        { withCredentials: true }
      );
      const newData = response.data.content || [];

      setPage(response.data.page)
      setTotalPages(response.data.totalPages)
      setContents(newData)
    } catch {
      alert("error fetching your contents")
    } finally {
      setLoading(false)
    }



  }

  const deleteContent = async (id: string) => {
    await axios.delete(
      `${VITE_BACKEND_URL}/delete/${id}`,
      { withCredentials: true }
    );

    setContents(prev => prev.filter(item => item.id !== id));
  };

  return { contents, refresh, deleteContent, page, totalPages,loading };
}