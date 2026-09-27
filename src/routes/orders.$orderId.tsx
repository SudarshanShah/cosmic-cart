import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getOrderById } from '#/functions/orders'

export const Route = createFileRoute('/orders/$orderId')({
  loader: async ({ params }) => {
    try {
      return await getOrderById({ data: params.orderId })
    } catch {
      throw notFound()
    }
  },
  component: OrderConfirmation,
})

function OrderConfirmation() {
  const order = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-gray-100">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold text-green-400">Order Confirmed! 🎉</h1>
        <p className="mt-2 text-gray-400">Order #{order.id.slice(0, 8)}</p>

        <div className="mt-8 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between rounded-lg border border-gray-800 bg-gray-900 p-4">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-400">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-pink-400">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-gray-800 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>

        <Link to="/comics" className="mt-8 inline-block text-purple-400 hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  )
}