'use strict'

/**
 * Memecah teks panjang menjadi potongan (chunk) dengan overlap, supaya
 * konteks di sekitar batas potongan tidak terputus begitu saja.
 *
 * @param {string} text
 * @param {{chunkSize?: number, overlap?: number}} opts chunkSize/overlap dalam JUMLAH KATA
 * @returns {string[]}
 */
function splitIntoChunks(text, { chunkSize = 700, overlap = 100 } = {}) {
  const cleaned = (text || '').replace(/\s+/g, ' ').trim()
  if (!cleaned) return []

  const words = cleaned.split(' ')
  if (words.length <= chunkSize) return [cleaned]

  const chunks = []
  let start = 0

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length)
    chunks.push(words.slice(start, end).join(' '))

    if (end === words.length) break
    start = end - overlap // mundur sedikit untuk overlap antar-chunk
  }

  return chunks
}

module.exports = { splitIntoChunks }
