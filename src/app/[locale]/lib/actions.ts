"use server";

import { auth, signIn } from "@/auth";
import { db } from "@/db/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type AddLinkState = {
  errors?: {
    link?: string[];
  };
  message?: string | null;
};

export async function authenticate(provider: string) {
  try {
    await signIn(provider, { redirectTo: "/login" });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return "error.CredentialsSignin";
        case "OAuthSignInError":
          return "error.OAuthSignInError";
        case "OAuthCallbackError":
          return "error.OAuthCallbackError";
        case "InvalidCallbackUrl":
          return "error.InvalidCallbackUrl";
        case "CallbackRouteError":
          return "error.CallbackRouteError";
        default:
          return "error.default";
      }
    }

    throw err;
  }
}

const addLinkSchema = z.object({
  link: z.string({}).url({
    message: "errors.linkFieldInvalid",
  }),
});

export async function addLink(_currState: AddLinkState, formData: FormData) {
  const validatedFields = addLinkSchema.safeParse({
    link: formData.get("link"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "errors.missingFields",
    };
  }

  try {
    const user = await auth();
    if (!user) {
      throw new Error("not logged in!");
    }

    const res = await db.execute("SELECT version()");
    console.log(res);
  } catch (_err) {
    console.log(_err);
    return {
      message: "errors.unexpectedError",
    };
  }

  revalidatePath("/dashboard/invoices");

  return {};
}
