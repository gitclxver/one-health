"use client";

import { useEffect, useState } from "react";
import { adminApplicationsApi } from "@/lib/api/admin";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";
import { ContentMessage } from "@/components/ui/ContentMessage";
import type { MembershipApplication } from "@/lib/types/api";
import { Loader2 } from "lucide-react";

const STATUSES = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"] as const;

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setApplications(await adminApplicationsApi.list());
    } catch (err) {
      setError(getUserMessage(err, "Unable to load applications."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await adminApplicationsApi.update(id, { status });
      notifySuccess(`Application marked as ${status.toLowerCase()}`);
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Membership Applications</h1>
      {error && <ContentMessage message={error} variant="error" />}
      {loading && <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf] mx-auto" />}
      {!loading && !error && applications.length === 0 && (
        <ContentMessage message={EMPTY_MESSAGES.applications} />
      )}
      <div className="space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white/70 border border-slate-100 rounded-xl p-4">
            <p className="font-medium text-slate-800">{app.fullName}</p>
            <p className="text-sm text-slate-600">{app.email}</p>
            <p className="text-sm text-slate-500 mt-1">{app.interest}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => void updateStatus(app.id, status)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    app.status === status
                      ? "bg-[#6aabaf] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
