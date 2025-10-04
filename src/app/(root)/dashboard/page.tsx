import React from "react";

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="max-w-xl text-center space-y-8">
        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Something awesome is coming soon.
        </h1>

        {/* Description */}
        <p className="text-lg ">
          We’re working hard to launch new Dashboard. Stay tuned for something
          amazing!
        </p>
      </div>
    </div>
  );
}
