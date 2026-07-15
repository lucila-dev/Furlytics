"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { friendlyAuthError, PRODUCTION_ORIGIN } from "@/lib/authOrigin";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"auth" | "verify">("auth");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function enterApp() {
    const { data } = await authClient.getSession();
    if (data?.user?.emailVerified) {
      router.push(callbackUrl);
      router.refresh();
      return true;
    }
    return false;
  }

  async function sendCode(normalizedEmail: string) {
    const otpRes = await authClient.emailOtp.sendVerificationOtp({
      email: normalizedEmail,
      type: "email-verification",
    });
    if (!otpRes.error) return null;

    const resend = await authClient.sendVerificationEmail({
      email: normalizedEmail,
      callbackURL:
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : "/login",
    });
    if (!resend.error) return null;

    return friendlyAuthError(
      otpRes.error.message ||
        resend.error.message ||
        "Could not send code. Click Resend code to try again."
    );
  }

  async function openVerify(normalizedEmail: string, note: string, autoSend: boolean) {
    let sendError = "";
    if (autoSend) {
      sendError = (await sendCode(normalizedEmail)) || "";
    }
    setEmail(normalizedEmail);
    setStep("verify");
    setMessage(sendError ? "" : note);
    setError(sendError);
    setLoading(false);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        const msg = friendlyAuthError(signInError.message || "Invalid email or password");
        // Neon blocks unverified accounts — always open the code screen
        if (/verif/i.test(msg) || /not.?verified/i.test(msg)) {
          await openVerify(
            normalizedEmail,
            "We sent a verification code to your email.",
            true
          );
          return;
        }
        setError(msg);
        setLoading(false);
        return;
      }

      if (data?.user && !data.user.emailVerified) {
        await openVerify(
          normalizedEmail,
          "We sent a verification code to your email.",
          true
        );
        return;
      }

      if (await enterApp()) return;

      await openVerify(
        normalizedEmail,
        "We sent a verification code to your email.",
        true
      );
    } catch (err) {
      setError(
        friendlyAuthError(err instanceof Error ? err.message : "Sign in failed. Please try again.")
      );
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { data, error: verifyError } = await authClient.emailOtp.verifyEmail({
        email: normalizedEmail,
        otp: code.trim(),
      });
      if (verifyError) {
        setError(verifyError.message || "Invalid verification code");
        setLoading(false);
        return;
      }

      if (data?.user?.emailVerified || data?.status) {
        if (await enterApp()) return;

        const { error: signInError } = await authClient.signIn.email({
          email: normalizedEmail,
          password,
        });
        if (signInError && !/verif/i.test(signInError.message || "")) {
          setError(signInError.message || "Email verified. Please try signing in again.");
          setStep("auth");
          setLoading(false);
          return;
        }

        if (await enterApp()) return;
      }

      setError("Email verified, but sign in failed. Try signing in again.");
      setStep("auth");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const sendError = await sendCode(normalizedEmail);
    if (sendError) {
      setError(sendError);
    } else {
      setCode("");
      setMessage("New code sent. Use the newest email (ignore older codes).");
    }
    setLoading(false);
  }

  if (step === "verify") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Verify your email</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Enter the code Neon sent to{" "}
          <span className="font-medium text-[var(--foreground)]">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          {(error || message) && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                error ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"
              }`}
            >
              {error || message}
            </p>
          )}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-[var(--foreground)]">
              Verification code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleResend}
            className="w-full text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Resend code
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("auth");
              setError("");
              setMessage("");
            }}
            className="w-full text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Back to sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
        <span aria-hidden>🐾</span> Sign in
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Furlytics – Pet Behaviour & Health</p>
      <form onSubmit={handleSignIn} className="mt-6 space-y-4">
        {error && (
          <div className="space-y-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <p>{error}</p>
            {/origin/i.test(error) && (
              <a
                href={PRODUCTION_ORIGIN + "/login"}
                className="inline-flex font-semibold underline"
              >
                Open the real login page →
              </a>
            )}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <button
          type="button"
          disabled={loading || !email.trim()}
          onClick={async () => {
            setError("");
            setMessage("");
            setLoading(true);
            await openVerify(
              email.trim().toLowerCase(),
              "Enter the code from your email, or tap Resend code.",
              true
            );
          }}
          className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 disabled:opacity-50"
        >
          I need to verify my email
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        No account?{" "}
        <Link href="/register" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg text-center text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
