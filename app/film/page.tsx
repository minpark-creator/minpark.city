import PageShell from "../components/PageShell";
import { getFilms, getPageIntros } from "../../sanity/queries";
import FilmClient from "./FilmClient";

export const revalidate = 60;

export const metadata = { title: "Observations" };

export default async function FilmPage() {
  const [films, intros] = await Promise.all([getFilms(), getPageIntros()]);
  const header = intros.film;

  return (
    <PageShell
      eyebrow={header.eyebrow}
      title={header.title}
      intro={header.intro}
      wash="none"
    >
      <FilmClient films={films} />
    </PageShell>
  );
}
