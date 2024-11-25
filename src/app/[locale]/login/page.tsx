import { BocalLogo } from "../ui/bocal-logo";
import { LoginForm } from "../ui/login/login-form";

export default function Page() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<BocalLogo className="text-4xl" />
			<LoginForm />
		</main>
	);
}
