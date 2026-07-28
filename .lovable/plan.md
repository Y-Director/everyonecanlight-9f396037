# Manage Booking

Lets a customer look up a paid booking with their booking code + email, see a live countdown to pick-up, and — when there's still time — add or swap gear and pay only the difference. Paid gear can never be removed.

## Design direction

Follows the "Split management view" prototype you picked: dark slate cards, blue accent, left column = booking status + notice, right column = gear bag with locked (padlock) rows and editable new rows, footer showing Paid vs Balance Due.

## 1. Lookup

- "Manage Booking" button on the Rent Equipment page header, next to Gear List.
- Dialog with two fields: Booking Reference / Booking Code and Email. Both required, matched together server-side.
- Errors are generic ("We couldn't find a booking with those details") so codes can't be probed.

## 2. Booking status card

Shows: reference + booking code, status badge, pick-up date, call time, location, full gear list with quantities, total paid, and the assigned Lighting Operator (avatar, name, phone).

Live countdown ticking every second, phrased in hours as you asked — "3 hours before pick-up" — and switching to days + hours when further out.

Modify Gear List button state, based on time until pick-up:

```text
> 24h        Modify enabled
24h -> 12h   Modify enabled  ("Changes close in Xh")
< 12h        Disabled, explained: "Changes close 12 hours before pick-up.
             Call your Lighting Operator for urgent additions."
after pickup Disabled, booking shown as past
```

## 3. Amendment mode

Entering it returns the user to the catalog with a pinned banner: "Editing booking ECL-XXXX — you can add or upgrade gear, but paid items can't be removed."

In the gear bag:
- Paid items render as locked rows: padlock icon, "Paid" tag, no remove button, no minus stepper. Quantity can be increased (the extra units become an addition).
- Each locked row has a Swap action: pick a replacement from the same category at equal or higher day rate; the difference is charged. Downgrades are blocked with a short explanation.
- New additions sit in their own block below with normal steppers, freely removable until paid.
- Dates, location and call time stay locked to the original booking so the additions price on the same rental days.

Footer: Already paid ₦X · Additional due ₦Y · **Pay difference** → Paystack. Nothing is committed to the booking until that payment verifies.

## 4. Technical notes

- New edge function `rental-lookup`: validates code + email, returns a sanitised booking (no internal IDs), including operator details only when status is paid.
- New edge function `rental-amend-initialize`: recomputes prices from the server-side rate table, rejects removals/downgrades and any request inside the 12h window, stores the pending amendment, and returns a Paystack URL for the difference only.
- `rental-verify` extended to apply a verified amendment onto the reservation's items and total, and to record the top-up.
- Database: an `amendments` jsonb column plus `amount_paid` on `rental_reservations`, so the paid baseline and each amendment are auditable; original `items` are preserved as the locked set.
- Countdown computed from `start_date` + `call_time`; the 12h cutoff is enforced server-side too, not just in the UI.
- Booking confirmation summary JPG regenerates after a successful amendment so the customer's card reflects the new gear.

## Out of scope

No cancellations, refunds, date changes, or removals — by design.
