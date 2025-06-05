/**
 * error log of level ERROR.
 * @param err error to show.
 */
function error(...err: unknown[]): void {
	const now = new Date();
	// biome-ignore lint/suspicious/noConsole: logging.
	console.error(`[${now.toISOString()}] [ERROR]`, ...err);
}

/**
 * info log of level INFO.
 * @param msg message to show.
 */
function info(...msg: unknown[]): void {
	const now = new Date();
	// biome-ignore lint/suspicious/noConsole: logging.
	console.log(`[${now.toISOString()}] [INFO]`, ...msg);
}

/**
 * warn log of level WARN.
 * @param msg message to show.
 */
function warn(...msg: unknown[]): void {
	const now = new Date();
	// biome-ignore lint/suspicious/noConsole: logging.
	console.warn(`[${now.toISOString()}] [WARN]`, ...msg);
}

/**
 * logger contains log functions of different levels.
 */
export const logger = {
	error,
	info,
	warn,
};
