import { useRef } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    await axios.post(
      BACKEND_URL + "/signin",
      { email, password },
      { withCredentials: true }
    );

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Welcome back
        </h1>
        <p className="text-slate-500 text-center mt-1">
          Sign in to access your second brain
        </p>

        {/* Form */}
        <div className="mt-8 space-y-4">
          <Input ref={emailRef} placeholder="Email address" />
          <Input ref={passwordRef} placeholder="Password" type="password" />
        </div>

        {/* Action */}
        <div className="mt-6">
          <Button
            onClick={signin}
            loading={false}
            fullWidth
            varient="primary"
            size="md"
            text="Sign In"
          />
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
