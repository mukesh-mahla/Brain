import axios from "axios";
import { useEffect, useState } from "react";
 const VITE_BACKEND_URL  =  import.meta.env.VITE_BACKEND_URL

export function useContent(){
    const [contents,setContents] = useState([])
         function refresh (){
              axios.get(`${VITE_BACKEND_URL}/document`,{withCredentials:true}).then((response)=>{setContents(response.data.content)})
}
    useEffect(()=>{
        refresh()
      const interval=  setInterval(refresh,10*1000)

        return ()=>{
            clearInterval(interval)
        }
    })
    return {contents,refresh}
}