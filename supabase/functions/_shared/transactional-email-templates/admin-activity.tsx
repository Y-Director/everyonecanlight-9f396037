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
  title?: string
  summary?: string
  category?: string
  severity?: string
  actorEmail?: string
  occurredAt?: string
  lines?: { label?: string; value?: string }[]
}

const Email = ({ title, summary, category, severity, actorEmail, occurredAt, lines = [] }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`${severity === 'critical' ? 'Action needed: ' : ''}${title ?? 'Dashboard activity'}`}</Preview>
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

        <Text style={badge(severity)}>
          {`${(category ?? 'activity').toUpperCase()} · ${(severity ?? 'info').toUpperCase()}`}
        </Text>
        <Heading style={h1}>{title ?? 'Dashboard activity'}</Heading>
        {summary && <Text style={sub}>{summary}</Text>}

        <Section style={card}>
          {lines.map((l, i) => (
            <Section key={i}>
              <Text style={label}>{l.label ?? '—'}</Text>
              <Text style={value}>{l.value ?? '—'}</Text>
            </Section>
          ))}
          <Text style={label}>Performed by</Text>
          <Text style={value}>{actorEmail ?? 'System'}</Text>
          <Text style={label}>When</Text>
          <Text style={value}>{occurredAt ?? new Date().toISOString()}</Text>
        </Section>

        <Text style={footer}>
          You are receiving this because you are an admin on the Everyone Can Light dashboard. The full
          history is available in the dashboard under Notifications.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) =>
    `${data?.severity === 'critical' ? '[Action needed] ' : ''}${data?.title ?? 'Dashboard activity'}`,
  displayName: 'Admin activity notification',
  previewData: {
    title: 'Rental booking confirmed',
    summary: 'Ada Obi paid NGN 90,000 for a 2-day rental.',
    category: 'rentals',
    severity: 'info',
    actorEmail: 'everyonecanlight@gmail.com',
    occurredAt: '2026-05-21 09:12',
    lines: [{ label: 'Booking reference', value: 'ECL-4821' }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '20px', margin: '6px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 18px' }
const badge = (severity?: string) => ({
  fontSize: '11px',
  letterSpacing: '1px',
  fontWeight: 700,
  margin: '0',
  color: severity === 'critical' ? '#b42318' : severity === 'warning' ? '#b54708' : '#0f1a3d',
})
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