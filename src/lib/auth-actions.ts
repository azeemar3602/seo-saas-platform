"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { createOrganizationWithOwner, findUserByEmail } from "@/lib/db";

export interface FormState {
  error?: string;
}

const registerSchema = z
  .object({
    organizationName: z.string().trim().min(2, "Company/site name is too short"),
    name: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    organizationName: formData.get("organizationName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { organizationName, name, email, password } = parsed.data;

  if (findUserByEmail(email)) {
    return { error: "An account with that email already exists. Try signing in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  createOrganizationWithOwner({ organizationName, name, email, passwordHash });

  try {
    // Signing in throws a redirect (NEXT_REDIRECT) on success — let it propagate.
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error: "Account created, but automatic sign-in failed. Please sign in from the login page.",
      };
    }
    throw err;
  }
}

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Enter your email and password" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: typeof callbackUrl === "string" && callbackUrl ? callbackUrl : "/dashboard",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return { error: "Incorrect email or password" };
      }
      return { error: "Something went wrong signing you in. Try again." };
    }
    // NEXT_REDIRECT (successful sign-in) and any other thrown control-flow
    // errors must propagate, not be swallowed here.
    throw err;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
