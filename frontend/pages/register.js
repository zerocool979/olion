import api from '../lib/api'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Register() {
  const { login } = useContext(AuthContext)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    const res = await api.post('/auth/register', {
      email: e.target.email.value,
      password: e.target.password.value
    })
    login(res.data.token)
    router.push('/dashboard')
  }

  return (
    <form onSubmit={submit} className="p-8 max-w-sm mx-auto">
      <input name="email" placeholder="Email" className="border w-full mb-2" />
      <input name="password" type="password" placeholder="Password" className="border w-full mb-2" />
      <button className="bg-black text-white px-4 py-2 w-full">Register</button>
    </form>
  )
}
