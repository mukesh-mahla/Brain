import axios from "axios";
import { useEffect, useState } from "react";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export function useShareBrain() {
  const [shareLink, setShareLink] = useState("")

  useEffect(() => {
    async function fetchShareUrl() {
      try {
        const Sharelink = await axios.post(`${VITE_BACKEND_URL}/brain/share`, { share: true }, { withCredentials: true })
        const url = `${VITE_BACKEND_URL}/brain/${Sharelink.data.link}`;
        setShareLink(url);
      }
      catch (e) {
        console.error("Error generating share link", e);
      }
    }
    fetchShareUrl()
  }, [])

  const frontendLink ="brain-three-sage.vercel.app"

  const handleCopy = () => {
    navigator.clipboard.writeText(`${frontendLink}//brain/${shareLink}`)
  }

  return {
    handleCopy,
    shareLink
  }
}