import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

/** Returns the app User id only when Neon Auth session exists and email is verified. */
export async function getSessionUserId(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user?.id || !user.email) return null;
  if (!user.emailVerified) return null;

  const email = user.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing.id;

  const created = await prisma.user.create({
    data: {
      id: user.id,
      email,
    },
  });
  return created.id;
}

export async function getVerifiedSession() {
  const { data: session } = await auth.getSession();
  if (!session?.user?.emailVerified) return null;
  return session;
}
