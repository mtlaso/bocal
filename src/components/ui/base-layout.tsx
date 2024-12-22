import { inter } from "@/app/[locale]/ui/fonts";
import ThemeProvider from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

type Props = {
	children: React.ReactNode;
	locale: string;
};

export default async function BaseLayout({
	children,
	locale,
}: Props): Promise<React.JSX.Element> {
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${inter.className} antialiased mb-12`}>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange={false}
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
