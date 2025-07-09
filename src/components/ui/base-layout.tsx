import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { inter } from "@/app/[locale]/ui/fonts";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

type Props = {
	children: React.ReactNode;
	locale: string;
};

export default async function BaseLayout({
	children,
	locale,
}: Props): Promise<React.JSX.Element> {
	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<NextIntlClientProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange={false}
					>
						<DevIndicator />
						<NuqsAdapter>{children}</NuqsAdapter>
						<Toaster />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
			<Script defer src="https://assets.onedollarstats.com/stonks.js" />
		</html>
	);
}

function DevIndicator() {
	const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
	if (env === "development") {
		return (
			<div className="fixed bottom-5 right-[50%] translate-x-1/2 z-50 bg-red-300 dark:bg-red-900 px-8 py-2 rounded-full">
				{env}
			</div>
		);
	}
	if (env === "preview") {
		return (
			<div className="fixed bottom-5 right-[50%] translate-x-1/2 z-50 bg-green-300 dark:bg-green-900 px-8 py-2 rounded-full">
				{env}
			</div>
		);
	}

	return null;
}
