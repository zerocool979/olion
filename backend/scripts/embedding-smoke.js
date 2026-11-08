'use strict'

const { embedText } = require('../src/modules/lia/embeddings')

async function main() {
  const embedding = await embedText('OLION adalah platform diskusi berbasis pengetahuan.')
  if (!Array.isArray(embedding) || embedding.length !== 384) {
    throw new Error(`Embedding harus memiliki 384 dimensi; diterima: ${embedding?.length ?? 'non-array'}`)
  }
  if (!embedding.every(Number.isFinite)) {
    throw new Error('Embedding mengandung nilai non-finite.')
  }

  const norm = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0))
  if (Math.abs(norm - 1) > 1e-3) {
    throw new Error(`Embedding harus ternormalisasi; L2 norm: ${norm}`)
  }

  console.log(`Embedding smoke test passed (dimensions=384, L2 norm=${norm.toFixed(6)}).`)
}

main().catch((error) => {
  console.error('Embedding smoke test failed:', error)
  process.exitCode = 1
})
