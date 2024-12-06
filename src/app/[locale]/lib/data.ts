import { sortOptions } from "@/app/[locale]/lib/schema";
import { auth } from "@/auth";
import { db } from "@/db/db";
import { links } from "@/db/schema";
import { type SQL, and, asc, desc, eq } from "drizzle-orm";
import "server-only";

type GetLinksOptions = {
	archivedLinksOnly?: boolean;
	sort?: string;
};

type GetLinksResponse = {
	id: number;
	url: string;
	ogTitle: string | null;
	ogImageURL: string | null;
};

export async function getLinks({
	archivedLinksOnly,
	sort,
}: GetLinksOptions): Promise<GetLinksResponse[]> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}

		const archivedFilter: SQL[] = [];
		if (archivedLinksOnly) archivedFilter.push(eq(links.isArchived, true));
		else archivedFilter.push(eq(links.isArchived, false));

		const sortFilter: SQL[] = [];
		if (sort === sortOptions["by-date-asc"])
			sortFilter.push(asc(links.createdAt));
		else sortFilter.push(desc(links.createdAt));

		return await db
			.select({
				id: links.id,
				url: links.url,
				ogTitle: links.ogTitle,
				ogImageURL: links.ogImageURL,
			})
			.from(links)
			.where(and(eq(links.userId, user.user.id), ...archivedFilter))
			.orderBy(...sortFilter);
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
