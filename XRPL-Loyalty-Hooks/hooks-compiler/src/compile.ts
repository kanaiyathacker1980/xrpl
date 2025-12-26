import * as fs from 'fs/promises'
import * as path from 'path'
import { compileHook, mockCompileHook } from './compiler'

async function main() {
  const hooksDir = path.join(__dirname, '../../hooks')
  const outputDir = path.join(__dirname, '../../compiled')

  await fs.mkdir(outputDir, { recursive: true })

  const hookFiles = await fs.readdir(hooksDir)
  const cFiles = hookFiles.filter((f) => f.endsWith('.c'))

  console.log(`🔨 Compiling ${cFiles.length} hooks...\n`)

  for (const file of cFiles) {
    const hookName = path.basename(file, '.c')
    const sourcePath = path.join(hooksDir, file)
    const sourceCode = await fs.readFile(sourcePath, 'utf-8')

    console.log(`Compiling ${hookName}...`)

    try {
      // Use mock compilation (replace with real compileHook when Docker is ready)
      const result = await mockCompileHook(sourceCode, hookName)

      // Write WASM output
      const wasmPath = path.join(outputDir, `${hookName}.wasm`)
      await fs.writeFile(wasmPath, result.wasm)

      // Write metadata
      const metaPath = path.join(outputDir, `${hookName}.json`)
      await fs.writeFile(
        metaPath,
        JSON.stringify(
          {
            name: hookName,
            hash: result.hash,
            size: result.size,
            compiled: new Date().toISOString(),
          },
          null,
          2
        )
      )

      console.log(`✅ ${hookName}: ${result.size} bytes (${result.hash.slice(0, 8)}...)\n`)
    } catch (error) {
      console.error(`❌ Failed to compile ${hookName}:`, error)
    }
  }

  console.log(`\n✨ Compilation complete! Output: ${outputDir}`)
}

main().catch(console.error)
