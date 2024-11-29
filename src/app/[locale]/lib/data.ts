import { auth } from "@/auth";
import "server-only";

export async function getLinks(): Promise<void> {
	try {
		const user = await auth();
		if (!user) {
			throw new Error("errors.notSignedIn");
		}
	} catch (_err) {
		throw new Error("errors.unexpected");
	}
}
