"use client";

import { useEffect, useState } from "react";
import { adminAnalyticsApi } from "@/lib/api/admin";
import { getUserMessage } from "@/lib/user-messages";
import { ContentMessage } from "@/components/ui/ContentMessage";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminAnalyticsApi
      .dashboard()
      .then(setStats)
      .catch((err) => setError(getUserMessage(err, "Unable to load dashboard.")));
  }, []);

  const cards = stats
    ? [
        { label: "Total views", value: stats.totalViews ?? 0 },
        { label: "Newsletters", value: stats.totalNewsletters ?? 0 },
        { label: "Subscribers", value: stats.totalSubscribers ?? 0 },
        { label: "Users", value: stats.totalUsers ?? 0 },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-8">Overview of site activity and content.</p>

      {error && <ContentMessage message={error} variant="error" />}

      {!error && !stats && <ContentMessage message="Loading dashboard…" />}

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white/70 backdrop-blur border border-slate-100 rounded-2xl p-5"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
