import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/lib/get-session'

export const Route = createFileRoute('/account')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    return { user: session.user }
  },
  component: AccountPage,
})

function AccountPage() {
  const { user } = Route.useRouteContext()

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-gray-100">
      <h1 className="text-3xl font-extrabold text-pink-400">My Account</h1>
      <p className="mt-4 text-gray-300">Name: {user.name}</p>
      <p className="text-gray-300">Email: {user.email}</p>
    </div>
  )
}