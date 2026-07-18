'use strict'

/**
 * Embedding lokal pakai @xenova/transformers (model all-MiniLM-L6-v2, 384
 * dimensi). Jalan di CPU, tanpa API key eksternal — cocok untuk knowledge
 * base skala kecil-menengah. Model di-load sekali (singleton) lalu dipakai
 * ulang untuk semua request berikutnya di proses yang sama.
 *
 * CATATAN: @xenova/transformers adalah paket ESM-only, makanya di-load lewat
 * dynamic import() walau file ini sendiri CommonJS (module.exports biasa) —
 * ini pola resmi yang direkomendasikan paketnya untuk dipakai dari kode CJS.
 */
let embedderPromise = null

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = import('@xenova/transformers').then(({ pipeline }) =>
      pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    )
  }
  return embedderPromise
}

/**
 * @param {string} text
 * @returns {Promise<number[]>} vector embedding (384 dimensi)
 */
async function embedText(text) {
  const embedder = await getEmbedder()
  const output = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}

/**
 * Embed banyak teks sekaligus. Dijalankan satu-satu (bukan Promise.all)
 * supaya tidak membebani CPU sekaligus untuk banyak chunk — model sudah
 * di-cache jadi overhead per panggilan kecil.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
async function embedBatch(texts) {
  const results = []
  for (const text of texts) {
    results.push(await embedText(text))
  }
  return results
}

module.exports = { embedText, embedBatch }
