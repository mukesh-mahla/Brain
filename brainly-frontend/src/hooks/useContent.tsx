import axios from "axios";
import { useEffect, useState } from "react";
 const VITE_BACKEND_URL  =  import.meta.env.VITE_BACKEND_URL

 type Content = {
  id: string;
  type: "twitter" | "youtube";
  link: string;
  title: string;
  summary: string;
  tags: string[];
};

export function useContent(){
    const [contents,setContents] = useState<Content[]>([])
         function refresh (){
              axios.get(`${VITE_BACKEND_URL}/document`,{withCredentials:true}).then((response)=>{setContents(response.data.content || [])})

}

 const deleteContent = async (id: string) => {
    await axios.delete(
      `${VITE_BACKEND_URL}/delete/${id}`,
      { withCredentials: true }
     
    );

    
    setContents(prev => prev.filter(item => item.id !== id));
  
  };

    useEffect(()=>{
        refresh()
      const interval=  setInterval(refresh,100*1000)

        return ()=>{
            clearInterval(interval)
        }
    },[])
    return {contents,refresh, deleteContent}
}


