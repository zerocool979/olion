const prisma = require('../../config/prisma')

const PARTICIPANT_SELECT = {
  user: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } },
}

module.exports = {
  // GET /chat/conversations
  listConversations: async (req, res, next) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { participants: { some: { userId: req.userId } } },
        include: {
          participants: { select: PARTICIPANT_SELECT },
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
      })
      return res.status(200).json({ data: conversations })
    } catch (err) {
      next(err)
    }
  },

  // POST /chat/conversations  { userId }
  startConversation: async (req, res, next) => {
    try {
      const { userId: otherId } = req.body
      if (!otherId) return res.status(400).json({ message: 'userId harus diisi' })
      if (otherId === req.userId) return res.status(400).json({ message: 'Tidak bisa chat dengan diri sendiri' })

      const otherExists = await prisma.user.findUnique({ where: { id: otherId }, select: { id: true } })
      if (!otherExists) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })

      // FIX: sebelumnya "cek dulu baru buat" (findFirst lalu create) — antara
      // dua langkah itu ada celah race condition (dua klik "Chat" nyaris
      // bersamaan bisa lolos jadi 2 conversation berbeda untuk pasangan
      // orang yang sama). pairKey + upsert menjamin atomik di level database:
      // walau dua request datang bersamaan, cuma satu yang akan berhasil
      // "create", yang satunya otomatis dapat conversation yang sama.
      const pairKey = [req.userId, otherId].sort().join(':')

      const conversation = await prisma.conversation.upsert({
        where: { pairKey },
        update: {}, // sudah ada — tidak perlu ubah apa pun, tinggal dipakai
        create: {
          pairKey,
          participants: {
            create: [{ userId: req.userId }, { userId: otherId }],
          },
        },
        include: { participants: { select: PARTICIPANT_SELECT } },
      })

      return res.status(200).json({ conversation })
    } catch (err) {
      next(err)
    }
  },

  // GET /chat/conversations/:id/messages
  listMessages: async (req, res, next) => {
    try {
      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: req.params.id, userId: req.userId } },
      })
      if (!participant) return res.status(403).json({ message: 'Bukan bagian dari percakapan ini' })

      const messages = await prisma.message.findMany({
        where: { conversationId: req.params.id },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } } },
      })

      return res.status(200).json({ data: messages })
    } catch (err) {
      next(err)
    }
  },

  // POST /chat/conversations/:id/messages  { content }
  sendMessage: async (req, res, next) => {
    try {
      const { content } = req.body
      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Pesan tidak boleh kosong' })
      }

      const participant = await prisma.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId: req.params.id, userId: req.userId } },
      })
      if (!participant) return res.status(403).json({ message: 'Bukan bagian dari percakapan ini' })

      const message = await prisma.message.create({
        data: {
          content: content.trim(),
          conversationId: req.params.id,
          senderId: req.userId,
        },
        include: { sender: { select: { id: true, profile: { select: { username: true, avatarUrl: true, avatarBorder: true } } } } },
      })

      await prisma.conversation.update({
        where: { id: req.params.id },
        data: { updatedAt: new Date() },
      })

      return res.status(201).json({ message })
    } catch (err) {
      next(err)
    }
  },
}



