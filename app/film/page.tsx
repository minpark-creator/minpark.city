import PageShell from "../components/PageShell";
import { getFilms } from "../../sanity/queries";
import FilmClient from "./FilmClient";

export const revalidate = 60;

export const metadata = { title: "Observations — minpark" };

export default async function FilmPage() {
  const films = await getFilms();
  return (
    <PageShell>
      <div className="pt-8 sm:pt-12 pb-2">
        <p className="font-display text-[12px] sm:text-[13px] lg:text-[14px] leading-[1.5]">
          A collection of moving images and observations
          <br />
          exploring how people use and inhabit public space.
        </p>
      </div>
      <FilmClient films={films} />
    </PageShell>
  );
}
