'use strict'
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const service = require('./service')

// ── Upload sementara ke disk lalu dibaca & dihapus lagi (bukan penyimpanan
// permanen — file aslinya tidak perlu disimpan, cukup teksnya yang di-ingest) ──
const UPLOAD_DIR = path.join(__dirname, '../../../uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const okTypes = ['application/pdf', 'text/plain']
    if (okTypes.includes(file.mimetype)) return cb(null, true)
    cb(new Error('Hanya file PDF atau TXT yang didukung'))
  },
})

module.exports = {
  // Bungkus multer supaya errornya (file kepenuhan, tipe salah, dst) jadi
  // 400 yang jelas buat client — bukan jatuh ke 500 generik di error
  // handler global.
  uploadMiddleware: (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        err.statusCode = 400
        if (err.code === 'LIMIT_FILE_SIZE') err.message = 'Ukuran file maksimal 15MB'
        return next(err)
      }
      next()
    })
  },

  // POST /ingest/text  { title, content, source? }
  ingestText: async (req, res, next) => {
    try {
      const { title, content, source } = req.body
      const document = await service.ingestDocument({ title, content, source, userId: req.userId })
      res.status(201).json({ success: true, document })
    } catch (err) { next(err) }
  },

  // POST /ingest/file  multipart/form-data: file (+ title opsional di body)
  ingestFile: async (req, res, next) => {
    const filePath = req.file?.path
    try {
      if (!req.file) return res.status(400).json({ message: 'File wajib diupload (field "file")' })

      let content
      if (req.file.mimetype === 'application/pdf') {
        const buffer = fs.readFileSync(filePath)
        const { PDFParse } = require('pdf-parse')
        const parser = new PDFParse({ data: buffer })
        const result = await parser.getText()
        content = result.text
      } else {
        content = fs.readFileSync(filePath, 'utf-8')
      }

      const document = await service.ingestDocument({
        title: req.body.title || req.file.originalname,
        content,
        source: req.file.originalname,
        userId: req.userId,
      })

      res.status(201).json({ success: true, document })
    } catch (err) {
      next(err)
    } finally {
      // Selalu bersihkan file sementara, sukses maupun gagal
      if (filePath) fs.unlink(filePath, () => {})
    }
  },

  // GET /ingest/documents
  listDocuments: async (req, res, next) => {
    try {
      const documents = await service.listDocuments()
      res.json({ documents })
    } catch (err) { next(err) }
  },

  // DELETE /ingest/documents/:id
  deleteDocument: async (req, res, next) => {
    try {
      await service.deleteDocument(req.params.id)
      res.json({ success: true })
    } catch (err) { next(err) }
  },

  // POST /lia  { question, topK? }
  ask: async (req, res, next) => {
    try {
      const { question, topK } = req.body
      const result = await service.ask({ question, topK, userId: req.userId ?? null })
      res.json(result)
    } catch (err) { next(err) }
  },

  // GET /lia/history?limit=
  history: async (req, res, next) => {
    try {
      const logs = await service.getHistory(req.userId ?? null, req.query.limit)
      res.json({ logs })
    } catch (err) { next(err) }
  },
}
