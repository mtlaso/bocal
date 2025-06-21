import type { MetadataRoute } from "next";
import { getAppBaseURL } from "@/app/[locale]/lib/get-app-base-url";
import { LINKS } from "@/app/[locale]/lib/links";
import { getPathname, type Locale, routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    getEntry("/"),
    getEntry(LINKS.dashboard),
    getEntry("/archive"),
    getEntry(LINKS.newsletter),
    getEntry("/feed"),
    getEntry(LINKS.login),
    getEntry("/settings"),
    getEntry("/legal/terms"),
    getEntry("/legal/privacy"),
  ];
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntry(href: Href): {
  url: string;
  alternates: {
    languages: {
      [k: string]: string;
    };
  };
} {
  return {
    url: getUrl(href, routing.defaultLocale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, getUrl(href, locale)]),
      ),
    },
  };
}

function getUrl(href: Href, locale: Locale): string {
  const pathname = getPathname({ locale, href });
  return getAppBaseURL() + pathname;
}
