/**
 * error log de niveau ERROR.
 * @param err erreur à affcher.
 */
function error(...err: unknown[]): void {
	const now = new Date();
	// biome-ignore lint/suspicious/noConsole: logging.
	console.error(`[${now.toISOString()}] [ERROR]`, ...err);
}

/**
 * info log de niveau INFO.
 * @param msg message à afficher.
 */
function info(...msg: unknown[]): void {
	const now = new Date();
	// biome-ignore lint/suspicious/noConsole: logging.
	console.log(`[${now.toISOString()}] [INFO]`, ...msg);
}

/**
 * warn logs at level WARN.
 * @param msg message to show.
 */
function warn(...msg: unknown[]): void {
	const now = new Date();
	// biome-ignore lint/suspicious/noConsole: logging.
	console.warn(`[${now.toISOString()}] [WARN]`, ...msg);
}

/**
 * logger contient les fonctions de log de différents niveaux.
 */
export const logger = {
	error,
	info,
	warn,
};
