"use client";
import Image from "next/image";
import loginimage from "@/public/assets/images/kotaklogin.png";
import logo from "@/public/assets/images/kotaklogo.png";
import { Eye, EyeOff } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";


const ADLoginForm = () => {
  const initialState = {
    status: "",
    message: "",
  };

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState({
    userID: "",
    password: "",
    error: "",
  });


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    
  }


  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left side illustration */}
      <div className="flex flex-col justify-center w-1/2 px-12">
        <h1 className="text-3xl font-semibold mt-10 text-gray-500">
          Hi, Welcome Back
        </h1>
        <Image
          src={loginimage}
          alt="Login Illustration"
          className="w-full h-auto mt-18"
        />
      </div>

      {/* Right side form */}
      <div className="flex flex-col justify-center items-center w-1/2 px-12 bg-white">
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Kotak Logo" className="h-[50%] w-[70%]" />
        </div>

        <form
          id="login-form"
          className="w-full max-w-sm space-y-5"
          onSubmit={()=> console.log()}
        >
          <h2 className="text-2xl font-semibold text-gray-600">
            Sign in to Drishti PF
          </h2>
          <p className="text-gray-500 text-sm">(Your corporate login)</p>

          {/* User ID */}
          <Input
            type="text"
            placeholder="User ID"
            className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            id="userid"
            value={state.userID}
            autoFocus
            onChange={(e) => setState({ ...state, userID: e.target.value })}
          />

          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500 pr-10"
              id="password"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#0a2f73] hover:bg-[#002c5f] text-white font-semibold"
          >
            LOGIN
          </Button>

          {/* Error */}
          {state.error && (
            <div className="text-red-500 h-3 text-sm mx-auto mt-0">
              {state.error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ADLoginForm;
 