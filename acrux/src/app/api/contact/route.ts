import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, company, budget, message } = data

    // ── Resend integration (set RESEND_API_KEY in env) ──────────
    const key = process.env.RESEND_API_KEY
    if (key) {
      const html = `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111">
          <h2 style="color:#0066ff;margin-bottom:4px">New Project Inquiry</h2>
          <p style="color:#666;font-size:13px;margin-top:0">via ACRUX Studio contact form</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#888;width:120px">Name</td><td style="padding:6px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#0066ff">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#888">Company</td><td style="padding:6px 0">${company || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Budget</td><td style="padding:6px 0;font-weight:600;color:#0066ff">${budget}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
          <h3 style="margin-bottom:8px;font-size:14px">Project Details</h3>
          <p style="font-size:14px;line-height:1.7;color:#333;white-space:pre-wrap">${message}</p>
        </div>
      `

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          from: 'ACRUX Contact <contact@acrux.studio>',
          to:   ['acruxwebsitebuilding@gmail.com'],
          reply_to: email,
          subject: `New project inquiry from ${name}${company ? ` (${company})` : ''}`,
          html,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        console.error('[contact] Resend error:', err)
        return NextResponse.json({ error: 'Email failed' }, { status: 500 })
      }
    }

    // ── Fallback: log to console (works without Resend key) ─────
    console.log('[contact] New inquiry:', { name, email, company, budget, message })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
