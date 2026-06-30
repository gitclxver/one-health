"use client";

import { useEffect, useState } from "react";
import { adminUsersApi } from "@/lib/api/admin";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { ContentMessage } from "@/components/ui/ContentMessage";
import type { User } from "@/lib/types/api";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminUsersApi
      .list()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(getUserMessage(err, "Unable to load users.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Users</h1>
      {error && <ContentMessage message={error} variant="error" />}
      {loading && <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf] mx-auto" />}
      {!loading && !error && users.length === 0 && <ContentMessage message={EMPTY_MESSAGES.users} />}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="bg-white/70 border border-slate-100 rounded-xl p-4">
            <p className="font-medium text-slate-800">{user.email}</p>
            <p className="text-xs text-slate-500">
              {user.firstName} {user.lastName} · {user.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
