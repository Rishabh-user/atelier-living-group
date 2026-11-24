import type { Metadata } from "next";
import ProjectGallery from "@/components/ProjectGallery";
import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { showroomProject, showroomProjects } from "@/content/showroom-projects";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { phone, phoneHref } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Our Work | Poggenpohl Kitchens in Atlanta",
  description:
    "Recent Poggenpohl kitchens from Atelier Living Group in Atlanta and beyond: photography and a short note on each project.",
  path: "/our-work",
  image: "/showroom/projects/rilman/2.jpg",
  imageWidth: 1800,
  imageHeight: 1200,
  imageAlt:
    "A contemporary courtyard house with a pool and a walnut-toned Poggenpohl kitchen",
});

const workLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Our Work", path: "/our-work" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": abs("/our-work"),
    name: "Our Work | Poggenpohl Kitchens in Atlanta",
    url: abs("/our-work"),
      primaryImageOfPage: abs("/showroom/projects/rilman/2.jpg"),
  },
];

export default function OurWorkPage() {
  return (
    <>
      <JsonLd data={workLd} />

      <PageBanner
        crumb="Our Work"
        title="Kitchens we have built, and the rooms they belong to."
        intro="A selection of recent Poggenpohl kitchens, each with a short note on the space and the way it was planned."
        tag="Atlanta + Tennessee"
        shots={[
          { src: "/showroom/projects/rilman/2.jpg", alt: "A contemporary courtyard house with a pool and a walnut-toned Poggenpohl kitchen" },
          { src: "/showroom/projects/w-conway/1.jpg", alt: "A dark textured Poggenpohl kitchen with a bright white island" },
          { src: "/showroom/projects/granny-white-pike/1.jpg", alt: "A bright white Poggenpohl kitchen with a timber-topped breakfast bar" },
        ]}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="/showroom">Visit the showroom</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      <section className="projects section-pad" id="projects" aria-label="Projects">
        <div className="shell">
          <div className="projects-list">
            <ProjectGallery project={showroomProject} index={0} />
            {showroomProjects.map((project, i) => (
              <ProjectGallery key={project.slug} project={project} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
