import {  useEffect, useState } from 'react'
import '../App.css'

import { Button } from '../component/button'
import { Card } from '../component/card'
import { CreateContentmodal } from '../component/CreateContantModel'
import {PlusIcon}  from '../icons/plus'
import { ShareIcon } from '../icons/share'
import { Sidebar } from '../component/sidebar'
import { useContent } from '../hooks/useContent'
import { shareBrain } from '../hooks/shareBrain'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


export function DashBoard() {
  const navigate = useNavigate()
  
   const [ModalOpen,setModalOpen] = useState(false)
   const {contents,refresh} = useContent()

   const [query, setQuery] = useState("");
   const [searchResults, setSearchResults] = useState(contents);


   const handleSearch = async () => {
  if (!query.trim()) {
    setSearchResults(contents);
    return;
  }

  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/search`,
    { query },
    { withCredentials: true }
  );

  setSearchResults(res.data.contents);
};


useEffect(()=>{
  refresh();
},[ModalOpen])

useEffect(()=>{
  axios.post(`${import.meta.env.VITE_BACKEND_URL}/reindex`,{}, { withCredentials: true })
},[])


 return (
  <div className="min-h-screen bg-stone-50">

    {/* SIDEBAR */}
    <div className="fixed inset-y-0 left-0 w-64">
      <Sidebar />
    </div>

    {/* MAIN AREA */}
    <div className="ml-64 min-h-screen flex flex-col">

      {/* TOP COMMAND BAR */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">

        {/* LEFT: SEARCH + ACTIONS */}
        <div className="flex items-center gap-4 flex-1">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your brain by meaning..."
            className="
              flex-1 px-4 py-2 rounded-lg border border-slate-300
              focus:outline-none focus:ring-2 focus:ring-indigo-500
            "
          />

          <Button
            text="Search"
            varient="secondary"
            size="sm"
            onClick={handleSearch}
          />

          <Button
            text="Ask AI"
            varient="primary"
            size="sm"
            onClick={() => navigate("/askai")}
          />

          <Button
            varient="primary"
            text="Add"
            size="sm"
            startIcon={<PlusIcon size="md" />}
            onClick={() => setModalOpen(true)}
          />
        </div>

        {/* RIGHT: SHARE BRAIN */}
        <div className="flex items-center gap-3 ml-6 border-l border-slate-200 pl-6">
          <Button
            varient="secondary"
            text="Share Brain"
            size="sm"
            startIcon={<ShareIcon size="md" />}
            onClick={shareBrain}
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 px-8 py-6">

        <CreateContentmodal
          open={ModalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* SEARCH MODE INDICATOR */}
        {searchResults.length > 0 && (
          <div className="mb-4 text-sm text-slate-500">
            Showing results for “{query}”
            <button
              onClick={() => setSearchResults([])}
              className="ml-2 text-indigo-600 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* CARDS GRID (SINGLE SOURCE OF TRUTH) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
  {(searchResults.length > 0 ? searchResults : contents).map(
    ({ id, type, link, title, summary, tags }) => (
      <div key={id} className="break-inside-avoid">
        <Card
          id={id}
          type={type}
          link={link}
          title={title}
          summary={summary}
          tags={tags}
        />
      </div>
    )
  )}
</div>
      </div>
    </div>
  </div>
);


}


