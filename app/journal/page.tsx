import PageShell from "../components/PageShell";
import { getJournalEntries } from "../../sanity/queries";
import JournalClient from "./JournalClient";

export const revalidate = 60;

export const metadata = { title: "Essays · minpark" };

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <PageShell eyebrow="Writing" title="Essays" wash="pink">
      <JournalClient entries={entries} />
    </PageShell>
  );
}
