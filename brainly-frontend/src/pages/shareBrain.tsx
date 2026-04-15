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
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMoreLoading, setHasMoreLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  if (error) return <p className="text-red-500 p-6">{error}</p>
  if (loading) return <p className="text-gray-400 p-6">Loading...</p>

  return (
    <div className="min-h-screen bg-stone-50">

      {/*  SIDEBAR  */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar />
      </div>

      
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
         
          <div className="relative w-64 bg-white h-full z-50 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <div className="md:ml-64 h-screen flex flex-col">

        {/* HEADER */}
        <div className="shrink-0 px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-slate-200 bg-white flex items-center gap-3">

          {/* Hamburger  */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-slate-900 truncate">
              {userName ? `${userName}'s Brain 🧠` : "Shared Brain 🧠"}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-0.5">Public knowledge collection</p>
          </div>
        </div>

        {/* SCROLLABLE CARD GRID */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
          {contents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-3 opacity-40">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <line x1="13" y1="20" x2="27" y2="20" />
                <line x1="20" y1="13" x2="20" y2="27" />
              </svg>
              <p className="text-sm">No content shared yet</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {contents.map((item) => (
                <div key={item.id} className="break-inside-avoid transition hover:scale-[1.02]">
                  <Card {...item} showAction={false} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="shrink-0 sticky bottom-0 bg-white border-t border-slate-200 px-4 md:px-8 py-3 flex justify-between md:justify-end items-center gap-3">
          <button
            disabled={page === 1 || hasMoreLoading}
            onClick={() => getContent(page - 1)}
            className="px-3 md:px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors"
          >
            {hasMoreLoading ? "..." : "← Prev"}
          </button>

          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages || hasMoreLoading}
            onClick={() => getContent(page + 1)}
            className="px-3 md:px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            {hasMoreLoading ? "..." : "Next →"}
          </button>
        </div>

      </div>
    </div>
  )
}