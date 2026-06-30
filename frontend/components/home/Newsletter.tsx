"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { subscribersApi } from "@/lib/api/subscribers";
import { getUserMessage } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await subscribersApi.subscribe(email);
      setStatus("success");
      setMessage(response.message);
      notifySuccess(response.message || "You're subscribed!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      const msg = getUserMessage(error, "Unable to subscribe right now. Please try again.");
      setMessage(msg);
      notifyError(msg);
    }
  }

  return (
    <section id="newsletter" className="py-16 md:py-32 relative bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="hidden md:flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#B3DEE2]/40 to-[#CCD5AE]/40 rounded-[40px] blur-2xl transform -rotate-6" />
            <div className="relative z-10 drop-shadow-2xl border-b-2 border-slate-200/50 pb-2">
              <Image
                src="/assets/research_img.png"
                alt="Research graphic"
                width={400}
                height={400}
                className="w-full max-w-[400px] object-contain opacity-80"
              />
            </div>
          </div>
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#B3DEE2]/40 border border-[#B3DEE2] shadow-sm flex items-center justify-center mx-auto md:mx-0 text-slate-800">
              <Mail className="w-5 h-5 text-[#6aabaf]" />
            </div>
            <div>
              <span className="text-sm font-semibold tracking-wide text-[#6aabaf] block mb-2">
                Stay Connected
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-800 leading-tight">
                Get our bi-weekly newsletter.
              </h2>
            </div>
            <p className="text-base text-slate-600 font-normal leading-relaxed">
              Receive updates on global health trends, climate research, society events, and student
              publications — curated by our executive team.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 sm:p-1.5 sm:rounded-full sm:border sm:border-[#B3DEE2] sm:bg-white/80 sm:backdrop-blur-md sm:focus-within:border-[#6aabaf] sm:focus-within:bg-white transition-all duration-300"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="yourname@gmail.com"
                  className="flex-1 min-w-0 bg-white/80 sm:bg-transparent border border-[#B3DEE2] sm:border-0 rounded-xl sm:rounded-full pl-5 pr-5 py-3.5 text-base sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-[#6aabaf] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 w-full sm:w-auto bg-slate-700 text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing…
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="text-sm text-rose-600 font-medium">{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
