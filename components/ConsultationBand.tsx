import Image from "next/image";
import InquiryForm from "@/components/InquiryForm";
import { phone, phoneHref } from "@/content/site";

const DEFAULT_IMAGE = "/consultation/begin-with-the-space.jpg";
const DEFAULT_ALT =
  "A Poggenpohl island in warm stone beneath white curtains, in a house of brick and timber";

/** Closing conversion band, shared by every inner page. */
export default function ConsultationBand({
  eyebrow = "Private Consultation",
  title = "Begin with the space, not the product.",
  copy = "Tell us about the residence, the architecture and the way you want to live. Atelier Living Group will guide the first conversation and prepare the right kitchen design, cabinetry, remodeling or design-build path.",
  image = DEFAULT_IMAGE,
  imageAlt,
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="consultation" id="consultation">
      <div className="consultation-image">
        <Image
          src={image}
          alt={imageAlt ?? (image === DEFAULT_IMAGE ? DEFAULT_ALT : "Poggenpohl kitchen")}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="consultation-panel">
        <p className="eyebrow dark">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
        <InquiryForm
          variant="consultation"
          className="mt-9"
          ariaLabel="Private consultation request"
        />
        <p className="contact-note">
          Temporary direct line: <a href={phoneHref}>{phone}</a>
        </p>
      </div>
    </section>
  );
}
