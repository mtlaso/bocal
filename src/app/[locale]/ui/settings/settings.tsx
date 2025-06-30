import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { TbMail, TbUser } from "react-icons/tb";
import { APP_ROUTES } from "@/app/[locale]/lib/app-routes";
import { ViewSection } from "@/app/[locale]/ui/settings/view/view-section";
import { SPACING } from "@/app/[locale]/ui/spacing";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export async function Settings(): Promise<React.JSX.Element> {
	const user = await auth();
	if (!user) return redirect(APP_ROUTES.login);

	return (
		<section>
			<ProfileSection
				name={user.user.name ?? ""}
				email={user.user.email ?? ""}
			/>
			<ViewSection feedContentLimit={user.user.feedContentLimit} />
			<ExportDataSection />
			<DeleteAccountSection />
		</section>
	);
}

const ProfileSection = ({
	email,
	name,
}: {
	email: string;
	name: string;
}): React.JSX.Element => {
	const t = useTranslations("settings.profileSection");

	return (
		<section className={cn("mb-12", SPACING.LG)}>
			<h1 className="text-xl font-medium">{t("title")}</h1>

			<div className={SPACING.MD}>
				<div className={SPACING.XS}>
					<Label htmlFor="email" className="block text-sm font-medium">
						{t("email")}
					</Label>

					<div className="relative">
						<Input
							disabled
							className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
							autoFocus
							id="email"
							value={email}
						/>

						<TbMail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>

				<div className={SPACING.SM}>
					<Label htmlFor="name" className="block text-sm font-medium">
						{t("name")}
					</Label>

					<div className="relative">
						<Input
							disabled
							className="rounded-md border py-2 pl-10 outline-2 placeholder:text-gray-500"
							autoFocus
							id="name"
							value={name}
						/>

						<TbUser className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
					</div>
				</div>
			</div>
		</section>
	);
};

const ExportDataSection = (): React.JSX.Element => {
	const t = useTranslations("settings.exportDataSection");
	return (
		<section className={cn("mb-12", SPACING.LG)}>
			<div className={SPACING.XS}>
				<h1 className="text-xl font-medium">{t("title")}</h1>
				<p className="text-sm text-muted-foreground">{t("description")}</p>
			</div>

			<form className={SPACING.SM}>
				<Button disabled type="submit">
					{t("export")}
				</Button>
			</form>
		</section>
	);
};

const DeleteAccountSection = (): React.JSX.Element => {
	const t = useTranslations("settings.deleteAccountSection");

	return (
		<section className={SPACING.LG}>
			<div className={SPACING.SM}>
				<h1 className="text-xl font-medium text-destructive">{t("title")}</h1>
				<p className="text-sm text-muted-foreground">{t("description")}</p>
			</div>

			<form>
				<Button disabled variant={"destructive"} type="submit">
					{t("delete")}
				</Button>
			</form>
		</section>
	);
};
