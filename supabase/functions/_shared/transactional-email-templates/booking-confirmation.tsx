import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Column,
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
  lineTotal?: number
}

interface Props {
  customerName?: string
  bookingCode?: string
  reference?: string
  items?: GearLine[]
  days?: number
  startDate?: string
  endDate?: string
  location?: string
  callTime?: string
  total?: number
  operatorName?: string
  operatorPhone?: string
}

const naira = (n?: number) => `NGN ${Number(n ?? 0).toLocaleString('en-NG')}`

const Email = ({
  customerName,
  bookingCode,
  reference,
  items = [],
  days = 1,
  startDate,
  endDate,
  location,
  callTime,
  total,
  operatorName,
  operatorPhone,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Rental confirmed - ${bookingCode ?? reference ?? ''}`}</Preview>
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

        <Heading style={h1}>Rental confirmed</Heading>
        <Text style={sub}>
          {customerName ? `Hi ${customerName}, ` : 'Hi there, '}your booking has been confirmed and
          payment received.
        </Text>

        <Section style={codeBox}>
          <Text style={codeLabel}>Booking reference</Text>
          <Text style={codeValue}>{bookingCode ?? reference ?? '—'}</Text>
        </Section>

        <Section style={card}>
          <Row>
            <Column>
              <Text style={label}>Pick-up date</Text>
              <Text style={value}>
                {startDate ?? '—'}
                {endDate && endDate !== startDate ? ` to ${endDate}` : ''}
              </Text>
            </Column>
            <Column>
              <Text style={label}>Call time</Text>
              <Text style={value}>{callTime ?? '—'}</Text>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text style={label}>Duration</Text>
              <Text style={value}>{`${days} day${days > 1 ? 's' : ''}`}</Text>
            </Column>
            <Column>
              <Text style={label}>Location</Text>
              <Text style={value}>{location ?? '—'}</Text>
            </Column>
          </Row>
        </Section>

        <Text style={sectionTitle}>Gear list</Text>
        {items.map((i, idx) => (
          <Row key={idx} style={line}>
            <Column>
              <Text style={value}>{`${i.name ?? 'Item'} x ${i.qty ?? 1}`}</Text>
            </Column>
            <Column style={{ textAlign: 'right' as const }}>
              <Text style={value}>{naira(i.lineTotal)}</Text>
            </Column>
          </Row>
        ))}
        <Hr style={hr} />
        <Row>
          <Column>
            <Text style={totalLabel}>Total paid</Text>
          </Column>
          <Column style={{ textAlign: 'right' as const }}>
            <Text style={totalLabel}>{naira(total)}</Text>
          </Column>
        </Row>

        {operatorName && (
          <Section style={card}>
            <Text style={label}>Your Lighting Operator</Text>
            <Text style={value}>{operatorName}</Text>
            {operatorPhone && <Text style={value}>{operatorPhone}</Text>}
          </Section>
        )}

        <Text style={footer}>
          You can manage this booking on the Rent Equipment page using your booking reference and
          email address. Changes close 12 hours before your call time.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) =>
    `Rental confirmed - ${data?.bookingCode ?? data?.reference ?? 'Everyone Can Light'}`,
  displayName: 'Rental booking confirmation',
  previewData: {
    customerName: 'Ada',
    bookingCode: 'ECL-4821',
    reference: 'ECL-4821',
    items: [{ name: 'Aputure LS 600d Pro', qty: 1, lineTotal: 90000 }],
    days: 2,
    startDate: '2026-08-02',
    endDate: '2026-08-03',
    location: 'Lekki, Lagos',
    callTime: '07:00',
    total: 90000,
    operatorName: 'Adeyinka Ibidapo',
    operatorPhone: '+234 800 000 0000',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', margin: '8px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 18px' }
const codeBox = {
  backgroundColor: '#0f1a3d',
  borderRadius: '12px',
  padding: '14px 18px',
  marginBottom: '16px',
}
const codeLabel = {
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#9fb0e8',
  margin: '0',
}
const codeValue = {
  fontSize: '20px',
  letterSpacing: '3px',
  color: '#ffffff',
  margin: '4px 0 0',
  fontWeight: 700,
}
const card = {
  border: '1px solid #e6e6e6',
  borderRadius: '12px',
  padding: '14px 16px',
  marginBottom: '16px',
}
const label = {
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  color: '#8a8a8a',
  margin: '6px 0 0',
}
const value = { fontSize: '14px', color: '#111111', margin: '2px 0' }
const sectionTitle = { fontSize: '13px', fontWeight: 700, color: '#111111', margin: '4px 0' }
const line = { borderBottom: '1px solid #f0f0f0' }
const hr = { borderColor: '#e6e6e6', margin: '10px 0' }
const totalLabel = { fontSize: '15px', fontWeight: 700, color: '#111111', margin: '2px 0' }
const footer = { fontSize: '12px', color: '#777777', marginTop: '18px' }