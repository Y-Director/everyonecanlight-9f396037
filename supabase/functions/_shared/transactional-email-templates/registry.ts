import type { ComponentType } from 'npm:react@18.3.1'
import { template as bookingConfirmation } from './booking-confirmation.tsx'
import { template as adminActivity } from './admin-activity.tsx'
import { template as paymentIssue } from './payment-issue.tsx'
import { template as identityApproved } from './identity-approved.tsx'
import { template as identityRejected } from './identity-rejected.tsx'
import { template as rentalOtp } from './rental-otp.tsx'
import { template as contributorSuspended } from './contributor-suspended.tsx'
import { template as contributorReinstated } from './contributor-reinstated.tsx'

export interface TemplateEntry {
  // deno-lint-ignore no-explicit-any
  component: ComponentType<any>
  // deno-lint-ignore no-explicit-any
  subject: string | ((data: any) => string)
  displayName?: string
  // deno-lint-ignore no-explicit-any
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'booking-confirmation': bookingConfirmation,
  'admin-activity': adminActivity,
  'payment-issue': paymentIssue,
  'identity-approved': identityApproved,
  'identity-rejected': identityRejected,
  'rental-otp': rentalOtp,
  'contributor-suspended': contributorSuspended,
  'contributor-reinstated': contributorReinstated,
}