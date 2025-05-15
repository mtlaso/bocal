/**
 * format returns the email a user can use to receive newsletter at.
 * A 'usermail' email address follows this structure:
 * <feed-external-id>@usermail.bocal.fyi.
 * @param feedEid External id (eid) of a feed.
 */
function format(feedEid: string): string {
	return `${feedEid}@usermail.bocal.fyi`;
}

/**
 * usermailfuncs contains functions related newsletter usermail handling.
 */
export const usermailfuncs = {
	format,
};
