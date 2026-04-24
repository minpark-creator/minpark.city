import PageShell from "../components/PageShell";
import { getAboutPage } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "About — minpark" };

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <PageShell>
      <div className="grid grid-cols-12 gap-x-8 gap-y-12 pt-14">
        <div className="col-span-12 md:col-span-6 md:col-start-2">
          <p className="text-[16px] leading-[1.7] max-w-[58ch]">
            {about.bioText}
          </p>
        </div>

        <div className="col-span-12 md:col-span-10 md:col-start-2 space-y-14">
          {about.sections?.map((section, i) => (
            <div
              key={section.title + i}
              className="grid grid-cols-12 gap-x-8 pt-10 border-t border-neutral-200"
            >
              <div className="col-span-12 md:col-span-3">
                <h2 className="text-[15px] font-medium">{section.title}</h2>
              </div>
              <dl className="col-span-12 md:col-span-8 text-[15px] leading-[1.6]">
                {section.items?.map((item, j) => (
                  <div
                    key={j}
                    className="flex gap-x-6 py-2 border-b border-neutral-100 last:border-b-0"
                  >
                    <dt className="w-[120px] shrink-0 text-muted">
                      {item.year}
                    </dt>
                    <dd>{item.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
