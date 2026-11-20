import type { Metadata } from "next";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { areaGroups } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Kitchens Atlanta | Service Areas",
  description:
    "Luxury German kitchens across Atlanta, Buckhead, Midtown, Sandy Springs, Alpharetta, Marietta, Lake Oconee and selected residences across Georgia.",
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Service areas", path: "/service-areas" }])} />
      <PageBanner
        crumb="Service areas"
        title="Serving Atlanta, North Georgia and selected residences across Georgia."
        intro="Atelier Living Group works with homeowners, architects, interior designers, builders and developers seeking luxury German kitchens, custom cabinetry, premium appliances and kitchen remodeling in the Atlanta and Georgia market."
        tag="Terminus 100 Showroom, Buckhead"
        shots={[
          { src: "/products/alvolo/alvolo-11.jpg", alt: "Poggenpohl ALVOLO kitchen" },
          { src: "/products/modo/modo-07.jpg", alt: "Poggenpohl +MODO kitchen" },
          { src: "/products/taglio/taglio-09.jpg", alt: "Poggenpohl TAGLIO kitchen" },
        ]}
      />
      <section className="section-pad">
        <div className="shell areas-page">
          {areaGroups.map((group) => (
            <div key={group.label}>
              <h2>{group.label}</h2>
              <ul>
                {group.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}
