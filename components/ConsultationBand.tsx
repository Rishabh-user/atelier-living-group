import InquiryForm from "@/components/InquiryForm";
import { images, phone, phoneHref } from "@/content/site";

/** Closing conversion band, shared by every inner page. */
export default function ConsultationBand({
  eyebrow = "Private Consultation",
  title = "Begin with the space, not the product.",
  copy = "Tell us about the residence, the architecture and the way you want to live. Atelier Living Group will guide the first conversation and prepare the right kitchen design, cabinetry, remodeling or design-build path.",
  image = images.plan,
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
  image?: string;
}) {
  return (
    <section className="consultation" id="consultation">
      <div className="consultation-image">
        <img
          src={image}
          alt="Luxury kitchen planning consultation for custom cabinetry and premium remodeling in Atlanta"
          loading="lazy"
          decoding="async"
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
