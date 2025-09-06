import React from "react";
import { Link } from "react-router-dom";

function MusictoCode() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-6 text-center">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src="/logo_code.png"
          alt="Code2Music Logo"
          className="w-14 h-14 object-contain"
        />
        <h1 className="text-3xl font-bold text-primary">Code2Music</h1>
      </div>

      {/* Heading */}
      <h2 className="text-5xl md:text-6xl font-bold mb-4 text-base-content">
        🚀 Coming Soon
      </h2>
      <p className="text-lg md:text-xl text-base-content/80 mb-8 max-w-xl">
        We're working hard to bring you an amazing experience. Stay tuned for updates and get ready to turn your code into music!
      </p>

      {/* Notify form */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-72"
        />
        <button className="btn btn-primary">Notify Me</button>
      </div>

      {/* Back Button */}
      <Link to="/" className="btn btn-outline">
        ← Back to Home
      </Link>

      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 opacity-20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400 opacity-20 rounded-full animate-bounce"></div>
    </main>
  );
}

export default MusictoCode;
