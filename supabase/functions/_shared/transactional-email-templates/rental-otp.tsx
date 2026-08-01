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
  code?: string
  minutes?: number
}

const Email = ({ code, minutes = 10 }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`${code ?? '000000'} is your Everyone Can Light verification code`}</Preview>
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

        <Heading style={h1}>Verify your email</Heading>
        <Text style={sub}>
          Enter this code on the Rent Equipment page to confirm this email address belongs to you.
        </Text>

        <Section style={codeBox}>
          <Text style={codeText}>{code ?? '000000'}</Text>
        </Section>

        <Text style={sub}>
          The code expires in {minutes} minutes. If you did not start a gear booking, you can safely
          ignore this email — nobody can use your address without this code.
        </Text>

        <Text style={footer}>Everyone Can Light · Light Bank rentals.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) => `${data?.code ?? 'Your code'} is your verification code`,
  displayName: 'Rental email verification code',
  previewData: { code: '482913', minutes: 10 },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '28px 24px', maxWidth: '560px' }
const h1 = { fontSize: '21px', margin: '8px 0 4px', color: '#111111' }
const sub = { fontSize: '14px', color: '#555555', margin: '0 0 16px' }
const codeBox = {
  border: '1px solid #e6e6e6',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  textAlign: 'center' as const,
  backgroundColor: '#f7f7f8',
}
const codeText = {
  fontSize: '30px',
  fontWeight: 700,
  letterSpacing: '8px',
  color: '#0f1a3d',
  margin: '0',
}
const footer = { fontSize: '12px', color: '#777777', marginTop: '18px' }
