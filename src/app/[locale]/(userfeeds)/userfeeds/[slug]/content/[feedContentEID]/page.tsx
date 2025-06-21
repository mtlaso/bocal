import { notFound } from "next/navigation";
import { feedService } from "@/app/[locale]/lib/feed-service";

export default async function Page({
	params,
}: {
	params: Promise<{ feedContentEID: string }>;
}) {
	const { feedContentEID } = await params;
	if (!feedContentEID) {
		return notFound();
	}

	const { content, error } = await feedService.getFeedContent(feedContentEID);
	if (error) {
		notFound();
	}

	if (!content) {
		notFound();
	}

	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized html */}
			<span dangerouslySetInnerHTML={{ __html: content }} />
		</>
	);
}
