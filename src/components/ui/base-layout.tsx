import { inter } from "@/app/[locale]/ui/fonts";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
						<NuqsAdapter>{children}</NuqsAdapter>
						<Toaster />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
			<Script
				defer
				data-site-id="bocal.dnncrye.dev"
				src="https://assets.onedollarstats.com/tracker.js"
			/>
		</html>
	);
}
