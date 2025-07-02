"use client";
import { signIn } from "next-auth/react";

export default function WelcomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-blue-300 to-yellow-200 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-2xl animate-pulse" style={{zIndex:0}}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full opacity-40 blur-2xl animate-pulse" style={{zIndex:0}}></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl animate-pulse" style={{zIndex:0, transform:'translate(-50%,-50%)'}}></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow mb-4 text-center">Welcome to <span className="text-purple-600">Katomaran</span></h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-8 text-center max-w-xl">Your modern, collaborative task management platform. Organize, track, and achieve your goals with style!</p>
        <a href="/signin" className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-blue-400 hover:to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-transform duration-200 hover:scale-105">Get Started</a>
      </div>
    </div>
  );
}