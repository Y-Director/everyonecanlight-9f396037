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
}

const Email = ({ contributorName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Contributor account is live again</Preview>
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

        <Heading style={h1}>Your Contributor account is live again</Heading>
        <Text style={sub}>
          {contributorName ? `Hi ${contributorName}, ` : 'Hi there, '}your Everyone Can Light
          Contributor account has been reinstated. You can sign in and continue creating articles
          and courses right away.
        </Text>
        <Text style={sub}>Welcome back — we are glad to have you lighting with us.</Text>
        <Text style={footer}>Everyone Can Light · Contributors.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Contributor account is live again',
  displayName: 'Contributor reinstated',
  previewData: { contributorName: 'Ada' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '21px', margin: '8px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#777777', marginTop: '18px' }
