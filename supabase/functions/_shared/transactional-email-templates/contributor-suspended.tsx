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
  contributorName?: string
  reason?: string
}

const Email = ({ contributorName, reason }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Contributor account has been suspended — how to appeal</Preview>
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

        <Heading style={h1}>Your Contributor account has been suspended</Heading>
        <Text style={sub}>
          {contributorName ? `Hi ${contributorName}, ` : 'Hi there, '}your Everyone Can Light
          Contributor account has been suspended, so you can no longer create or edit articles and
          courses for now.
        </Text>

        {reason ? (
          <Section style={warnBox}>
            <Text style={warnLabel}>Reason</Text>
            <Text style={warnText}>{reason}</Text>
          </Section>
        ) : null}

        <Heading as="h2" style={h2}>
          How to appeal
        </Heading>
        <Text style={step}>1. Write an appeal note of up to 150 words.</Text>
        <Text style={step}>2. Read and accept the Contributor terms and conditions.</Text>
        <Text style={step}>
          3. Send it to <strong>cc@everyonecanlight.co</strong> using the header title:{' '}
          <strong>Contributor Appeal</strong>, followed by your name — for example{' '}
          <em>Contributor Appeal-John Doe</em>.
        </Text>

        <Text style={sub}>
          We review every appeal personally and will reply with a decision once we have read yours.
        </Text>

        <Text style={footer}>Everyone Can Light · Contributors.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Contributor account has been suspended',
  displayName: 'Contributor suspended',
  previewData: { contributorName: 'Ada', reason: 'Repeated guideline violations' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '21px', margin: '8px 0 4px', color: '#111111' }
const h2 = { fontSize: '15px', margin: '20px 0 8px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 16px' }
const step = { fontSize: '14px', color: '#333333', margin: '0 0 8px' }
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
