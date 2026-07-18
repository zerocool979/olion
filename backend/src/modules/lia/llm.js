'use strict'
const Anthropic = require('@anthropic-ai/sdk')
const { ANTHROPIC_API_KEY } = require('../../config/env')

const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null

const SYSTEM_PROMPT = `Kamu adalah LIA, asisten chatbot knowledge base untuk OLION — forum diskusi
tempat pengguna bertanya, berbagi wawasan, dan berdiskusi.

ATURAN KETAT:
1. Jawab pertanyaan HANYA berdasarkan konteks yang diberikan di bawah. Jangan
   pernah menambahkan informasi dari pengetahuan umummu di luar konteks itu.
2. Kalau jawabannya tidak ada di konteks (atau konteksnya kosong), katakan
   dengan jujur dan sopan bahwa informasi tersebut belum tersedia di
   knowledge base OLION — JANGAN mengarang jawaban apa pun.
3. Jawab singkat, jelas, dan ramah. Gunakan bahasa yang sama dengan
   pertanyaan pengguna (Indonesia atau Inggris).
4. Jangan mengklaim dirimu manusia. Kamu boleh menyebut dirimu "LIA".`

/**
 * @param {string} question
 * @param {{content: string, document: {title: string}}[]} contextChunks
 * @returns {Promise<string>}
 */
async function generateAnswer(question, contextChunks) {
  if (!anthropic) {
    const err = new Error('Chatbot LIA belum dikonfigurasi di server (ANTHROPIC_API_KEY kosong).')
    err.statusCode = 503
    throw err
  }

  const context = contextChunks
    .map((c, i) => `[Sumber ${i + 1} - ${c.document?.title ?? 'Tanpa judul'}]\n${c.content}`)
    .join('\n\n---\n\n')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Konteks dari knowledge base:\n${context || '(kosong — tidak ada dokumen relevan ditemukan)'}\n\nPertanyaan: ${question}`,
      },
    ],
  })

  const textBlock = message.content.find((block) => block.type === 'text')
  return textBlock ? textBlock.text : ''
}

module.exports = { generateAnswer, isConfigured: () => !!anthropic }
