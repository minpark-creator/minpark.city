import PageShell from "../components/PageShell";
import WorkClient from "./WorkClient";
import { getProjects } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Projects · minpark" };

export default async function WorkPage() {
  const projects = await getProjects();
  const allByDate = [...projects].sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return bd - ad;
  });

  return (
    <PageShell
      eyebrow={`${allByDate.length} projects`}
      title="Projects"
      intro="Research, planning and design, the magazine, and the things that got built. Filter by what the work produced."
      wash="blue"
    >
      <WorkClient projects={allByDate} />
    </PageShell>
  );
}
