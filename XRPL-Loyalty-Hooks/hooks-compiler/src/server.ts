import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { compileHook } from './compiler'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

app.post('/compile', upload.single('hook'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const hookCode = req.file.buffer.toString('utf-8')
    const result = await compileHook(hookCode, req.body.hookName || 'hook')

    res.json({
      success: true,
      wasm: result.wasm.toString('base64'),
      hash: result.hash,
      size: result.size,
    })
  } catch (error) {
    console.error('Compilation error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Compilation failed',
    })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'hooks-compiler' })
})

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`🔨 Hooks Compiler Service running on port ${PORT}`)
  console.log(`   POST /compile - Compile C hook to WASM`)
  console.log(`   GET  /health  - Health check`)
})
