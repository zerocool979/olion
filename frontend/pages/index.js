import api from '../lib/api'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DiscussionCard from '../components/DiscussionCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'
import {
  Hero,
  Stats,
  Features,
  About,
  TrendingTopics,
  HowItWorks,
  Community,
  CTASection,
  Footer,
} from '../components/landing'

export default function Home() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    discussions: 0,
    users: 0,
    experts: 0,
    moderators: 0,
    categories: 0,
    protection: '99%',
  })
  const [topics, setTopics] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discussionRes, statsRes, trendingRes] = await Promise.all([
          api.get('/discussions'),
          api.get('/stats'),
          api.get('/trending?period=7d&limit=15'),
        ])
        const trendingTopics = trendingRes.data.data.map((item) => ({
          label: item.category?.name || 'General',
          heat: item.hot ? 'hot' : 'warm',
        }))
        setDiscussions(discussionRes.data.data)
        setStats(statsRes.data.data)
        setTopics(trendingTopics)
      } catch (err) {
        setError('Gagal memuat diskusi')
        console.error('Error fetching discussions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content">

        <Hero />
        <Stats stats={stats} />
        <Features />
        <About />
        <TrendingTopics topics={topics} />
        <HowItWorks />
        <Community stats={stats} />

        <hr className="section-separator" />

        <main className="page-main">
          <div className="section-header">
            <div>
              <h2 className="section-header__title">Diskusi Terbaru</h2>
              <p className="section-header__count">
                {loading ? '…' : `${discussions.length} diskusi`}
              </p>
            </div>
            <Link href="/user/create" className="btn-ghost">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Baru
            </Link>
          </div>

          {error && <div className="error-banner animate-fade-in">{error}</div>}

          {loading && (
            <div className="discussion-list">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && discussions.length === 0 && !error && (
            <EmptyState
              message="Belum ada diskusi. Jadilah yang pertama!"
              actionLabel="Buat Diskusi Pertama"
              actionHref="/user/create"
            />
          )}

          {!loading && discussions.length > 0 && (
            <div className="discussion-list">
              {discussions.map((discussion, index) => (
                <DiscussionCard key={discussion.id} discussion={discussion} index={index} />
              ))}
            </div>
          )}
        </main>

        <CTASection />
        <Footer />

      </div>
    </div>
  )
}



