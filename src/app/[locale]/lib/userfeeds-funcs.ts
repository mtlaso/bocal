/**
 * NEWSLETTER_URL_PREFIX is the URL prefix of a newsletter.
 */
const NEWSLETTER_URL_PREFIX = "https://bocal.fyi/userfeeds/";

/**
 * USERMAIL_DOMAIN is the domain part of the address a user needs to use to receive newsletters.
 */
const USERMAIL_DOMAIN = "bocalusermail.fyi";

/**
 * formatsUsermail returns the email a user can use to receive newsletters at.
 * A 'usermail' email address follows this structure:
 * <feed-external-id>@bocalusermail.fyi.
 * @param feedEid External id (eid) of a feed.
 */
function formatUsermail(feedEid: string): string {
	return `${feedEid}@${USERMAIL_DOMAIN}`;
}

/**
 * formatFeedURL returns the formatted newsletter feed url based on the environment.
 * @param url URL of the newsletter feed.
 */
function formatFeedURL(url: string): string {
	const secondPart = url.split(userfeedsfuncs.NEWSLETTER_URL_PREFIX);
	let finalurl = url;

	switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
		case "development":
			if (secondPart.length > 1) {
				finalurl = `http://localhost:3000/userfeeds/${secondPart[1]}`;
			}
			break;

		case "preview":
			if (secondPart.length > 1) {
				finalurl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/${secondPart[1]}`;
			}
			break;

		default:
			finalurl = url;
	}

	return finalurl;
}

/**
 * userfeedsfuncs contains functions related to newsletters handling.
 */
export const userfeedsfuncs = {
	formatUsermail,
	formatFeedURL,
	NEWSLETTER_URL_PREFIX,
} as const;
