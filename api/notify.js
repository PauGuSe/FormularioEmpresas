export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cliente, nombre, email, transcripcion } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'OptitechIA <onboarding@resend.dev>',
        to: ['contacto@optitechia.cl'],
        subject: `📋 Nuevo diagnóstico — ${cliente}${nombre ? ' · ' + nombre : ''}`,
        text: transcripcion,
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 700px; margin: 0 auto; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0;">

            <!-- Header -->
            <div style="background: #0d1b4b; padding: 28px 32px;">
              <p style="color: #06b6d4; margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: .12em; font-weight: 600;">OptitechIA · Diagnóstico Digital</p>
              <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">Nuevo diagnóstico recibido</h1>
            </div>

            <!-- Info cliente -->
            <div style="background: #f5f8fc; padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 7px 0; color: #9ca3af; font-size: 12px; width: 130px; text-transform: uppercase; letter-spacing: .05em;">Cliente</td>
                  <td style="padding: 7px 0; color: #0d1b4b; font-weight: 700; font-size: 15px;">${cliente}</td>
                </tr>
                ${nombre ? `
                <tr>
                  <td style="padding: 7px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: .05em;">Contacto</td>
                  <td style="padding: 7px 0; color: #374151; font-size: 14px;">${nombre}</td>
                </tr>` : ''}
                ${email ? `
                <tr>
                  <td style="padding: 7px 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: .05em;">Email</td>
                  <td style="padding: 7px 0; color: #374151; font-size: 14px;">${email}</td>
                </tr>` : ''}
              </table>
            </div>

            <!-- Transcripción -->
            <div style="background: #ffffff; padding: 28px 32px;">
              <p style="color: #0d1b4b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 14px;">Transcripción completa</p>
              <div style="background: #f5f8fc; border-radius: 8px; padding: 20px; border: 1px solid #e2e8f0;">
                <pre style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.75; color: #374151; white-space: pre-wrap; margin: 0; word-break: break-word;">${transcripcion}</pre>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f5f8fc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">OptitechIA · Diagnóstico Digital Automatizado · contacto@optitechia.cl</p>
            </div>

          </div>
        `
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(JSON.stringify(err));
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error Resend:', error);
    return res.status(500).json({ error: error.message });
  }
}
