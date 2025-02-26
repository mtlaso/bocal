import { LoginForm } from "../ui/auth/login-form";

export default function Page(): React.JSX.Element {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<p className="font-extrabold text-4xl">Bocal</p>
			<LoginForm />
		</main>
	);
}
