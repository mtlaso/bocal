import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { feedService } from "@/app/[locale]/lib/feed-service";
import { logger } from "@/app/[locale]/lib/logging";
export async function GET(
	_request: NextRequest,
	{
		params,
	}: {
		params: Promise<{ feedContentEID: string }>;
	},
) {
	const { feedContentEID } = await params;
	if (!feedContentEID) {
		notFound();
	}

	const { content, error } = await feedService.getFeedContent(feedContentEID);
	if (error) {
		switch (error) {
			case "invalid-eid":
				return new NextResponse("invalid feed content ID", {
					status: 400,
				});
			case "not-found":
				return new NextResponse("feed content not found", {
					status: 404,
				});
			default:
				return new NextResponse("internal server error", {
					status: 500,
				});
		}
	}

	if (!content) {
		logger.error("Error fetching feed content", { feedContentEID });
		return new NextResponse("Error fetching feed content", {
			status: 500,
		});
	}

	return new Response(content, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
		},
	});
}
