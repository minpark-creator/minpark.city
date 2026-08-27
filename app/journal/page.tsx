import PageShell from "../components/PageShell";
import { getJournalEntries, getPageIntros } from "../../sanity/queries";
import JournalClient from "./JournalClient";

export const revalidate = 60;

export const metadata = { title: "Essays · minpark" };

export default async function JournalPage() {
  const [entries, intros] = await Promise.all([
    getJournalEntries(),
    getPageIntros(),
  ]);
  const header = intros.journal;

  return (
    <PageShell
      eyebrow={header.eyebrow}
      title={header.title}
      intro={header.intro}
      wash="pink"
    >
      <JournalClient entries={entries} />
    </PageShell>
  );
}
