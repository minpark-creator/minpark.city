import PageShell from "../components/PageShell";
import { getAboutPage } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "About — minpark" };

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <PageShell>
      <div className="grid grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 pt-8 sm:pt-14">
        <div className="col-span-12 md:col-span-8 md:col-start-2">
          <p className="text-[16px] sm:text-[17px] leading-[1.7] max-w-[58ch]">
            {about.bioText}
          </p>
        </div>

        <div className="col-span-12 md:col-span-10 md:col-start-2 space-y-10 sm:space-y-14">
          {about.sections?.map((section, i) => (
            <div
              key={section.title + i}
              className="grid grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-4 pt-8 sm:pt-10 border-t border-neutral-200"
            >
              <div className="col-span-12 md:col-span-3">
                <h2 className="text-[16px] font-medium">
                  {section.title}
                </h2>
              </div>
              <dl className="col-span-12 md:col-span-8 text-[15px] leading-[1.6]">
                {section.items?.map((item, j) => (
                  <div
                    key={j}
                    className="flex gap-x-4 sm:gap-x-6 py-2 border-b border-neutral-100 last:border-b-0"
                  >
                    <dt className="w-[90px] sm:w-[120px] shrink-0 text-muted text-[13px] sm:text-[14px]">
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
