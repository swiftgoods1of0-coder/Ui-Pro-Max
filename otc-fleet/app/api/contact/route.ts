import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, company, email, phone, fleetSize, service, location, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    // In production, this would send an email via a service like Resend, SendGrid, etc.
    // For now, log the submission and return success
    console.log('Contact form submission:', {
      name,
      company,
      email,
      phone,
      fleetSize,
      service,
      location,
      message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Integrate with email service
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'website@otcfleet.com',
    //   to: 'info@otcfleet.com',
    //   subject: `Fleet Inquiry from ${name} at ${company}`,
    //   html: `...`,
    // })

    return NextResponse.json(
      { success: true, message: 'Your message has been received. We will contact you within one business day.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request. Please try again or call us directly.' },
      { status: 500 }
    )
  }
}
