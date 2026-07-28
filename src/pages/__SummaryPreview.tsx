import BookingSummaryDialog from "@/components/rental/BookingSummaryDialog";
const r = {
  reference: "ecl_x", booking_code: "ECL7K2M9", contact_name: "Tunde A.",
  contact_email: "tunde@example.com",
  items: [
    { name: "Aputure LS 600d Pro", qty: 2, price: 60000, lineTotal: 240000 },
    { name: "C-Stand Heavy Duty 10.5 ft", qty: 3, price: 7000, lineTotal: 42000 },
    { name: "4x4 ft Scrim Frame – Full Diffusion", qty: 1, price: 12000, lineTotal: 24000 },
  ],
  days: 2, start_date: "2026-08-04", end_date: "2026-08-05",
  location: "Lagos Island", call_time: "06:30", total: 306000,
  runners: { name: "Adeyinka Ibidapo", phone: "+234 803 000 1122", avatar_url: null },
  rental_customers: null,
};
export default function P() {
  return <div className="min-h-screen bg-background"><BookingSummaryDialog reservation={r} open onOpenChange={() => {}} /></div>;
}
