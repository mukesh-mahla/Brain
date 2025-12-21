import { useRef } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin(){
   
      const emailRef = useRef<HTMLInputElement>(null)
      const PasswordRef = useRef<HTMLInputElement>(null)
const navigate = useNavigate()
   async function signin(){
    console.log("function called")
        
        const email = emailRef.current?.value
        const password = PasswordRef.current?.value
        
     const response = await axios.post(BACKEND_URL + "/signin",{email,password},{withCredentials:true})
          console.log(response.data)
          navigate('/dashboard')
    }
    return <div className="w-screen h-screen bg-gray-200 flex justify-center items-center ">
          <div className="bg-white rounded-xl border p-8 text-grey-400">
             <Input ref={emailRef} placeholder="Your Email"  />
             <Input ref={PasswordRef} placeholder="Password"  />
          <div className=" flex justify-center">
            <Button onClick={signin} loading={false} fullWidth={true} varient="primary" size="md" text="Signin"/>
          </div>
        </div>
    </div>
}