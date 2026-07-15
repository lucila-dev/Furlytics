"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

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

  /** Always open verify UI; try to email a code (failures don't block the code screen). */
  async function goToVerify(normalizedEmail: string, note: string) {
    let sendError = "";
    const otpRes = await authClient.emailOtp.sendVerificationOtp({
      email: normalizedEmail,
      type: "email-verification",
    });
    if (otpRes.error) {
      const resend = await authClient.sendVerificationEmail({
        email: normalizedEmail,
        callbackURL:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : "/login",
      });
      if (resend.error) {
        sendError =
          otpRes.error.message ||
          resend.error.message ||
          "Could not send code automatically — click Resend code.";
      }
    }
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
        const msg = signInError.message || "Invalid email or password";
        if (/verif/i.test(msg)) {
          await goToVerify(
            normalizedEmail,
            "Verify your email to continue. Enter the code we sent you."
          );
          return;
        }
        setError(msg);
        setLoading(false);
        return;
      }

      if (data?.user && !data.user.emailVerified) {
        await goToVerify(normalizedEmail, "Check your email for a verification code.");
        return;
      }

      if (await enterApp()) return;

      await goToVerify(normalizedEmail, "Check your email for a verification code.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
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
        if (signInError) {
          setError(signInError.message || "Email verified. Please sign in with your password.");
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
    try {
      const otpRes = await authClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "email-verification",
      });
      if (otpRes.error) {
        const resend = await authClient.sendVerificationEmail({
          email: normalizedEmail,
          callbackURL:
            typeof window !== "undefined"
              ? `${window.location.origin}/login`
              : "/login",
        });
        if (resend.error) {
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
      setMessage("New code sent. Use the newest email (ignore older codes).");
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
          Enter the code Neon sent to <span className="font-medium text-[var(--foreground)]">{email}</span>
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
            onClick={() => setStep("auth")}
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
        {/verif/i.test(error) && (
          <button
            type="button"
            disabled={loading || !email}
            onClick={async () => {
              setLoading(true);
              await goToVerify(
                email.trim().toLowerCase(),
                "Check your email for a verification code."
              );
            }}
            className="w-full text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Send verification code
          </button>
        )}
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
    <Suspense fallback={<div className="rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg text-center text-[var(--muted)]">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
