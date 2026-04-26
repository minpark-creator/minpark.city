import PageShell from "../components/PageShell";
import { getFilms } from "../../sanity/queries";
import FilmClient from "./FilmClient";

export const revalidate = 60;

export const metadata = { title: "Public Life Observations — minpark" };

export default async function FilmPage() {
  const films = await getFilms();
  return (
    <PageShell>
      <div className="pt-8 sm:pt-12 pb-2 max-w-[58ch]">
        <p className="text-[16px] sm:text-[17px] leading-[1.7]">
          A collection of moving images and observations exploring how people use and inhabit public space.
        </p>
      </div>
      <FilmClient films={films} />
    </PageShell>
  );
}
