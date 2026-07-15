"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { friendlyAuthError } from "@/lib/authOrigin";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        email: normalizedEmail,
        password,
        name: normalizedEmail.split("@")[0] || "Pet parent",
      });

      if (signUpError) {
        setError(friendlyAuthError(signUpError.message || "Registration failed"));
        setLoading(false);
        return;
      }

      if (data?.user?.emailVerified) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // Neon already emails the verification code on sign-up —
      // do not send another OTP (that would invalidate the first code).
      setEmail(normalizedEmail);
      setMessage("Check your email for a verification code.");
      setStep("verify");
      setLoading(false);
    } catch (err) {
      const detail =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Registration failed. Please try again.";
      setError(detail);
      setLoading(false);
    }
  }

  async function enterApp(normalizedEmail: string) {
    const session = await authClient.getSession();
    if (session.data?.user?.emailVerified) {
      router.push("/dashboard");
      router.refresh();
      return true;
    }

    const { error: signInError } = await authClient.signIn.email({
      email: normalizedEmail,
      password,
    });
    if (signInError) {
      setError(signInError.message || "Email verified. Please sign in.");
      setLoading(false);
      return false;
    }

    router.push("/dashboard");
    router.refresh();
    return true;
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
        await enterApp(normalizedEmail);
        return;
      }

      setMessage("Email verified! Sign in to continue.");
      setLoading(false);
      router.push("/login");
    } catch (err) {
      const detail =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Verification failed. Please try again.";
      setError(detail);
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      // Prefer Console-configured verification email (code or link)
      const resend = await authClient.sendVerificationEmail({
        email: normalizedEmail,
        callbackURL:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : "/login",
      });
      if (resend.error) {
        const otpRes = await authClient.emailOtp.sendVerificationOtp({
          email: normalizedEmail,
          type: "email-verification",
        });
        if (otpRes.error) {
          setError(
            otpRes.error.message ||
              resend.error.message ||
              "Could not resend code"
          );
          setLoading(false);
          return;
        }
      }
      setCode("");
      setMessage("New code sent. Use the latest email (ignore older codes).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    }
    setLoading(false);
  }

  if (step === "verify") {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Verify your email</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          We sent a code to <span className="font-medium text-[var(--foreground)]">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          {(error || message) && (
            <p className={`rounded-lg px-3 py-2 text-sm ${error ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>
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
            {loading ? "Verifying…" : "Verify & continue"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleResend}
            className="w-full text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Resend code
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-[var(--foreground)]">
        <span aria-hidden>🐾</span> Create account
      </h1>
      <p className="mt-1 text-sm text-[var(--muted)]">You’ll confirm your email before accessing Furlytics.</p>
      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
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
            Password (min 6 characters)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-[var(--foreground)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
