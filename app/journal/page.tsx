import PageShell from "../components/PageShell";
import { getJournalEntries } from "../../sanity/queries";
import JournalClient from "./JournalClient";

export const revalidate = 60;

export const metadata = { title: "Journal — minpark" };

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <PageShell>
      <div className="pt-14">
        <JournalClient entries={entries} />
      </div>
    </PageShell>
  );
}
