import Image from "next/image";

import Reveal from "@/components/Reveal";
import { team } from "@/content/team";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** "Our Team" on /about: headshot, title and a short bio for each person. */
export default function TeamSection() {
  return (
    <section className="team section-pad" id="team" aria-label="Our team">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <p className="eyebrow dark">Our Team</p>
            <h2>The people you will work with.</h2>
          </div>
        </Reveal>
        <ul className="team-grid">
          {team.map((person, i) => (
            <Reveal as="li" key={person.slug} delay={(i % 2) * 80} className="team-card">
              {person.photo ? (
                <Image
                  className="team-photo"
                  src={`/team/${person.photo}`}
                  alt={`${person.name}, ${person.title}`}
                  width={800}
                  height={1200}
                  sizes="(max-width: 700px) 60vw, 240px"
                />
              ) : (
                <div className="team-photo team-photo-empty" role="img" aria-label={`Photo of ${person.name} coming soon`}>
                  <span aria-hidden="true">{initials(person.name)}</span>
                </div>
              )}
              <div className="team-body">
                <h3>{person.name}</h3>
                <p className="team-title">{person.title}</p>
                {person.bio.map((paragraph) => (
                  <p key={paragraph} className="team-bio">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
