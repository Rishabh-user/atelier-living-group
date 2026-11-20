import FilmCard from "@/components/FilmCard";
import Reveal from "@/components/Reveal";
import type { Film } from "@/content/media";

/**
 * A section of films, kept apart from the photography. The first film leads
 * at full width when `lead` is set; the rest sit in a row beneath it.
 */
export default function FilmSection({
  id,
  eyebrow = "Films",
  title,
  films,
  lead = false,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  films: Film[];
  lead?: boolean;
  tone?: "light" | "dark";
}) {
  if (!films.length) return null;
  const [first, ...rest] = films;

  return (
    <section className="films" data-tone={tone} id={id} aria-label={title}>
      <div className="shell">
        <Reveal className="ed-head">
          <p className={`eyebrow ${tone === "light" ? "dark" : ""}`}>{eyebrow}</p>
          <h2>{title}</h2>
        </Reveal>

        {lead ? (
          <>
            <Reveal>
              <FilmCard film={first} size="large" />
            </Reveal>
            {rest.length ? (
              <ul className="films-row">
                {rest.map((film) => (
                  <li key={film.id}>
                    <FilmCard film={film} />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <ul className="films-row">
            {films.map((film) => (
              <li key={film.id}>
                <FilmCard film={film} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
