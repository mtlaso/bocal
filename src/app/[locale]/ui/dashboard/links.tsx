import { Card, CardContent } from "@/components/ui/card";
import { getLinks } from "../../lib/data";
export async function Links(): Promise<React.JSX.Element> {
  const links = await getLinks();

  return (
    <section>
      <ul className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
        {links.map((item) => (
          <li key={item.id} className="grid grid-rows-subgrid row-span-1">
            <Card className="w-[350px ">
              <CardContent>
                <div>
                  <p>{new URL(item.url).host}</p>
                  <p>{item.ogTitle}</p>
                  <p>{item.ogImageURL}</p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
