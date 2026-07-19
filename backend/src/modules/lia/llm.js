'use strict'
const Anthropic = require('@anthropic-ai/sdk')
const { GoogleGenAI } = require('@google/genai')
const { ANTHROPIC_API_KEY, GEMINI_API_KEY } = require('../../config/env')

const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null
const gemini = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null

const GEMINI_MODEL = 'gemini-2.5-flash'
const CLAUDE_MODEL = 'claude-sonnet-5'
const GEMINI_TIMEOUT_MS = 15_000 // "tidak merespons" = dianggap gagal setelah 15 detik, jangan bikin user nunggu tanpa batas

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

function buildUserPrompt(question, contextChunks) {
  const context = contextChunks
    .map((c, i) => `[Sumber ${i + 1} - ${c.document?.title ?? 'Tanpa judul'}]\n${c.content}`)
    .join('\n\n---\n\n')

  return `Konteks dari knowledge base:\n${context || '(kosong — tidak ada dokumen relevan ditemukan)'}\n\nPertanyaan: ${question}`
}

function withTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} tidak merespons dalam ${ms / 1000} detik`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

async function askGemini(question, contextChunks) {
  const response = await withTimeout(
    gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildUserPrompt(question, contextChunks),
      config: { systemInstruction: SYSTEM_PROMPT, maxOutputTokens: 1024 },
    }),
    GEMINI_TIMEOUT_MS,
    'Gemini'
  )

  const text = response.text
  if (!text || !text.trim()) throw new Error('Gemini mengembalikan jawaban kosong')
  return text
}

async function askClaude(question, contextChunks) {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(question, contextChunks) }],
  })

  const textBlock = message.content.find((block) => block.type === 'text')
  const text = textBlock ? textBlock.text : ''
  if (!text.trim()) throw new Error('Claude mengembalikan jawaban kosong')
  return text
}

/**
 * Gemini adalah model UTAMA (default) — lebih hemat biaya untuk RAG QA
 * bervolume tinggi. Kalau Gemini gagal (error API, timeout, atau jawaban
 * kosong) ATAU key-nya belum diisi, otomatis jatuh ke Claude sebagai
 * cadangan. Kalau keduanya tidak tersedia/gagal, baru benar-benar error.
 *
 * @param {string} question
 * @param {{content: string, document: {title: string}}[]} contextChunks
 * @returns {Promise<{answer: string, model: string}>}
 */
async function generateAnswer(question, contextChunks) {
  if (!gemini && !anthropic) {
    const err = new Error('Chatbot LIA belum dikonfigurasi di server (GEMINI_API_KEY dan ANTHROPIC_API_KEY kosong keduanya).')
    err.statusCode = 503
    throw err
  }

  if (gemini) {
    try {
      const answer = await askGemini(question, contextChunks)
      return { answer, model: 'gemini' }
    } catch (geminiErr) {
      console.error('[lia] Gemini gagal, fallback ke Claude:', geminiErr.message)
      if (!anthropic) {
        const err = new Error('LIA (Gemini) sedang bermasalah dan tidak ada model cadangan (ANTHROPIC_API_KEY kosong). Coba lagi sebentar.')
        err.statusCode = 502
        throw err
      }
      // lanjut ke Claude di bawah
    }
  }

  try {
    const answer = await askClaude(question, contextChunks)
    return { answer, model: 'claude' }
  } catch (claudeErr) {
    console.error('[lia] Claude (fallback) juga gagal:', claudeErr.message)
    const err = new Error('LIA sedang tidak bisa dihubungi (model utama maupun cadangan gagal merespons). Coba lagi sebentar.')
    err.statusCode = 502
    throw err
  }
}

module.exports = {
  generateAnswer,
  isConfigured: () => !!gemini || !!anthropic,
}
