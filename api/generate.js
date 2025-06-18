export default async function handler(req, res) {
  // 🔧 Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // ✅ Respond early to preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ message: 'Missing prompt' })
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
    if (!response.ok) return res.status(response.status).json(data)

    // 🧠 Use consistent format for Electron
    res.status(200).json({ content: data.choices[0].message.content })
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
}
