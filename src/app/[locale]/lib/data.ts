import { auth } from "@/auth";
import { db } from "@/db/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";
import "server-only";

export async function getLinks(): Promise<{ id: number; url: string, ogTitle: string | null, ogImageURL: string | null }[]> {
  try {
    const user = await auth();
    if (!user) {
      throw new Error("errors.notSignedIn");
    }

    return await db
      .select({
        id: links.id,
        url: links.url,
        ogTitle: links.ogTitle,
        ogImageURL: links.ogImageURL
      })
      .from(links)
      .where(eq(links.userId, user.user.id));
  } catch (_err) {
    throw new Error("errors.unexpected");
  }
}
