const express = require("express");
const { Resend } = require("resend");
const { z } = require("zod");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const ContactSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^\+?1?\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/, "Teléfono inválido"),
});

app.post("/api/contact", async (req, res) => {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "Datos inválidos.", details: parsed.error.flatten().fieldErrors });
  }

  const { name, phone } = parsed.data;
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Líneas Móviles <onboarding@resend.dev>",
      to: "danielernestoperezmartinez394@gmail.com",
      subject: `📞 Nuevo lead: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E5E7EB;border-radius:12px;">
          <h2 style="color:#2563EB;margin-bottom:16px;">📞 Nuevo Lead — Líneas Móviles</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;font-weight:700;color:#374151;width:120px;">Nombre</td>
              <td style="padding:10px 0;color:#111827;">${name}</td>
            </tr>
            <tr style="border-top:1px solid #F3F4F6;">
              <td style="padding:10px 0;font-weight:700;color:#374151;">Teléfono</td>
              <td style="padding:10px 0;"><a href="tel:${phone}" style="color:#2563EB;">${phone}</a></td>
            </tr>
            <tr style="border-top:1px solid #F3F4F6;">
              <td style="padding:10px 0;font-weight:700;color:#374151;">Fuente</td>
              <td style="padding:10px 0;color:#6B7280;">Lead magnet — ¿No puedes llamar ahora?</td>
            </tr>
          </table>
          <p style="margin-top:20px;font-size:.8rem;color:#9CA3AF;">Contactar en menos de 10 minutos.</p>
        </div>
      `,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return res.status(500).json({ error: "Error al enviar email." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
