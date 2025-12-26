import Docker from 'dockerode'
import * as crypto from 'crypto'
import * as fs from 'fs/promises'
import * as path from 'path'

const docker = new Docker()

export interface CompileResult {
  wasm: Buffer
  hash: string
  size: number
}

export async function compileHook(
  hookCode: string,
  hookName: string
): Promise<CompileResult> {
  const tempDir = path.join('/tmp', `hook-${Date.now()}`)
  await fs.mkdir(tempDir, { recursive: true })

  const sourceFile = path.join(tempDir, `${hookName}.c`)
  const wasmFile = path.join(tempDir, `${hookName}.wasm`)

  try {
    // Write source code to temp file
    await fs.writeFile(sourceFile, hookCode)

    // Use WASI SDK Docker container to compile C to WASM
    const container = await docker.createContainer({
      Image: 'wasi-sdk:latest',
      Cmd: [
        'clang',
        '--target=wasm32-wasi',
        '-O3',
        '-nostdlib',
        '-Wl,--no-entry',
        '-Wl,--export-all',
        '-o',
        `${hookName}.wasm`,
        `${hookName}.c`,
      ],
      HostConfig: {
        Binds: [`${tempDir}:/workspace`],
      },
      WorkingDir: '/workspace',
    })

    await container.start()
    await container.wait()
    await container.remove()

    // Read compiled WASM
    const wasm = await fs.readFile(wasmFile)
    const hash = crypto.createHash('sha256').update(wasm).digest('hex')

    return {
      wasm,
      hash,
      size: wasm.length,
    }
  } finally {
    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}

// Fallback: mock compilation for development without Docker
export async function mockCompileHook(
  hookCode: string,
  hookName: string
): Promise<CompileResult> {
  // Generate mock WASM (not real, just for development)
  const mockWasm = Buffer.from(
    `Mock WASM for ${hookName}\n${hookCode.substring(0, 100)}`
  )
  const hash = crypto.createHash('sha256').update(mockWasm).digest('hex')

  console.log(`[MOCK] Compiled ${hookName} (${mockWasm.length} bytes)`)

  return {
    wasm: mockWasm,
    hash,
    size: mockWasm.length,
  }
}
