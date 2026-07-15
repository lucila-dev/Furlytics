"use client";

import { useState, useRef, useEffect } from "react";

const LULU_INTRO =
  "Hey! I’m Lulu 🐾 I’m here if you’re worried about your pet or just want a second opinion. Ask me anything — symptoms, behaviour, “is this normal?” — I’ll keep it simple and friendly.";

export function QuickChat() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [introShown, setIntroShown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open && !introShown) {
      setMessages((m) => (m.length === 0 ? [{ role: "assistant", text: LULU_INTRO }] : m));
      setIntroShown(true);
    }
  }, [open, introShown]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setQuery("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = res.ok
        ? data.reply
        : "Aw, I’m having a little glitch on my end. Could you try that again in a moment?";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            typeof reply === "string" && reply.trim()
              ? reply
              : "Hmm, I blanked for a sec — mind asking me that again?",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry, I couldn’t get that through. Give it another go when you can!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)] transition-colors"
        aria-label={open ? "Close quick chat" : "Open quick chat"}
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
          <div className="border-b border-[var(--border)] bg-[var(--accent)]/10 px-4 py-3">
            <h3 className="font-semibold text-[var(--foreground)]">Lulu</h3>
            <p className="text-xs text-[var(--muted)]">Here for you and your pet</p>
          </div>
          <div ref={listRef} className="max-h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-4 bg-[var(--accent)]/20 text-[var(--foreground)]"
                    : "mr-4 bg-[var(--background)] text-[var(--foreground)]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="mr-4 rounded-xl bg-[var(--background)] px-3 py-2 text-sm text-[var(--muted)]">
                One sec…
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What’s on your mind?"
                className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
