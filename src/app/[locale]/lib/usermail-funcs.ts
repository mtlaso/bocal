/**
 * NEWSLETTER_URL_PREFIX is the URL prefix of a newsletter.
 */
const NEWSLETTER_URL_PREFIX = "https://bocal.fyi/userfeeds/";

/**
 * USERMAIL_DOMAIN is the domain part of the address a user needs to use to receive newsletters.
 */
const USERMAIL_DOMAIN = "usermail.bocal.fyi";

/**
 * format returns the email a user can use to receive newsletter at.
 * A 'usermail' email address follows this structure:
 * <feed-external-id>@usermail.bocal.fyi.
 * @param feedEid External id (eid) of a feed.
 */
function format(feedEid: string): string {
	return `${feedEid}@${USERMAIL_DOMAIN}`;
}

/**
 * usermailfuncs contains functions related to newsletter usermail handling.
 */
export const usermailfuncs = {
	format,
	NEWSLETTER_URL_PREFIX,
} as const;
