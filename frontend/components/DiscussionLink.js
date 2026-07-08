import { useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from '../context/AuthContext'

export default function DiscussionLink({ id, children, ...props }) {
  const { token } = useContext(AuthContext)
  const href = token ? `/user/discussions/${id}` : `/discussion/${id}`

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}



