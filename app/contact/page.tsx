import PageShell from "../components/PageShell";
import { getContactPage } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Contact — minpark" };

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <PageShell>
      <div className="pt-10 sm:pt-14 lg:pt-16 pb-16 max-w-[820px]">
        <p className="text-[16px] sm:text-[17px] leading-[1.7] max-w-[56ch]">
          {contact.intro}
        </p>

        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="block mt-10 sm:mt-14 tracking-[-0.01em] text-[34px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1.1] hover:opacity-70 transition-opacity duration-500 ease-out no-underline hover:no-underline"
          >
            {contact.email}
          </a>
        )}
      </div>
    </PageShell>
  );
}
