import { useRef, useState } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function Signin() {
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    setLoading(true)
    try {
      await axios.post(BACKEND_URL + "/signin",
        {
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        },
        { withCredentials: true }
      );

      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Signin failed");
    } finally { setLoading(false) }
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
            Welcome back
          </h1>
          <p className="text-slate-500 mt-1">
            Sign in to access your second brain
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">
          <Input ref={emailRef} placeholder="Email address" />
          <Input ref={passwordRef} placeholder="Password" type="password" />
        </div>

        {/* Button */}
        <div className="mt-6">
          <Button
            disabled={loading}
            onClick={signin}
            fullWidth
            varient="primary"
            size="md"
            text={loading ? "singing in..." : "sing in"}
          />
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 cursor-pointer hover:underline transition"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
