'use strict'
const prisma = require('../../config/prisma')
const { splitIntoChunks } = require('./chunking')
const { embedBatch, embedText } = require('./embeddings')
const { searchSimilarChunks } = require('./vectorStore')
const { generateAnswer } = require('./llm')

const MAX_CONTENT_LENGTH = 300_000 // ~300rb karakter, cukup longgar untuk dokumen wajar

/**
 * Ingest satu dokumen: chunking → embedding → simpan ke DB dalam satu
 * transaksi Prisma (create Document + Chunk sekaligus).
 */
async function ingestDocument({ title, content, source, userId }) {
  const trimmedTitle = (title || '').trim()
  const trimmedContent = (content || '').trim()

  if (!trimmedTitle) {
    const err = new Error('title wajib diisi')
    err.statusCode = 400
    throw err
  }
  if (!trimmedContent) {
    const err = new Error('content wajib diisi (dokumen kosong / tidak bisa dibaca)')
    err.statusCode = 400
    throw err
  }
  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    const err = new Error(`Dokumen terlalu panjang (maks ${MAX_CONTENT_LENGTH.toLocaleString()} karakter)`)
    err.statusCode = 400
    throw err
  }

  const chunks = splitIntoChunks(trimmedContent, { chunkSize: 700, overlap: 100 })
  if (chunks.length === 0) {
    const err = new Error('Tidak ada teks yang bisa diekstrak dari dokumen ini')
    err.statusCode = 400
    throw err
  }

  const embeddings = await embedBatch(chunks)

  const document = await prisma.document.create({
    data: {
      title: trimmedTitle,
      source: source || null,
      userId: userId || null,
      chunks: {
        create: chunks.map((chunkText, i) => ({
          content: chunkText,
          embedding: JSON.stringify(embeddings[i]),
          chunkIndex: i,
        })),
      },
    },
    include: { _count: { select: { chunks: true } } },
  })

  return {
    id: document.id,
    title: document.title,
    source: document.source,
    createdAt: document.createdAt,
    chunkCount: document._count.chunks,
  }
}

async function listDocuments() {
  const documents = await prisma.document.findMany({
    include: {
      _count: { select: { chunks: true } },
      user: { select: { id: true, profile: { select: { username: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return documents.map((d) => ({
    id: d.id,
    title: d.title,
    source: d.source,
    createdAt: d.createdAt,
    chunkCount: d._count.chunks,
    uploadedBy: d.user?.profile?.username ?? null,
  }))
}

async function deleteDocument(id) {
  const existing = await prisma.document.findUnique({ where: { id }, select: { id: true } })
  if (!existing) {
    const err = new Error('Dokumen tidak ditemukan')
    err.statusCode = 404
    throw err
  }
  // Chunk ikut terhapus otomatis lewat onDelete: Cascade di schema
  await prisma.document.delete({ where: { id } })
}

/**
 * Alur tanya-jawab utama: embed pertanyaan → retrieve chunk relevan →
 * generate jawaban lewat Claude → simpan log percakapan.
 */
async function ask({ question, topK = 4, userId = null }) {
  const trimmed = (question || '').trim()
  if (!trimmed) {
    const err = new Error('question wajib diisi')
    err.statusCode = 400
    throw err
  }
  if (trimmed.length > 2000) {
    const err = new Error('Pertanyaan terlalu panjang (maks 2000 karakter)')
    err.statusCode = 400
    throw err
  }

  const queryEmbedding = await embedText(trimmed)
  const relevantChunks = await searchSimilarChunks(queryEmbedding, topK)

  if (relevantChunks.length === 0) {
    return {
      answer: 'Knowledge base LIA masih kosong — belum ada dokumen yang diupload admin. Coba tanyakan lagi setelah admin menambahkan dokumen ke knowledge base.',
      sources: [],
    }
  }

  const answer = await generateAnswer(trimmed, relevantChunks)

  const chatLog = await prisma.chatLog.create({
    data: {
      question: trimmed,
      answer,
      sourceIds: JSON.stringify(relevantChunks.map((c) => c.id)),
      userId,
    },
  })

  return {
    id: chatLog.id,
    answer,
    sources: relevantChunks.map((c) => ({
      documentId: c.document?.id ?? null,
      documentTitle: c.document?.title ?? 'Tanpa judul',
      excerpt: c.content.length > 160 ? c.content.slice(0, 160) + '…' : c.content,
      score: Number(c.score.toFixed(3)),
    })),
  }
}

/**
 * Riwayat percakapan milik user yang sedang login. Guest (userId null)
 * selalu dapat array kosong — tidak ada identitas stabil untuk di-scope.
 */
async function getHistory(userId, limit = 20) {
  if (!userId) return []
  const take = Math.min(parseInt(limit, 10) || 20, 50)
  const logs = await prisma.chatLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take,
  })
  return logs.map((l) => ({
    id: l.id,
    question: l.question,
    answer: l.answer,
    createdAt: l.createdAt,
  }))
}

module.exports = { ingestDocument, listDocuments, deleteDocument, ask, getHistory }
