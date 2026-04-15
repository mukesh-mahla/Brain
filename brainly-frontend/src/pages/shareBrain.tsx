import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card } from "../component/card"
import { Sidebar } from "../component/sidebar"

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const ShareBrain = () => {
  const { shareLink } = useParams()
  const [contents, setContents] = useState<any[]>([])
  const [userName, setUserName] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMoreLoading, setHasMoreLoading] = useState(false)

  async function getContent(pageNumber = page) {
    try {
      setHasMoreLoading(true)
      const res = await axios.get(`${VITE_BACKEND_URL}/brain/${shareLink}?page=${pageNumber}&limit=10`)
      setUserName(res.data.userName)
      setContents(res.data.contents)
      setPage(res.data.page)
      setTotalPages(res.data.totalPages)
    } catch {
      setError("Invalid or expired Link")
    } finally {
      setLoading(false)
      setHasMoreLoading(false)
    }
  }

  useEffect(() => {
    if (!shareLink) {
      setError("provide a valid link")
      return
    }
    setContents([])
    setPage(1)
    getContent(1)
  }, [shareLink])

  if (error) return <p className="text-red-500">{error}</p>
  if (loading) return <p className="text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-stone-50">

      {/* SIDEBAR */}
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>

      {/* MAIN AREA */}
      <div className="ml-64 h-screen flex flex-col">

        {/* HEADER */}
        <div className="px-8 pt-6 pb-4 shrink-0">
          <h1 className="text-3xl font-bold text-slate-900">
            {userName ? `${userName}'s Brain 🧠` : "Shared Brain 🧠"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Public knowledge collection</p>
        </div>

        {/* SCROLLABLE CARD GRID */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          <div className="ml-4 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {contents.length === 0 ? (
              <p className="text-gray-400">No content shared yet</p>
            ) : (
              contents.map((item) => (
                <div key={item.id} className="break-inside-avoid transition hover:scale-[1.02]">
                  <Card {...item} showAction={false} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAGINATION  */}
        <div className="shrink-0 sticky bottom-0 bg-white border-t border-slate-200 px-8 py-4 flex justify-end items-center gap-3">
          <button
            disabled={page === 1 || hasMoreLoading}
            onClick={() => getContent(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            {hasMoreLoading ? "Loading..." : "← Previous"}
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages || hasMoreLoading}
            onClick={() => getContent(page + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            {hasMoreLoading ? "Loading..." : "Next →"}
          </button>
        </div>

      </div>
    </div>
  )
}