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
}

const Email = ({ customerName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your identity has been approved — you can complete your rental</Preview>
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

        <Heading style={h1}>Identity approved</Heading>
        <Text style={sub}>
          {customerName ? `Hi ${customerName}, ` : 'Hi there, '}your government-issued ID has been
          reviewed and approved. You can head back to the Rent Equipment page and complete your gear
          reservation — your details are saved, so you will not need to upload an ID again.
        </Text>

        <Section style={okBox}>
          <Text style={okText}>Verified — ready to book</Text>
        </Section>

        <Text style={footer}>
          Everyone Can Light · Light Bank rentals. Questions? Write to everyonecanlight@gmail.com.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your identity has been approved',
  displayName: 'Identity approved',
  previewData: { customerName: 'Ada' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '21px', margin: '8px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 16px' }
const okBox = {
  backgroundColor: '#ecfdf3',
  border: '1px solid #abefc6',
  borderRadius: '12px',
  padding: '12px 16px',
  marginBottom: '16px',
}
const okText = { fontSize: '14px', fontWeight: 700, color: '#067647', margin: '0' }
const footer = { fontSize: '12px', color: '#777777', marginTop: '18px' }