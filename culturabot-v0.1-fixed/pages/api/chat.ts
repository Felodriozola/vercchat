
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Actuá como un curador musical experto. Respondé solo sobre música y en español.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await completion.json();
    const text = data.choices?.[0]?.message?.content || 'No encontré nada interesante.';
    const query = encodeURIComponent(prompt.split(' ').slice(-3).join(' '));
    const embed = `https://open.spotify.com/embed/search/${query}?utm_source=generator`;

    res.status(200).json({ response: text, embed });
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    res.status(500).json({ response: 'Ocurrió un error al contactar con OpenAI.', embed: null });
  }
}
