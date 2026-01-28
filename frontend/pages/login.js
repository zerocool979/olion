import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/AuthContext'
import api from '../lib/api'

export default function Login() {
  const { login } = useContext(AuthContext)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async () => {
    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token)
      router.push('/')
    } catch {
      alert('Login gagal')
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <input className="border p-2 w-full" placeholder="Email"
        onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)} />
      <button className="bg-black text-white p-2 w-full" onClick={submit}>
        Login
      </button>
    </div>
  )
}
