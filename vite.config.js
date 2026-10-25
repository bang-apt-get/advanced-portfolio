import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

function geminiChatDevPlugin(env) {
  return {
    name: 'gemini-chat-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}')
            const { messages, message } = parsed
            const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY

            if (!apiKey) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                error: 'GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY to your .env file.'
              }))
              return
            }

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

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ reply: text }))
          } catch (err) {
            console.error('Gemini dev api error:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Error processing request' }))
          }
        })
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), geminiChatDevPlugin(env)],
  }
})
