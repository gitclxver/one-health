"use client";

import { useEffect, useState } from "react";
import { adminExcoApi } from "@/lib/api/admin";
import { getUserMessage, EMPTY_MESSAGES } from "@/lib/user-messages";
import { notifyError, notifySuccess } from "@/lib/toast";
import { ContentMessage } from "@/components/ui/ContentMessage";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ExcoMember } from "@/lib/types/api";
import { Loader2 } from "lucide-react";

export default function AdminExcoPage() {
  const [members, setMembers] = useState<ExcoMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setMembers(await adminExcoApi.list(true));
    } catch (err) {
      setError(getUserMessage(err, "Unable to load executive members."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminExcoApi.create({
        name,
        role,
        description,
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      setName("");
      setRole("");
      setDescription("");
      setAvatarUrl("");
      notifySuccess("Executive member added");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await adminExcoApi.remove(id);
      notifySuccess("Member removed");
      await load();
    } catch (err) {
      notifyError(getUserMessage(err));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Executive Committee</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white/70 border border-slate-100 rounded-2xl p-5 mb-8 space-y-4"
      >
        <h2 className="font-semibold text-slate-800">Add member</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bio"
          required
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6aabaf]"
        />
        <ImageUpload
          label="Profile photo"
          value={avatarUrl}
          onChange={setAvatarUrl}
          context="exco"
          altText={name || "Executive member photo"}
          square
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-full bg-slate-700 text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Add member
        </button>
      </form>

      {error && <ContentMessage message={error} variant="error" />}
      {loading && <Loader2 className="w-6 h-6 animate-spin text-[#6aabaf] mx-auto" />}
      {!loading && !error && members.length === 0 && (
        <ContentMessage message={EMPTY_MESSAGES.exco} />
      )}

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white/70 border border-slate-100 rounded-xl p-4 flex justify-between gap-3"
          >
            <div>
              <p className="font-medium text-slate-800">{member.name}</p>
              <p className="text-xs text-slate-500">{member.role}</p>
            </div>
            <button
              type="button"
              onClick={() => void handleRemove(member.id)}
              className="text-xs text-rose-600 font-semibold shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
