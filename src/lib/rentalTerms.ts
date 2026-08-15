import termsPdf from "@/assets/docs/rental-terms.pdf.asset.json";

/** Perks (free props + a Lighting Operator on set) unlock at this subtotal. */
export const PERK_THRESHOLD = 60000;
export const qualifiesForPerks = (total: number) => (total ?? 0) >= PERK_THRESHOLD;

/** Props given out free once the rental qualifies; extras are paid for. */
export const FREE_PROP_LIMIT = 3;

export const TERMS_PDF_URL = termsPdf.url;

export type TermsSection = { title: string; body: string };

export const RENTAL_TERMS: TermsSection[] = [
  {
    title: "Pick-up and return times",
    body:
      "The earliest pick-up time is 5:30 AM and the latest return time is 11:00 PM. Any return made after 11:00 PM, or a pick-up outside these hours, is charged as an additional rental day.",
  },
  {
    title: "Lighting Operators",
    body:
      "Lighting Operators follow the equipment to set to ensure its safety. They have the right to disagree with the Renter where the safety of the lighting equipment is not guaranteed on set. Lighting Operators do not work as gaffers or grips on your set — they only monitor the equipment. For gaffer services, reach out to us at hello@everyonecanlight.co.",
  },
  {
    title: "Refunds and swaps",
    body:
      "Bookings are non-refundable. Equipment can, however, be swapped up to 12 hours before your pick-up time.",
  },
  {
    title: "Pick-up and return responsibility",
    body: "Renters are responsible for the pick-up and the return of the equipment.",
  },
  {
    title: "Damage or loss",
    body:
      "Damage or loss of equipment will firstly be investigated. If the Renter is found responsible, the Renter shall bear the responsibility of the cost of repair or replacement.",
  },
  {
    title: "Substitution of equipment or parts",
    body:
      "Rented equipment, or any of its parts, must not be exchanged or replaced without the knowledge of Everyone Can Light Technologies Ltd.",
  },
  {
    title: "Inspection",
    body:
      "Equipment is thoroughly inspected before it is rented out and again after it is returned. If any damage is suspected, an investigation takes place and the party responsible will be held.",
  },
];