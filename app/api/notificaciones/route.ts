import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, alumno, dia, hora, tipo } = await request.json();

    let asunto = '';
    let mensaje = '';

    switch (tipo) {
      case 'recordatorio_24h':
        asunto = `⏰ Recordatorio: Clase mañana con ${alumno}`;
        mensaje = `Mañana tienes clase con ${alumno} a las ${hora}. ¡Prepara tu material!`;
        break;
      case 'recordatorio_1h':
        asunto = `🔔 Clase en 1 hora con ${alumno}`;
        mensaje = `En 1 hora tienes clase con ${alumno}. Hora: ${hora}.`;
        break;
      case 'estado_cambiado':
        asunto = `📋 Clase actualizada: ${alumno}`;
        mensaje = `La clase con ${alumno} del ${dia} a las ${hora} ha cambiado de estado.`;
        break;
    }

    await resend.emails.send({
      from: 'Loomin <onboarding@resend.dev>',
      to: email,
      subject: asunto,
      text: mensaje
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 });
  }
}