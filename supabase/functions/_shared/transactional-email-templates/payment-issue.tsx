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
  reference?: string
  amount?: number
}

const naira = (n?: number) => `NGN ${Number(n ?? 0).toLocaleString('en-NG')}`

const Email = ({ customerName, reference, amount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your payment — your rental needs a quick fix</Preview>
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

        <Heading style={h1}>We received your payment</Heading>
        <Text style={sub}>
          {customerName ? `Hi ${customerName}, ` : 'Hi there, '}your payment went through, but your gear
          reservation did not finish confirming on our side. Nothing is lost — our team has been alerted
          and is completing your booking manually.
        </Text>

        <Section style={card}>
          <Text style={label}>Payment reference</Text>
          <Text style={value}>{reference ?? '—'}</Text>
          <Text style={label}>Amount received</Text>
          <Text style={value}>{naira(amount)}</Text>
        </Section>

        <Text style={sub}>
          You will get your rental confirmation email as soon as it is resolved, usually within a few
          hours. If your pick-up is sooner than that, reply to this email or write to
          everyonecanlight@gmail.com with the reference above and we will prioritise it.
        </Text>

        <Text style={footer}>
          Everyone Can Light · Light Bank rentals. Please keep this email until your booking is
          confirmed.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'We received your payment — your rental is being completed',
  displayName: 'Payment received but booking incomplete',
  previewData: { customerName: 'Ada', reference: 'ECLR-1748', amount: 90000 },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '21px', margin: '8px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 16px' }
const card = {
  border: '1px solid #e6e6e6',
  borderRadius: '12px',
  padding: '10px 16px',
  marginBottom: '16px',
}
const label = {
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#8a8a8a',
  margin: '8px 0 0',
}
const value = { fontSize: '14px', color: '#111111', margin: '2px 0' }
const footer = { fontSize: '12px', color: '#777777', marginTop: '18px' }