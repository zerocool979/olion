import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'

function normalise(res) {
  return res?.data?.data ?? res?.data ?? null
}

// Menyusun peta { commentId: userVote } secara rekursif dari komentar + balasan
function extractCommentVotes(comments = []) {
  const map = {}
  for (const c of comments) {
    if (c.userVote != null) map[c.id] = c.userVote
    if (c.replies) {
      for (const r of c.replies) {
        if (r.userVote != null) map[r.id] = r.userVote
      }
    }
  }
  return map
}

export function useDiscussion(id) {
  const router = useRouter()
  const [discussion, setDiscussion] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [voteState, setVoteState] = useState(null)
  const [voteCount, setVoteCount] = useState(0)
  const [votePending, setVotePending] = useState(false)

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkPending, setBookmarkPending] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editError, setEditError] = useState('')

  const [deleting, setDeleting] = useState(false)

  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [replyTarget, setReplyTarget] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [replySubmitting, setReplySubmitting] = useState(false)

  const [commentVotes, setCommentVotes] = useState({})
  const [votingCommentId, setVotingCommentId] = useState(null)

  const [toast, setToastState] = useState(null)
  const toastTimer = useRef(null)

  const showToast = useCallback((type, msg) => {
    clearTimeout(toastTimer.current)
    setToastState({ type, msg })
    toastTimer.current = setTimeout(() => setToastState(null), 3500)
  }, [])

  useEffect(() => {
    if (!id) return
    let alive = true
    setLoading(true)
    setError('')

    api.get(`/discussions/${id}`)
      .then(res => {
        if (!alive) return
        const d = normalise(res)
        if (!d) {
          setError('Diskusi tidak ditemukan.')
          return
        }
        setDiscussion(d)
        setComments(d.comments ?? [])
        setVoteCount(d._count?.votes ?? 0)
        setVoteState(d.userVote ?? null)
        setIsBookmarked(!!d.isBookmarked)
        setCommentVotes(extractCommentVotes(d.comments ?? []))
      })
      .catch((err) => {
        if (!alive) return
        if (err.response?.status === 404) {
          setError('Diskusi tidak ditemukan.')
        } else {
          setError('Gagal memuat diskusi. Periksa koneksi kamu dan coba lagi.')
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => { alive = false }
  }, [id])

  const handleVote = useCallback(async (value) => {
    if (votePending) return
    const next = voteState === value ? null : value
    const delta = (next === null ? 0 : next) - (voteState === null ? 0 : voteState)

    setVoteState(next)
    setVoteCount(c => c + delta)
    setVotePending(true)

    try {
      await api.post('/votes', { discussionId: id, value: next ?? 0 })
      const res = await api.get(`/discussions/${id}`)
      const updated = normalise(res)
      setDiscussion(updated)
      setVoteCount(updated._count?.votes ?? 0)
      setVoteState(updated.userVote ?? null)
      setIsBookmarked(!!updated.isBookmarked)
    } catch (err) {
      setVoteState(voteState)
      setVoteCount(c => c - delta)
      if (err.response?.status === 401) {
        showToast('error', 'Kamu harus login untuk memberi vote.')
      } else {
        showToast('error', err.response?.data?.message ?? 'Gagal memberikan vote.')
      }
    } finally {
      setVotePending(false)
    }
  }, [id, voteState, votePending, showToast])

  const handleCommentVote = useCallback(async (commentId, value) => {
    if (votingCommentId) return
    const currentVote = commentVotes[commentId] || null
    const next = currentVote === value ? null : value
    const delta = (next === null ? 0 : next) - (currentVote === null ? 0 : currentVote)

    setCommentVotes(prev => ({ ...prev, [commentId]: next }))
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, _count: { votes: (c._count?.votes ?? 0) + delta } }
      }
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r =>
            r.id === commentId ? { ...r, _count: { votes: (r._count?.votes ?? 0) + delta } } : r
          )
        }
      }
      return c
    }))
    setVotingCommentId(commentId)

    try {
      await api.post('/votes', { commentId, value: next ?? 0 })
      const res = await api.get(`/discussions/${id}`)
      const d = normalise(res)
      setComments(d.comments ?? [])
      setCommentVotes(extractCommentVotes(d.comments ?? []))
    } catch (err) {
      setCommentVotes(prev => ({ ...prev, [commentId]: currentVote }))
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          return { ...c, _count: { votes: (c._count?.votes ?? 0) - delta } }
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r =>
              r.id === commentId ? { ...r, _count: { votes: (r._count?.votes ?? 0) - delta } } : r
            )
          }
        }
        return c
      }))
      if (err.response?.status === 401) {
        showToast('error', 'Kamu harus login untuk memberi vote.')
      } else {
        showToast('error', err.response?.data?.message ?? 'Gagal vote komentar.')
      }
    } finally {
      setVotingCommentId(null)
    }
  }, [commentVotes, votingCommentId, id, showToast])

  const handleComment = useCallback(async (e) => {
    e.preventDefault()
    const text = newComment.trim()
    if (!text) return
    setSubmitting(true)
    setSubmitError('')

    const tempId = `temp-${Date.now()}`
    const optimisticComment = {
      id: tempId,
      content: text,
      createdAt: new Date().toISOString(),
      user: discussion?.user ?? null,
      _optimistic: true,
    }
    setComments(prev => [...prev, optimisticComment])
    setNewComment('')

    try {
      await api.post('/comments', { discussionId: id, content: text })
      const res = await api.get(`/discussions/${id}`)
      const latest = normalise(res)
      setDiscussion(latest)
      setComments(latest.comments ?? [])
      showToast('success', 'Komentar berhasil dikirim.')
    } catch (err) {
      setComments(prev => prev.filter(c => c.id !== tempId))
      const msg = err.response?.data?.message ?? 'Gagal mengirim komentar.'
      setSubmitError(msg)
      showToast('error', msg)
      setNewComment(text)
    } finally {
      setSubmitting(false)
    }
  }, [id, newComment, discussion, showToast])

  const handleReply = useCallback(async (e) => {
    e.preventDefault()
    if (!replyTarget || !replyContent.trim()) return
    setReplySubmitting(true)

    const tempId = `temp-reply-${Date.now()}`
    const optimisticReply = {
      id: tempId,
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
      user: discussion?.user ?? null,
      _optimistic: true,
    }
    setComments(prev => prev.map(c => {
      if (c.id === replyTarget.commentId) {
        return { ...c, replies: [...(c.replies || []), optimisticReply] }
      }
      return c
    }))
    setReplyContent('')
    setReplyTarget(null)

    try {
      await api.post('/comments', {
        discussionId: id,
        content: optimisticReply.content,
        parentId: replyTarget.commentId,
      })
      const res = await api.get(`/discussions/${id}`)
      const d = normalise(res)
      setComments(d.comments ?? [])
      showToast('success', 'Balasan terkirim.')
    } catch (err) {
      setComments(prev => prev.map(c => {
        if (c.id === replyTarget.commentId) {
          return { ...c, replies: (c.replies || []).filter(r => r.id !== tempId) }
        }
        return c
      }))
      showToast('error', err.response?.data?.message ?? 'Gagal mengirim balasan.')
      setReplyContent(optimisticReply.content)
    } finally {
      setReplySubmitting(false)
    }
  }, [replyTarget, replyContent, id, discussion, showToast])

  const handleCopyLink = useCallback(() => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('success', 'Link diskusi disalin.')
    }).catch(() => {
      showToast('error', 'Gagal menyalin link.')
    })
  }, [showToast])

  // ── Share (Web Share API di mobile, fallback salin link) ──────────────────
  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return
    const shareData = {
      title: discussion?.title ?? 'Diskusi OLION',
      url: window.location.href,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // AbortError = user membatalkan share sheet, jangan tampilkan error
        if (err?.name !== 'AbortError') handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }, [discussion, handleCopyLink])

  // ── Bookmark toggle (optimistic) ───────────────────────────────────────────
  const handleToggleBookmark = useCallback(async () => {
    if (bookmarkPending || !id) return
    const next = !isBookmarked
    setIsBookmarked(next)
    setBookmarkPending(true)

    try {
      if (next) {
        await api.post(`/discussions/${id}/bookmark`)
        showToast('success', 'Diskusi disimpan ke bookmark.')
      } else {
        await api.delete(`/discussions/${id}/bookmark`)
        showToast('success', 'Bookmark dihapus.')
      }
    } catch (err) {
      setIsBookmarked(!next)
      if (err.response?.status === 401) {
        showToast('error', 'Kamu harus login untuk menyimpan bookmark.')
      } else {
        showToast('error', err.response?.data?.message ?? 'Gagal memperbarui bookmark.')
      }
    } finally {
      setBookmarkPending(false)
    }
  }, [id, isBookmarked, bookmarkPending, showToast])

  // ── Edit diskusi (hanya pemilik / staff) ───────────────────────────────────
  const startEdit = useCallback(() => {
    if (!discussion) return
    setEditTitle(discussion.title)
    setEditContent(discussion.content)
    setEditError('')
    setIsEditing(true)
  }, [discussion])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditError('')
  }, [])

  const handleSaveEdit = useCallback(async (e) => {
    e?.preventDefault?.()
    if (!editTitle.trim() || !editContent.trim()) {
      setEditError('Judul dan isi diskusi tidak boleh kosong.')
      return
    }
    setEditSubmitting(true)
    setEditError('')

    try {
      const res = await api.patch(`/discussions/${id}`, {
        title: editTitle.trim(),
        content: editContent.trim(),
      })
      const updated = normalise(res)
      setDiscussion(prev => ({ ...prev, ...updated }))
      setIsEditing(false)
      showToast('success', 'Diskusi berhasil diperbarui.')
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Gagal menyimpan perubahan.'
      setEditError(msg)
      showToast('error', msg)
    } finally {
      setEditSubmitting(false)
    }
  }, [id, editTitle, editContent, showToast])

  // ── Delete diskusi ──────────────────────────────────────────────────────────
  const handleDeleteDiscussion = useCallback(async () => {
    if (deleting) return
    setDeleting(true)
    try {
      await api.delete(`/discussions/${id}`)
      showToast('success', 'Diskusi berhasil dihapus.')
      setTimeout(() => router.push('/user/discussions'), 700)
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Gagal menghapus diskusi.'
      showToast('error', msg)
      setDeleting(false)
    }
  }, [id, deleting, router, showToast])

  // ── Edit komentar (hanya pemilik) ──────────────────────────────────────────
  const handleUpdateComment = useCallback(async (commentId, content) => {
    if (!content.trim()) return { ok: false, message: 'Komentar tidak boleh kosong.' }
    try {
      await api.patch(`/comments/${commentId}`, { content: content.trim() })
      setComments(prev => prev.map(c => {
        if (c.id === commentId) return { ...c, content: content.trim() }
        if (c.replies) {
          return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, content: content.trim() } : r) }
        }
        return c
      }))
      showToast('success', 'Komentar diperbarui.')
      return { ok: true }
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Gagal memperbarui komentar.'
      showToast('error', msg)
      return { ok: false, message: msg }
    }
  }, [showToast])

  // ── Delete komentar (hanya pemilik / staff) ─────────────────────────────────
  const handleDeleteComment = useCallback(async (commentId) => {
    const prevComments = comments
    setComments(prev => prev
      .filter(c => c.id !== commentId)
      .map(c => c.replies ? { ...c, replies: c.replies.filter(r => r.id !== commentId) } : c)
    )
    try {
      await api.delete(`/comments/${commentId}`)
      showToast('success', 'Komentar dihapus.')
      setDiscussion(prev => prev ? { ...prev, _count: { ...prev._count, comments: Math.max(0, (prev._count?.comments ?? 1) - 1) } } : prev)
    } catch (err) {
      setComments(prevComments)
      showToast('error', err.response?.data?.message ?? 'Gagal menghapus komentar.')
    }
  }, [comments, showToast])

  return {
    discussion,
    comments,
    loading,
    error,
    voteState,
    voteCount,
    votePending,
    isBookmarked,
    bookmarkPending,
    handleToggleBookmark,
    isEditing,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editSubmitting,
    editError,
    startEdit,
    cancelEdit,
    handleSaveEdit,
    deleting,
    handleDeleteDiscussion,
    handleUpdateComment,
    handleDeleteComment,
    newComment,
    setNewComment,
    submitting,
    submitError,
    toast,
    replyTarget,
    setReplyTarget,
    replyContent,
    setReplyContent,
    replySubmitting,
    commentVotes,
    votingCommentId,
    handleReply,
    handleCommentVote,
    handleVote,
    handleComment,
    handleCopyLink,
    handleShare,
  }
}



