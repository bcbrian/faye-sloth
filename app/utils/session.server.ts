import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import type { User } from "firebase/auth";
import { createCookieSessionStorage, redirect } from "remix";
import {
  emailAndPasswordSignIn,
  emailAndPasswordSignUp,
} from "~/firebase/auth";
import { getAuth } from "~/firebase/firebaseAdmin.server";

type LoginForm = {
  username: string;
  password: string;
};

export interface AuthUser extends DecodedIdToken {}

export async function register({ username, password }: LoginForm) {
  const user = await emailAndPasswordSignUp({ email: username, password });
  return user;
}

export async function login({ username, password }: LoginForm): Promise<User> {
  const user = await emailAndPasswordSignIn({ email: username, password });
  return user;
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

let storage = createCookieSessionStorage({
  cookie: {
    name: "cs_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserToken(request: Request) {
  let session = await getUserSession(request);
  let userToken = session.get("userToken");
  if (!userToken || typeof userToken !== "string") return null;
  return userToken;
}

export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  let userToken = await getUserToken(request);
  if (typeof userToken !== "string") {
    return null;
  }

  try {
    const authedUser = await getAuth().verifyIdToken(userToken);
    return authedUser;
  } catch (e) {
    console.log("getAuthUser error", e);
    return null;
  }
}

export async function getUserId(request: Request): Promise<string | null> {
  try {
    let authUser = await getAuthUser(request);
    return authUser?.uid || null;
  } catch {
    return null;
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  let userId = await getUserId(request);
  if (!userId || typeof userId !== "string") {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/sign/in?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/sign/in", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userToken: string, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userToken", userToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
