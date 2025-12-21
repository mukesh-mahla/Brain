import axios from "axios";
import { BACKEND_URL } from "../config";

export async function shareBrain(){
  const respone = await axios.post(`${BACKEND_URL}/brain/share`,{share:true},{withCredentials:true})
const shareUrl = `http://localhost300/brain${respone.data.link}`
}