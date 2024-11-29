import { auth } from "@/auth";
import { db } from "@/db/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";
import "server-only";

export async function getLinks(): Promise<{ id: number; url: string }[]> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		return await db
			.select({
				id: links.id,
				url: links.url,
			})
			.from(links)
			.where(eq(links.userId, user.user.id));
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
