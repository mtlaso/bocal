import { auth } from "@/auth";
import { db } from "@/db/db";
import { links } from "@/db/schema";
import { type SQL, and, eq } from "drizzle-orm";
import "server-only";

export async function getLinks({ archivedLinksOnly = false }): Promise<
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

		const archivedFilter: SQL[] = [];
		if (archivedLinksOnly) archivedFilter.push(eq(links.isArchived, true));
		else archivedFilter.push(eq(links.isArchived, false));

		return await db
			.select({
				id: links.id,
				url: links.url,
				ogTitle: links.ogTitle,
				ogImageURL: links.ogImageURL,
			})
			.from(links)
			.where(and(eq(links.userId, user.user.id), ...archivedFilter));
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
