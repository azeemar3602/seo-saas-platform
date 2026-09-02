"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { registerAction, type FormState } from "@/lib/auth-actions";

const initialState: FormState = {};

const fieldClass =
  "w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your 14-day free trial — no card required"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="organizationName" className="text-xs font-medium text-muted block mb-1.5">
            Company or site name
          </label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            required
            placeholder="Acme Digital"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="name" className="text-xs font-medium text-muted block mb-1.5">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Doe"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs font-medium text-muted block mb-1.5">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@acme.com"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-medium text-muted block mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-xs font-medium text-muted block mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={fieldClass}
          />
        </div>

        {state.error ? (
          <p className="text-xs text-danger bg-danger-soft rounded-lg px-3 py-2">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
