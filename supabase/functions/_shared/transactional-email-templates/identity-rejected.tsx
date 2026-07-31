import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  customerName?: string
  reason?: string
}

const Email = ({ customerName, reason }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We could not approve your ID — here is what to do next</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: 'center' as const, paddingBottom: '8px' }}>
          <Img
            src="https://everyonecanlight.co/email-logo.png"
            width="48"
            height="48"
            alt="Everyone Can Light"
            style={{ borderRadius: '12px', margin: '0 auto' }}
          />
        </Section>

        <Heading style={h1}>We could not approve your ID</Heading>
        <Text style={sub}>
          {customerName ? `Hi ${customerName}, ` : 'Hi there, '}we reviewed the government-issued ID you
          uploaded and were unable to approve it.
        </Text>

        <Section style={warnBox}>
          <Text style={warnLabel}>Reason</Text>
          <Text style={warnText}>{reason ?? 'Unapproved due to identity concerns'}</Text>
        </Section>

        <Text style={sub}>
          You can upload a clearer or valid ID on the Rent Equipment page and we will review it again.
          If you believe this is a mistake, write to everyonecanlight@gmail.com and we will look at it
          personally.
        </Text>

        <Text style={footer}>Everyone Can Light · Light Bank rentals.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'We could not approve your ID',
  displayName: 'Identity rejected',
  previewData: { customerName: 'Ada', reason: 'Unclear image upload' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '21px', margin: '8px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 16px' }
const warnBox = {
  backgroundColor: '#fffaeb',
  border: '1px solid #fedf89',
  borderRadius: '12px',
  padding: '12px 16px',
  marginBottom: '16px',
}
const warnLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#b54708',
  margin: '0',
}
const warnText = { fontSize: '14px', color: '#7a2e0e', margin: '4px 0 0', fontWeight: 700 }
const footer = { fontSize: '12px', color: '#777777', marginTop: '18px' }