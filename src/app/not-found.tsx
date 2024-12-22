"use client";
import NextError from "next/error";

// This page renders when a route like `/unknown.txt` is requested.
// https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/not-found.tsx

export default function NotFound(): React.JSX.Element {
	return (
		<html lang="en">
			<body>
				<NextError statusCode={404} />
			</body>
		</html>
	);
}
