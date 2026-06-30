"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { applicationsApi } from "@/lib/api/content";
import { getUserMessage } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";

export default function JoinForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Human & Public Health");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      await applicationsApi.submit({ fullName, email, interest });
      setStatus("success");
      setMessage("Thank you! Your application has been submitted. We'll be in touch soon.");
      notifySuccess("Application submitted! We'll be in touch soon.");
      setFullName("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      const msg = getUserMessage(err, "Unable to submit your application. Please try again.");
      setMessage(msg);
      notifyError(msg);
    }
  }

  return (
    <section
      id="join"
      className="py-16 md:py-32 bg-slate-800 text-white border-t border-slate-700 rounded-t-[28px] md:rounded-t-[48px] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(204,213,174,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(179,222,226,0.12),transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center relative z-10">
        <div className="lg:col-span-6 space-y-5 md:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Become an active advocate for planetary wellbeing.
          </h2>
          <p className="text-[#B3DEE2]/90 text-base font-normal leading-relaxed max-w-xl">
            Join our student society to work alongside research scientists, participate in local ecological field projects,
            and contribute to global collaborative policy efforts.
          </p>
          <div className="flex flex-col gap-3 text-sm font-medium text-[#CCD5AE]/90 pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#CCD5AE]" /> Academic Credits
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#CCD5AE]" /> Field Experience
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl md:rounded-[32px] p-6 sm:p-8 md:p-10 backdrop-blur-md">
          {status === "success" ? (
            <div className="flex items-start gap-3 text-emerald-200">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#B3DEE2]/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    disabled={status === "loading"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#B3DEE2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#B3DEE2]/80 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@gmail.com"
                    disabled={status === "loading"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#B3DEE2]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#B3DEE2]/80 mb-2">Area of Interest</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-[#B3DEE2]"
                >
                  <option>Human & Public Health</option>
                  <option>Wildlife & Animal Health</option>
                  <option>Environmental & Soil Science</option>
                </select>
              </div>
              {status === "error" && <p className="text-sm text-rose-300">{message}</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#6aabaf] hover:bg-[#B3DEE2] hover:text-slate-800 text-white font-semibold text-sm py-4 rounded-xl shadow-xl shadow-[#B3DEE2]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
