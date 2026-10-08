"use client";

import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        } else {
          setMessage("Account created successfully. You can now sign in.");
          setIsLogin(true);
          setName("");
          setPassword("");
        }
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Backend connection failed");
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7F3] flex items-center justify-center p-5 sm:p-8">

      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-[28px] overflow-hidden shadow-[0_25px_70px_rgba(39,72,61,0.12)] border border-[#E4E9E5] grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative bg-[#213D33] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">

          {/* Decorative shapes */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#789889]/20" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-[#A8C5B5]/10" />

          <div className="relative z-10">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl bg-[#A8C5B5] flex items-center justify-center">
                <span className="text-[#213D33] text-lg font-bold">
                  M
                </span>
              </div>

              <span className="text-xl font-bold tracking-tight">
                MindSpace
              </span>
            </div>

            {/* Main heading */}
            <div className="max-w-md">

              <p className="text-[#A8C5B5] text-sm font-semibold uppercase tracking-[0.18em] mb-5">
                Your private space
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] font-semibold tracking-tight">
                A quieter place
                <br />
                to understand
                <br />
                <span className="text-[#A8C5B5]">
                  yourself.
                </span>
              </h1>

              <p className="mt-7 text-[#D4DED9] text-base sm:text-lg leading-8 max-w-lg">
                Write freely, understand your moods, and reflect
                on your thoughts with a private space designed
                for everyday mental wellness.
              </p>

            </div>

            {/* Features */}
            <div className="mt-12 space-y-4">

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full border border-[#789889]/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#A8C5B5]" />
                </div>

                <div>
                  <p className="font-semibold">
                    Private journaling
                  </p>
                  <p className="text-sm text-[#AABAB2]">
                    A personal space for your thoughts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full border border-[#789889]/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#A8C5B5]" />
                </div>

                <div>
                  <p className="font-semibold">
                    Mood awareness
                  </p>
                  <p className="text-sm text-[#AABAB2]">
                    Understand patterns over time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full border border-[#789889]/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#A8C5B5]" />
                </div>

                <div>
                  <p className="font-semibold">
                    AI wellness assistant
                  </p>
                  <p className="text-sm text-[#AABAB2]">
                    A supportive space to reflect
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom text */}
          <div className="relative z-10 mt-12">
            <p className="text-xs text-[#91A59B]">
              Designed for reflection, not diagnosis.
            </p>
          </div>

        </section>

        {/* RIGHT SIDE */}
        <section className="p-8 sm:p-12 lg:p-16 flex items-center">

          <div className="w-full max-w-md mx-auto">

            {/* Header */}
            <div className="mb-10">

              <p className="text-[#668174] text-sm font-semibold mb-3">
                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </p>

              <h2 className="text-3xl sm:text-4xl font-semibold text-[#18201C] tracking-tight">
                {isLogin
                  ? "Good to see you."
                  : "Create your space."}
              </h2>

              <p className="text-[#69756F] mt-3 leading-6">
                {isLogin
                  ? "Continue your personal wellness journey."
                  : "Start a private space for your thoughts and reflections."}
              </p>

            </div>

            {/* Registration name */}
            {!isLogin && (
              <div className="mb-5">

                <label className="block text-sm font-semibold text-[#26332D] mb-2">
                  Full name
                </label>

                <input
                  className="w-full h-12 px-4 rounded-xl border border-[#DDE4DF] bg-[#FAFBFA] text-[#18201C] placeholder-[#9AA59F] focus:outline-none focus:ring-2 focus:ring-[#A8C5B5] focus:border-[#789889] transition"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              </div>
            )}

            {/* Email */}
            <div className="mb-5">

              <label className="block text-sm font-semibold text-[#26332D] mb-2">
                Email address
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-[#DDE4DF] bg-[#FAFBFA] text-[#18201C] placeholder-[#9AA59F] focus:outline-none focus:ring-2 focus:ring-[#A8C5B5] focus:border-[#789889] transition"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            {/* Password */}
            <div className="mb-7">

              <label className="block text-sm font-semibold text-[#26332D] mb-2">
                Password
              </label>

              <input
                className="w-full h-12 px-4 rounded-xl border border-[#DDE4DF] bg-[#FAFBFA] text-[#18201C] placeholder-[#9AA59F] focus:outline-none focus:ring-2 focus:ring-[#A8C5B5] focus:border-[#789889] transition"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />

            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full h-12 rounded-xl bg-[#27483D] text-white font-semibold hover:bg-[#1E3A31] active:scale-[0.99] transition-all shadow-[0_8px_20px_rgba(39,72,61,0.18)]"
            >
              {isLogin ? "Sign in" : "Create account"}
            </button>

            {/* Message */}
            {message && (
              <div className="mt-5 px-4 py-3 rounded-xl bg-[#EEF4F0] border border-[#D7E4DC] text-[#385748] text-sm font-medium text-center">
                {message}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#E5E9E6]" />
              <span className="text-xs text-[#9AA59F] uppercase tracking-wider">
                {isLogin ? "New here?" : "Already a member?"}
              </span>
              <div className="flex-1 h-px bg-[#E5E9E6]" />
            </div>

            {/* Toggle */}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
              className="w-full h-12 rounded-xl border border-[#CBD6D0] text-[#27483D] font-semibold hover:bg-[#F3F7F4] transition"
            >
              {isLogin
                ? "Create an account"
                : "Sign in to your account"}
            </button>

            {/* Privacy */}
            <p className="text-center text-xs text-[#8A9690] mt-8 leading-5">
              Your journal is designed to be a private space
              for reflection and personal wellness.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}