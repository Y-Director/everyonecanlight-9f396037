# Nigerian ID auto-verification + email OTP for rentals

Two additions to the Rent Equipment identity step: an AI check that reads Nigerian government IDs and decides automatically, and an email OTP gate before any other field can be filled.

## 1. Email verification (OTP) before the details step

New flow on the "Confirm your identity" step:

1. Customer types their email. Inline UX help as they type:
   - Typo detection on the domain (gmial.com, gmai.com, yahho.com, hotmial.com, outlok.com, .con/.cm/.comm, missing dot, double @) with a one-tap "Did you mean you@gmail.com?" fix chip.
   - Live states: invalid format, valid-but-unverified, verified (green check + lock icon).
2. "Send code" button emails a 6-digit code. Six-box code input appears with a 10-minute countdown and "Resend code" (60s cooldown).
3. Name, phone, ID type and upload stay locked/greyed until the code is confirmed — the existing "returning customer" lookup only runs after verification, so prefill can no longer be triggered by guessing someone else's email.
4. Changing the email after verification resets it to unverified.

Backend: the `rental_otps` table already exists and is unused. Two new actions in the `rental-kyc` function — `otp-send` (hash + store code, rate limit to 5 per email per hour, 10-minute expiry) and `otp-verify` (constant-time compare, max 5 attempts, single use). A new `rental-otp` email template is added to the transactional registry and the function deployed. Downstream actions (`check`, `status`, `submit`) require a valid, recently verified email so the OTP cannot be bypassed by calling the API directly.

## 2. Automatic Nigerian ID verification

Supported documents: **International Passport**, **National Driver's Licence**, **NIN Slip / NIN Card**.

When a first-time customer submits, the uploaded image is sent to a vision model (Lovable AI) which extracts, per document type:

- Document type actually seen in the image (must match the type the customer selected)
- Surname / given names as printed
- Expiry date (passport "Date of Expiry", licence "EXP") — NIN slips carry no expiry
- NIN / licence number / passport number
- Whether a portrait photo is present and the image is legible
- Whether it looks like a screenshot of a screen, an obvious template/sample, or a non-ID image

Decision rules applied on the server (not by the model):

| Check | Result |
|---|---|
| Name on ID matches typed full name (order-insensitive, ignores middle names, accepts small spelling distance) | required |
| Passport / licence expiry is after the last rental day | required — expired = reject |
| Document type matches selected type | required |
| Portrait present, text legible | required |
| Marked as sample/template/screenshot or not an ID | reject |

Outcome (fully automatic, as chosen):
- All checks pass -> `kyc_status = verified`, customer proceeds to payment immediately, "identity approved" email sent.
- Any hard failure -> `kyc_status = rejected` with a specific reason ("Name on ID does not match", "ID expired on 07 Aug 2024", "Document is a Driver's Licence, not a Passport", "Image unreadable"), rejection email sent, existing 5-minute re-upload cooldown applies.
- Model unavailable / low confidence -> falls back to `pending` for admin review, as today.

Admins keep full override in the Identity tab; each decision is written to the activity log with the extracted fields and the reason, and admins can flip any automatic verdict.

## Technical notes

- New column set on `rental_customers`: `id_extracted` (jsonb — parsed fields), `auto_decision` (text), `auto_confidence` (numeric), `id_expiry_date` (date), `email_verified_at` (timestamptz).
- Vision call uses `google/gemini-3.6-flash` via the Lovable AI Gateway inside `rental-kyc`, with a strict JSON schema; the image is read from the private `kyc-ids` bucket via a short-lived signed URL, never exposed to the client.
- Name matching: normalise case/diacritics/punctuation, compare token sets, allow Levenshtein distance ≤ 1 per token to tolerate minor typos.
- Expiry compared against booking end date rather than today, so an ID expiring mid-rental is rejected.
- Phone stays Nigeria-first (+234) as it is today.
- Files touched: `supabase/functions/rental-kyc/index.ts`, new `supabase/functions/_shared/idVerify.ts` and `_shared/emailHygiene.ts`, new `_shared/transactional-email-templates/rental-otp.tsx` + registry, `src/pages/RentEquipment.tsx`, plus a small `src/components/rental/EmailVerifyField.tsx`.
- No ID images or OTP codes are logged; codes are stored hashed.
