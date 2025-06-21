import { notFound } from "next/navigation";
import { feedService } from "@/app/[locale]/lib/feed-service";

export default async function Page({
	params,
}: {
	params: Promise<{ feedContentEID: string }>;
}) {
	const { feedContentEID } = await params;
	if (!feedContentEID) {
		notFound();
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
			<span
				className="prose prose-invert mx-auto"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized html
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</>
	);
}
