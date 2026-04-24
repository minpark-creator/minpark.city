import PageShell from "../components/PageShell";
import { getContactPage } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Contact — minpark" };

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <PageShell>
      <div className="grid grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10 pt-8 sm:pt-14">
        <div className="col-span-12 md:col-span-8 md:col-start-2 pt-6 sm:pt-10">
          <p className="text-[16px] sm:text-[17px] leading-[1.7] max-w-[56ch]">
            {contact.intro}
          </p>
        </div>

        <dl className="col-span-12 md:col-span-10 md:col-start-2 text-[15px]">
          {contact.email && (
            <div className="flex gap-x-4 sm:gap-x-6 py-4 border-t border-neutral-200">
              <dt className="w-[100px] sm:w-[140px] shrink-0 text-muted font-ui text-[13px] sm:text-[14px]">Email</dt>
              <dd>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-medium hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
          )}
          {contact.location && (
            <div className="flex gap-x-4 sm:gap-x-6 py-4 border-t border-neutral-200">
              <dt className="w-[100px] sm:w-[140px] shrink-0 text-muted font-ui text-[13px] sm:text-[14px]">Location</dt>
              <dd>{contact.location}</dd>
            </div>
          )}
          {contact.links?.map((link, i) => (
            <div
              key={link.label + i}
              className="flex gap-x-6 py-4 border-t border-neutral-200"
            >
              <dt className="w-[100px] sm:w-[140px] shrink-0 text-muted font-ui text-[13px] sm:text-[14px]">{link.label}</dt>
              <dd>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {link.url.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </PageShell>
  );
}
