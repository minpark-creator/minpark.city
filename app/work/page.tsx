import PageShell from "../components/PageShell";
import WorkClient from "./WorkClient";
import { getPageIntros, getProjects } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Projects · minpark" };

export default async function WorkPage() {
  const [projects, intros] = await Promise.all([
    getProjects(),
    getPageIntros(),
  ]);
  const allByDate = [...projects].sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return bd - ad;
  });

  const header = intros.work;

  return (
    <PageShell
      // No eyebrow typed in Studio: fall back to the live count.
      eyebrow={header.eyebrow || `${allByDate.length} projects`}
      title={header.title}
      intro={header.intro}
      wash="blue"
    >
      <WorkClient projects={allByDate} />
    </PageShell>
  );
}
