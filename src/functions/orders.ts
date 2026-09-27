import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { db } from '#/db/client'
import { cartItems, comics, games, orderItems, orders, toys } from '#/db/schema'
import { requireAuth } from '#/lib/get-session'

const tableFor = { comic: comics, game: games, toy: toys } as const
type ItemType = keyof typeof tableFor

export const placeOrder = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await requireAuth()

  // using transaction so that all either succeeds, or in case of failure, every write to db is rolled back, so no partial persists.
  return await db.transaction(async (tx) => {
    const cart = await tx.select().from(cartItems).where(eq(cartItems.userId, session.user.id))

    if (cart.length === 0) {
      throw new Error('Cart is empty')
    }

    // Look up current product details for each cart row (price, title) to snapshot into the order
    const enrichedItems = await Promise.all(
      cart.map(async (row) => {
        const table = tableFor[row.itemType as ItemType]
        const [product] = await tx.select().from(table).where(eq(table.id, row.itemId))
        return { ...row, title: product?.title ?? 'Unknown item', price: product?.price ?? 0 }
      }),
    )

    const total = enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const orderId = crypto.randomUUID()

    await tx.insert(orders).values({ id: orderId, userId: session.user.id, total })

    await tx.insert(orderItems).values(
      enrichedItems.map((item) => ({
        id: crypto.randomUUID(),
        orderId,
        itemType: item.itemType,
        itemId: item.itemId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    )

    await tx.delete(cartItems).where(eq(cartItems.userId, session.user.id))

    return { orderId, total }
  })
})

export const getOrderById = createServerFn()
  .validator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const session = await requireAuth()

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))

    if (!order) {
      throw new Error('Order not found')
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))

    return { ...order, items }
  })