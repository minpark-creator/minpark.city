import PageShell from "../components/PageShell";
import { getFilms } from "../../sanity/queries";
import FilmClient from "./FilmClient";

export const revalidate = 60;

export const metadata = { title: "Public Life Observations — minpark" };

export default async function FilmPage() {
  const films = await getFilms();
  return (
    <PageShell>
      <FilmClient films={films} />
    </PageShell>
  );
}
