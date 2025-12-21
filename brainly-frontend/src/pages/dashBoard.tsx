import { useEffect, useState } from 'react'
import '../App.css'

import { Button } from '../component/button'
import { Card } from '../component/card'
import { CreateContentmodal } from '../component/CreateContantModel'
import {PlusIcon}  from '../icons/plus'
import { ShareIcon } from '../icons/share'
import { Sidebar } from '../component/sidebar'
import { useContent } from '../hooks/useContent'
import { shareBrain } from '../hooks/shareBrain'


export function DashBoard() {
   const [ModalOpen,setModalOpen] = useState(false)
   const {contents,refresh} = useContent()

useEffect(()=>{
  refresh();
},[ModalOpen])


  return <div>
    <div className='fixed'><Sidebar/></div>
    <div className='p-4 ml-72 bg-grey-200 min-h-screen '>
      <CreateContentmodal open ={ModalOpen} onClose={()=>{setModalOpen(false)}}/>
        <div className='flex  justify-end gap-4 '>
          <Button varient='secondary' text='share brain' size='sm' startIcon={<ShareIcon size='md'/>} onClick={shareBrain}/>
          <Button varient='primary' text='add-content' size='sm' startIcon={<PlusIcon size='md'/>} onClick={()=>{setModalOpen(true)}}/>
       </div>
        <div className='flex gap-2 flex-wrap pt-2'>   
          {contents.map(({type,link,title})=><Card  type={type} link={link} title={title}/>)}
        </div>
    </div>
  </div>
}


