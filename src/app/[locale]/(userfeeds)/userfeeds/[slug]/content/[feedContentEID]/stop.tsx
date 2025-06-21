import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { feedService } from "@/app/[locale]/lib/feed-service";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ feedContentEID: string }> },
) {
	const { feedContentEID } = await params;
	if (!feedContentEID) {
		return notFound();
	}

	const { content, error } = await feedService.getFeedContent(feedContentEID);
	if (error) {
		switch (error) {
			case "not-found":
				return new NextResponse("Content not found", { status: 404 });

			case "invalid-eid":
				return new NextResponse("Invalid content ID", { status: 400 });
			default:
				return new NextResponse("Error getting content", { status: 500 });
		}
	}

	if (!content) {
		return new NextResponse("Error generating feed", { status: 500 });
	}

	return new NextResponse(content, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
