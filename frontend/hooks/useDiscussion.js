import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../lib/api'

function normalise(res) {
  return res?.data?.data ?? res?.data ?? null
}

export function useDiscussion(id) {
  const [discussion, setDiscussion] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [voteState, setVoteState] = useState(null)
  const [voteCount, setVoteCount] = useState(0)
  const [votePending, setVotePending] = useState(false)

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
      })
      .catch(() => {
        if (alive) setError('Gagal memuat diskusi.')
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
    } catch (err) {
      setVoteState(voteState)
      setVoteCount(c => c - delta)
      showToast('error', err.response?.data?.message ?? 'Gagal memberikan vote.')
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
      showToast('error', err.response?.data?.message ?? 'Gagal vote komentar.')
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

  return {
    discussion,
    comments,
    loading,
    error,
    voteState,
    voteCount,
    votePending,
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
  }
}



