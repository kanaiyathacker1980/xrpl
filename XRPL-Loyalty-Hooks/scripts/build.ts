/**
 * Build script for compiling XRPL Hooks and deploying to testnet
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const HOOKS_DIR = path.join(__dirname, '../hooks')
const COMPILED_DIR = path.join(__dirname, '../compiled')

async function buildAll() {
  console.log('🔨 Building XRPL Loyalty Hooks...\n')

  // Ensure compiled directory exists
  if (!fs.existsSync(COMPILED_DIR)) {
    fs.mkdirSync(COMPILED_DIR, { recursive: true })
  }

  // Compile hooks
  console.log('📦 Compiling hooks to WASM...')
  execSync('npm run compile:hooks', { stdio: 'inherit' })

  // List compiled files
  const files = fs.readdirSync(COMPILED_DIR)
  console.log('\n✅ Compiled files:')
  files.forEach((file) => {
    const stats = fs.statSync(path.join(COMPILED_DIR, file))
    console.log(`   ${file} (${stats.size} bytes)`)
  })

  console.log('\n✨ Build complete!')
  console.log('\nNext steps:')
  console.log('1. Start development servers: npm run dev')
  console.log('2. Open business dashboard: http://localhost:3001')
  console.log('3. Deploy hooks via onboarding flow')
}

buildAll().catch((error) => {
  console.error('❌ Build failed:', error)
  process.exit(1)
})
