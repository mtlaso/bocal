import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { TbLinkPlus } from "react-icons/tb";
import { lusitana } from "../ui/fonts";

export default function Page() {
  const t = useTranslations("dashboard")
  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4">
      <section className="flex gap-2">
        <h1 className={`${lusitana.className} font-semibold tracking-tight text-3xl`}>{t("links")}</h1>
        <Button variant="outline" size="icon">
          <TbLinkPlus />
        </Button>
      </section>

      <section>
        links...
      </section>

    </main>
  );
}
