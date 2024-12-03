import { LoginForm } from "../ui/auth/login-form";
import { BocalLogo } from "../ui/bocal-logo";

export default function Page(): React.JSX.Element {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<BocalLogo className="text-4xl" />
			<LoginForm />
		</main>
	);
}
