import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface GearLine {
  name?: string
  qty?: number
}

interface Props {
  customerName?: string
  bookingCode?: string
  items?: GearLine[]
  returnedAt?: string
}

const firstName = (n?: string) => (n ? String(n).trim().split(/\s+/)[0] : '')

const Email = ({ customerName, bookingCode, items = [], returnedAt }: Props) => {
  const name = firstName(customerName)
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`Thank you${name ? `, ${name}` : ''} — your gear is safely back at Light House`}</Preview>
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

          <Section style={hero}>
            <Text style={heroKicker}>Return confirmed</Text>
            <Heading style={heroTitle}>Thank you for lighting with us{name ? `, ${name}` : ''}.</Heading>
            <Text style={heroText}>
              Your gear is safely back at the Light House. Your rental is now complete.
            </Text>
          </Section>

          <Text style={body}>
            Every great frame starts with someone who cares about light, and we're grateful you
            trusted us to be part of your production. We hope the shoot went beautifully and that
            the lights helped you tell your story exactly the way you imagined.
          </Text>
          <Text style={body}>
            Thank you for handling the equipment with care and returning it on time. It means the
            next creator gets to shine too.
          </Text>

          <Section style={card}>
            <Row>
              <Column>
                <Text style={label}>Booking reference</Text>
                <Text style={value}>{bookingCode ?? '—'}</Text>
              </Column>
              <Column style={{ textAlign: 'right' as const }}>
                <Text style={label}>Returned</Text>
                <Text style={value}>{returnedAt ?? '—'}</Text>
              </Column>
            </Row>
            {items.length > 0 && (
              <>
                <Hr style={hr} />
                <Text style={label}>Gear returned</Text>
                {items.map((i, idx) => (
                  <Text key={idx} style={itemLine}>{`${i.name ?? 'Item'} × ${i.qty ?? 1}`}</Text>
                ))}
              </>
            )}
          </Section>

          <Text style={body}>
            We'd love to light your next project too. Whenever you're ready, your gear list is
            waiting.
          </Text>

          <Section style={{ textAlign: 'center' as const, margin: '20px 0' }}>
            <Button href="https://everyonecanlight.co/light-house" style={button}>
              Visit Light House
            </Button>
          </Section>

          <Text style={signoff}>With gratitude,{'\n'}The Everyone Can Light team</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Props) =>
    `Thank you${data?.customerName ? `, ${firstName(data.customerName)}` : ''} — your rental is complete`,
  displayName: 'Rental returned thank-you',
  previewData: {
    customerName: 'Ada Obi',
    bookingCode: 'ECL-4821',
    items: [{ name: 'Amaran Ray 360c', qty: 1 }],
    returnedAt: '1 Oct 2026',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const hero = {
  backgroundColor: '#0f1a3d',
  borderRadius: '16px',
  padding: '28px 24px',
  margin: '8px 0 22px',
  textAlign: 'center' as const,
}
const heroKicker = {
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#9fb0e8',
  margin: '0 0 8px',
}
const heroTitle = { fontSize: '24px', lineHeight: '1.3', color: '#ffffff', margin: '0 0 10px' }
const heroText = { fontSize: '14px', color: '#d6def7', margin: '0' }
const body = { fontSize: '15px', lineHeight: '1.6', color: '#333333', margin: '0 0 14px' }
const card = {
  border: '1px solid #e6e6e6',
  borderRadius: '12px',
  padding: '14px 16px',
  margin: '8px 0 18px',
}
const label = {
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#8a8a8a',
  margin: '0 0 2px',
}
const value = { fontSize: '14px', color: '#111111', margin: '0 0 6px', fontWeight: 600 }
const itemLine = { fontSize: '14px', color: '#333333', margin: '2px 0' }
const hr = { borderColor: '#eeeeee', margin: '10px 0' }
const button = {
  backgroundColor: '#1f5bff',
  color: '#ffffff',
  borderRadius: '10px',
  padding: '12px 22px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
}
const signoff = { fontSize: '14px', color: '#555555', whiteSpace: 'pre-line' as const, marginTop: '18px' }
