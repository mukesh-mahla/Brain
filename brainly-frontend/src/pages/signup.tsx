import { useRef } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function Signup() {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup() {
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    await axios.post(BACKEND_URL + "/signup", {
      firstName,
      lastName,
      email,
      password,
    });

    alert("You have signed up!");
    navigate("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Create your brain
        </h1>
        <p className="text-slate-500 text-center mt-1">
          Start saving knowledge intelligently
        </p>

        {/* Form */}
        <div className="mt-8 space-y-4">
          <Input ref={firstNameRef} placeholder="First name" />
          <Input ref={lastNameRef} placeholder="Last name" />
          <Input ref={emailRef} placeholder="Email address" />
          <Input ref={passwordRef} placeholder="Password" type="password" />
        </div>

        {/* Action */}
        <div className="mt-6">
          <Button
            onClick={signup}
            loading={false}
            fullWidth
            varient="primary"
            size="md"
            text="Create Account"
          />
        </div>

        {/* Footer */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
