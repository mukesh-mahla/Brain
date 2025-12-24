import { useRef } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import axios from "axios";
      const BACKEND_URL  =  import.meta.env.VITE_BACKEND_URL
import { useNavigate } from "react-router-dom";


export function Signup(){
      const firstNameRef = useRef<HTMLInputElement>(null)
      const lastNameRef = useRef<HTMLInputElement>(null)
      const emailRef = useRef<HTMLInputElement>(null)
      const PasswordRef = useRef<HTMLInputElement>(null)
const navigate = useNavigate()
   async function signup(){
    console.log("function called")
        const firstName = firstNameRef.current?.value
        const lastName = lastNameRef.current?.value
        const email = emailRef.current?.value
        const password = PasswordRef.current?.value
        
      await axios.post(BACKEND_URL + "/signup",{
             
                 firstName,lastName,email,password
            
        })
        navigate('/signin')
          alert("you have signed up!")
    }

    return <div className="w-screen h-screen bg-gray-200 flex justify-center items-center ">
          <div className="bg-white rounded-xl border p-8 text-grey-400">
             <Input ref={firstNameRef} placeholder="First Name"   />
             <Input ref={lastNameRef} placeholder="Last Name"    />
             <Input ref={emailRef} placeholder="Your Email"   />
             <Input ref={PasswordRef} placeholder="Password"     />
          <div className=" flex justify-center">
            <Button onClick={signup} loading={false} fullWidth={true} varient="primary" size="md" text="Signup"/>
          </div>
        </div>
    </div>
    }