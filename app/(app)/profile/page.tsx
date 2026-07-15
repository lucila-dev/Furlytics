"use client";

import { useState, useEffect } from "react";
import { getProfile, setProfile } from "@/lib/profileStorage";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setName(p.name);
    setPhoto(p.photo);
    setBirthday(p.birthday ?? "");
    setPhone(p.phone ?? "");
    setAddress(p.address ?? "");
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfile({
      name,
      photo,
      birthday: birthday || null,
      phone: phone || null,
      address: address || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">Profile</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Your personal details.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Photo</label>
            <div className="w-24 h-24 rounded-full border-2 border-[var(--border)] bg-[var(--background)] overflow-hidden flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-[var(--muted)]">👤</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-2 block w-full text-sm text-[var(--muted)] file:mr-2 file:rounded-lg file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium file:bg-[var(--accent)] file:text-white hover:file:bg-[var(--accent-hover)]"
            />
          </div>
          <div className="flex-1 space-y-4 min-w-0">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +1 234 567 8900"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)]">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="City, country"
            rows={2}
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>

        {saved && (
          <p className="text-sm text-emerald-600">Profile saved.</p>
        )}
        <button
          type="submit"
          className="rounded-xl bg-[var(--accent)] px-4 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          Save profile
        </button>
      </form>
    </div>
  );
}
