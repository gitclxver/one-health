"use client";

import { useEffect, useState } from "react";
import { adminSubscribersApi } from "@/lib/api/admin";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";
import { ContentMessage } from "@/components/ui/ContentMessage";
import type { Subscriber } from "@/lib/types/api";
import { Loader2 } from "lucide-react";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminSubscribersApi.list();
      setSubscribers(res.data);
    } catch (err) {
      setError(getUserMessage(err, "Unable to load subscribers."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleRemove(id: string) {
    try {
      await adminSubscribersApi.remove(id);
      notifySuccess("Subscriber removed");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Subscribers</h1>
      {error && <ContentMessage message={error} variant="error" />}
      {loading && <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf] mx-auto" />}
      {!loading && !error && subscribers.length === 0 && (
        <ContentMessage message={EMPTY_MESSAGES.subscribers} />
      )}
      <div className="space-y-2">
        {subscribers.map((sub) => (
          <div
            key={sub.id}
            className="bg-white/70 border border-slate-100 rounded-xl p-4 flex justify-between items-center gap-3"
          >
            <div>
              <p className="font-medium text-slate-800">{sub.email}</p>
              <p className="text-xs text-slate-500">
                {sub.isVerified ? "Verified" : "Pending verification"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleRemove(sub.id)}
              className="text-xs text-rose-600 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
