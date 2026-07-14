'use strict'
const prisma = require('../config/prisma')

// Sama persis dengan aturan validasi username di user/controller.js updateProfile
// (huruf/angka/underscore, 3-30 karakter) — supaya @mention hanya cocok ke
// username yang benar-benar mungkin ada.
const MENTION_REGEX = /@([a-zA-Z0-9_]{3,30})/g

/**
 * Cari @username di dalam teks, lalu buat notifikasi MENTION untuk tiap
 * pengguna valid yang disebut (kecuali menyebut diri sendiri, dan tanpa
 * duplikat notifikasi untuk username yang sama disebut berkali-kali).
 * Dipanggil fire-and-forget — tidak boleh menggagalkan aksi utama (create
 * diskusi/komentar) kalau notifikasi gagal dibuat.
 */
async function notifyMentions({ text, actorId, discussionId = null, commentId = null }) {
  try {
    if (!text) return
    const usernames = [...new Set([...text.matchAll(MENTION_REGEX)].map(m => m[1]))]
    if (usernames.length === 0) return

    const profiles = await prisma.profile.findMany({
      where: { username: { in: usernames } },
      select: { userId: true },
    })

    const targetIds = [...new Set(profiles.map(p => p.userId))].filter(id => id !== actorId)
    if (targetIds.length === 0) return

    await prisma.notification.createMany({
      data: targetIds.map(userId => ({
        userId,
        actorId,
        type: 'MENTION',
        discussionId,
        commentId,
        message: commentId
          ? 'menyebut kamu dalam sebuah komentar'
          : 'menyebut kamu dalam sebuah diskusi',
      })),
      skipDuplicates: true,
    })
  } catch (err) {
    console.error('[mentions] gagal membuat notifikasi mention:', err.message)
  }
}

module.exports = { notifyMentions, MENTION_REGEX }
