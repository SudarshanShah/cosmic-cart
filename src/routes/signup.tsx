import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute("/signup")({ component: SignupPage })

function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')

    const { error } = await authClient.signUp.email({ name, email, password })

    if (error) {
      setError(error.message ?? 'Something went wrong')
      return
    }

    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-gray-100">
      <div className="mx-auto max-w-sm">
        <h1 className="text-3xl font-extrabold text-pink-400">Sign Up</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2"
            required
            minLength={8}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-500 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}