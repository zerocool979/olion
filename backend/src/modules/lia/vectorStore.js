'use strict'
const prisma = require('../../config/prisma')

function cosineSimilarity(a, b) {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Cari top-K chunk paling relevan terhadap query embedding.
 *
 * Brute-force (scan semua chunk) — cukup untuk knowledge base sampai
 * puluhan-ribu chunk di JS. Kalau nanti tumbuh jauh lebih besar, ganti
 * fungsi ini untuk pakai vector index dedicated (mis. ekstensi pgvector di
 * Postgres) tanpa perlu mengubah endpoint yang memanggilnya.
 *
 * @param {number[]} queryEmbedding
 * @param {number} topK
 */
async function searchSimilarChunks(queryEmbedding, topK = 4) {
  const allChunks = await prisma.chunk.findMany({
    include: { document: { select: { id: true, title: true, source: true } } },
  })

  if (allChunks.length === 0) return []

  const scored = allChunks.map((chunk) => {
    let embedding
    try {
      embedding = JSON.parse(chunk.embedding)
    } catch {
      embedding = []
    }
    return { ...chunk, score: cosineSimilarity(queryEmbedding, embedding) }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, topK)
}

module.exports = { searchSimilarChunks, cosineSimilarity }
