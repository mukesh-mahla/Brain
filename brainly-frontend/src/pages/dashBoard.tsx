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


  return <div >
    <div className='flex justify-center p-2  inset-x-0 bottom-10 items-center fixed '>
      <Button varient='primary' text='Ask AI' size="md" onClick={()=>{
       navigate("/askai")
      }}></Button>
    </div>
    <div className='fixed'><Sidebar/></div>
    <div className='p-4 ml-72 bg-grey-200 min-h-screen '>
      <CreateContentmodal open ={ModalOpen} onClose={()=>{setModalOpen(false)}}/>
        <div className='flex  justify-end gap-4 '>
          <Button varient='secondary' text='share brain' size='sm' startIcon={<ShareIcon size='md'/>} onClick={shareBrain}/>
          <Button varient='primary' text='add content' size='sm' startIcon={<PlusIcon size='md'/>} onClick={()=>{setModalOpen(true)}}/>
       </div>
       <div className="flex gap-2 m-4">
  <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search by meaning (e.g. auth notes)"
    className="border p-2 rounded w-full "
  />
  <Button
    text="Search"
    varient="primary"
    size="sm"
    onClick={handleSearch}
  />
</div>
<div>
{searchResults.map(({ type, link, title,summary,tags }) => (
  <Card type={type} link={link} title={title} summary={summary} tags={tags}  />
))}
</div>
        <div className='flex gap-2 flex-wrap pt-2'>   
          {contents.map(({type,link,title,tags,summary})=><Card  type={type} link={link} title={title} summary={summary} tags={tags}/>)}
        </div>
    </div>
  </div>
}


