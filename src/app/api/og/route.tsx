import { cookies } from "next/headers";
import { ImageResponse } from "next/og";

const LOCALES = new Set(["en", "fr"]);
const TEXTS = {
	en: {
		title: "Bocal",
		description:
			"Save interesting articles and never miss updates from your favorite RSS feeds.",
	},
	fr: {
		title: "Bocal",
		description:
			"Sauvegardez des articles intéressants et ne manquez jamais les mises à jour de vos flux RSS.",
	},
} as const;

export async function GET(): Promise<ImageResponse> {
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
	const locale =
		cookieLocale && LOCALES.has(cookieLocale) ? cookieLocale : "en";

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
				padding: "40px",
				fontSize: 60,
				letterSpacing: -2,
				fontWeight: 700,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					border: "2px solid #eaeaea",
					borderRadius: "24px",
					padding: "60px",
					background: "#fafafa",
					gap: "24px",
				}}
			>
				<div style={{ fontSize: "120px" }}>🏺</div>
				<h1
					style={{
						fontSize: "72px",
						fontWeight: "bold",
						margin: "0",
						background: "linear-gradient(to right, #00619E, #1C92F0)",
						backgroundClip: "text",
						color: "transparent",
					}}
				>
					{TEXTS[locale as keyof typeof TEXTS].title}
				</h1>
				<p
					style={{
						fontSize: "32px",
						color: "#666",
						textAlign: "center",
						maxWidth: "800px",
						margin: "0",
					}}
				>
					{TEXTS[locale as keyof typeof TEXTS].description}
				</p>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	);
}
