import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    // 1. Iniciar predicción
    const respuesta = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "stability-ai/stable-diffusion-3",
        input: {
          prompt: `Educational illustration for Spanish class. Clean, colorful, minimal design. White background. ${prompt}`,
          negative_prompt: "text, words, letters, watermark, messy, dark, realistic photo",
          width: 1024, height: 768, num_outputs: 1
        }
      })
    });

    const prediction = await respuesta.json();

    // 2. Esperar a que termine
    let resultado = prediction;
    while (resultado.status !== 'succeeded' && resultado.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const check = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      });
      resultado = await check.json();
    }

    const imageUrl = resultado.output?.[0] || null;
    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error("Error generando imagen:", error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}