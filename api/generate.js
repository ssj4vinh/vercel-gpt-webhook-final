export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Missing prompt' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a musculoskeletal radiologist assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.status(200).send(data.choices[0].message.content);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
