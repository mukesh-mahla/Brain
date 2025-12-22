import axios from "axios";
  const VITE_BACKEND_URL  =  import.meta.env.VITE_BACKEND_URL

export async function shareBrain(){
  const respone = await axios.post(`${VITE_BACKEND_URL}/brain/share`,{share:true},{withCredentials:true})
const shareUrl = `${VITE_BACKEND_URL}/brain${respone.data.link}`

return shareUrl
}