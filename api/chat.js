import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
  }

  try {
    const { messages, message } = req.body || {}
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const history = (messages || [])
      .filter((_, idx) => idx > 0)
      .map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }))

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return res.status(200).json({ reply: text })
  } catch (error) {
    console.error('Gemini API Error:', error)
    return res.status(500).json({ error: error.message || 'Error communicating with Gemini' })
  }
}
