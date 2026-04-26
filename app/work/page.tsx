import PageShell from "../components/PageShell";
import WorkClient from "./WorkClient";
import { getProjects } from "../../sanity/queries";

export const revalidate = 60;

export const metadata = { title: "Work — minpark" };

export default async function WorkPage() {
  const projects = await getProjects();
  const allByDate = [...projects].sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return bd - ad;
  });

  return (
    <PageShell>
      <div className="pt-8 sm:pt-12">
        <div className="flex items-baseline justify-between py-4">
          <h1 className="text-[16px] font-medium">All projects by date</h1>
          <span className="text-muted text-[14px]">
            {allByDate.length} projects
          </span>
        </div>
        <WorkClient projects={allByDate} />
      </div>
    </PageShell>
  );
}
