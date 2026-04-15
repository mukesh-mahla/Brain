import { useEffect,  useState } from 'react'
import '../App.css'

import { Button } from '../component/button'
import { Card } from '../component/card'
import { CreateContentmodal } from '../component/CreateContantModel'
import { PlusIcon } from '../icons/plus'
import { ShareIcon } from '../icons/share'
import { Sidebar } from '../component/sidebar'
import { useContent } from '../hooks/useContent'
import { useShareBrain } from '../hooks/shareBrain'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export function DashBoard() {
  const navigate = useNavigate()
  const { handleCopy } = useShareBrain()
  const [ModalOpen, setModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { contents, refresh, deleteContent, page, totalPages, loading } = useContent()
  const [localContents, setLocalContents] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleDelete = async (id: string) => {
    setLocalContents(prev => prev.filter(item => item.id !== id))
    setSearchResults(prev => prev.filter(item => item.id !== id))
    try {
      await deleteContent(id)
    } catch (err) {
      console.error("Delete failed", err)
      refresh()
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults(contents)
      return
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/search`,
        { query },
        { withCredentials: true }
      )
      setSearchResults(res.data.contents || [])
    } catch (err) {
      console.error("search failed")
    }
  }

  useEffect(() => { setLocalContents(contents) }, [contents])
  useEffect(() => { refresh(1) }, [ModalOpen])
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/reindex`, {}, { withCredentials: true })
  }, [])

  const displayedItems = searchResults.length > 0 ? searchResults : localContents

  return (
    <div className="min-h-screen bg-stone-50">

      {/*  SIDEBAR  */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar />
      </div>

      
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* drawer */}
          <div className="relative w-64 bg-white h-full z-50 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* ── MAIN AREA ── */}
      <div className="md:ml-64 h-screen flex flex-col">

        {/* TOP COMMAND BAR */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4">

          {/* */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Hamburger*/}
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

            {/* Search input */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search your brain..."
              className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Desktop-only inline buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button text="Search" varient="secondary" size="sm" onClick={handleSearch} />
              <Button text="Ask AI" varient="primary" size="sm" onClick={() => navigate("/askai")} />
              <Button varient="primary" text="Add" size="sm" startIcon={<PlusIcon size="md" />} onClick={() => setModalOpen(true)} />
            </div>

            {/* Share — always visible */}
            <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-4 shrink-0">
              <Button varient="secondary" text="Share Brain" size="sm" startIcon={<ShareIcon size="md" />} onClick={handleCopy} />
            </div>

            {/* Mobile: compact icon buttons */}
            <div className="flex md:hidden items-center gap-1 shrink-0">
              <button
                onClick={handleSearch}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8.5" cy="8.5" r="5.5" />
                  <line x1="13" y1="13" x2="18" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => navigate("/askai")}
                className="p-2 rounded-lg hover:bg-slate-100 text-indigo-600 font-medium text-xs"
                aria-label="Ask AI"
              >
                AI
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                aria-label="Add content"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="8" y1="2" x2="8" y2="14" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                </svg>
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                aria-label="Share brain"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="15" cy="4" r="2" />
                  <circle cx="5" cy="10" r="2" />
                  <circle cx="15" cy="16" r="2" />
                  <line x1="7" y1="11" x2="13" y2="15" />
                  <line x1="7" y1="9" x2="13" y2="5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CARD AREA */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
          <CreateContentmodal open={ModalOpen} onClose={() => setModalOpen(false)} />

          {searchResults.length > 0 && (
            <div className="mb-4 text-sm text-slate-500">
              Results for "{query}"
              <button onClick={() => setSearchResults([])} className="ml-2 text-indigo-600 hover:underline">
                Clear
              </button>
            </div>
          )}

          {displayedItems.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-3 opacity-40">
                <rect x="6" y="6" width="28" height="28" rx="4" />
                <line x1="13" y1="20" x2="27" y2="20" />
                <line x1="20" y1="13" x2="20" y2="27" />
              </svg>
              <p className="text-sm">No content yet — tap + to add something</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {displayedItems.map(({ id, type, link, title, summary, tags }) => (
                <div key={id} className="break-inside-avoid">
                  <Card
                    id={id}
                    type={type}
                    link={link}
                    title={title}
                    summary={summary || ""}
                    tags={tags || []}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION FOOTER */}
        <div className="shrink-0 sticky bottom-0 bg-white border-t border-slate-200 px-4 md:px-8 py-3 flex justify-between md:justify-end items-center gap-3">
          <button
            disabled={page === 1 || loading}
            onClick={() => refresh(page - 1)}
            className="px-3 md:px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200 transition-colors"
          >
            ← Prev
          </button>

          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages || loading}
            onClick={() => refresh(page + 1)}
            className="px-3 md:px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  )
}