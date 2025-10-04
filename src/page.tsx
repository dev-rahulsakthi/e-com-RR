"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/ui/dashboard");
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold">Welcome to Drishti Pention Fund </h1>
      <p className="mt-4 text-lg">Please wait while the application loads...</p>
    </div>
  );
}
