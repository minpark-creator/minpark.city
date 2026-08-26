import PageShell from "../components/PageShell";
import { getFilms } from "../../sanity/queries";
import FilmClient from "./FilmClient";

export const revalidate = 60;

export const metadata = { title: "Observations · minpark" };

export default async function FilmPage() {
  const films = await getFilms();
  return (
    <PageShell
      eyebrow="Field recordings"
      title="Observations"
      intro="A collection of moving images and observations exploring how people use and inhabit public space."
      wash="none"
    >
      <FilmClient films={films} />
    </PageShell>
  );
}
