import { useRef, useState } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import z from "zod"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const signUpSchema = z.object({
  firstName: z.string().min(1, "first name is required"),
  lastName: z.string().min(1, "last name is required"),
  email: z.string().email(),
  password: z.string().min(6, "length should be atleast 6 character"),
})

export function Signup() {
  const [loading, setLoading] = useState(false)
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [zodError, setZodError] = useState<Record<string, string[]>>({})
  const navigate = useNavigate();



  async function signup() {
    const firstName = firstNameRef.current?.value || ""
    const lastName = lastNameRef.current?.value || ""
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""

    const finalInput = signUpSchema.safeParse({ firstName, lastName, email, password })
    if (!finalInput.success) {
      setZodError(finalInput.error.flatten().fieldErrors)
      return
    }
    setZodError({})
    setLoading(true);

    try {
      await axios.post(BACKEND_URL + "/signup", {
        firstName: firstNameRef.current?.value,
        lastName: lastNameRef.current?.value,
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      }, { withCredentials: true });

      navigate("/signin");
    } catch (error) {
      console.error(error);
      alert("Signup failed");  // you can improve this later
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="
        w-full max-w-md bg-white
        rounded-2xl shadow-xl
        p-8
        animate-fadeIn
      ">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Create your brain
          </h1>
          <p className="text-slate-500 mt-1">
            Start saving knowledge intelligently
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">
          <Input ref={firstNameRef} placeholder="First name" />
          {zodError.firstName && (
            <p className="text-xs text-red-500">{zodError.firstName[0]}</p>
          )}
          <Input ref={lastNameRef} placeholder="Last name" />
          {zodError.lastName && (
            <p className="text-xs text-red-500">{zodError.lastName[0]}</p>
          )}
          <Input ref={emailRef} placeholder="Email address" />
          {zodError.email && (
            <p className="text-xs text-red-500">{zodError.email[0]}</p>
          )}
          <Input ref={passwordRef} placeholder="Password" type="password" />
          {zodError.password && (
            <p className="text-xs text-red-500">{zodError.password[0]}</p>
          )}
        </div>

        {/* Button */}
        <div className="mt-6">
          <Button
            disabled={loading}
            onClick={signup}
            fullWidth
            varient="primary"
            size="md"
            text={loading ? "Creating..." : "Create Account"}

          />
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-indigo-600 cursor-pointer hover:underline transition"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
