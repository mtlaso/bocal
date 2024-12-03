import { auth } from "@/auth";
import { db } from "@/db/db";
import { links } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import "server-only";

export async function getLinks(): Promise<
	{
		id: number;
		url: string;
		ogTitle: string | null;
		ogImageURL: string | null;
	}[]
> {
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
				ogImageURL: links.ogImageURL,
			})
			.from(links)
			.where(and(eq(links.userId, user.user.id), eq(links.isArchived, false)));
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
