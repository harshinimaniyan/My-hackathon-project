"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-blue-300 to-yellow-200 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full opacity-30 blur-2xl animate-pulse" style={{zIndex:0}}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full opacity-40 blur-2xl animate-pulse" style={{zIndex:0}}></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl animate-pulse" style={{zIndex:0, transform:'translate(-50%,-50%)'}}></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow mb-4 text-center">Sign in to Katomaran</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-xl">Access your workspace securely with your Google account.</p>
        <button
          className="flex items-center gap-3 bg-white text-gray-800 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-50 transition-transform duration-200 hover:scale-105 border border-gray-200"
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.39 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.93 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.01-2.99-1.01-6.31 0-9.3l-7.98-6.2C.99 17.1 0 20.43 0 24c0 3.57.99 6.9 2.69 10.09l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.57l-7.19-5.6c-2.01 1.35-4.59 2.15-7.96 2.15-6.38 0-11.87-3.63-13.33-8.95l-7.98 6.2C6.71 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}