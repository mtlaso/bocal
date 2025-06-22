import { type NextRequest, NextResponse } from "next/server";
import { feedService } from "@/app/[locale]/lib/feed-service";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
	const { slug: feedEid } = await params;

	if (!feedEid) {
		return new NextResponse("Feed ID is required", {
			status: 400,
		});
	}

	const { atom, error } = await feedService.generateUserAtomFeed(feedEid);

	if (error) {
		switch (error) {
			case "feed-not-found":
				return new NextResponse("Feed not found", { status: 404 });
			case "invalid-eid":
				return new NextResponse("Invalid feed ID", { status: 400 });
			default:
				return new NextResponse("Error generating feed", { status: 500 });
		}
	}

	if (!atom) {
		return new NextResponse("Error generating feed", { status: 500 });
	}

	return new NextResponse(atom, {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600",
		},
	});
}
