"use client"
import { useEffect, useState } from "react"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
  }, [])

  const total = cart.reduce((sum: number, item: any) => sum + Number(item.price), 0)

  if (cart.length === 0) return <div className="p-10 text-center">Cart is empty</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({cart.length})</h1>
      {cart.map((item: any, i: number) => (
        <div key={i} className="flex justify-between border-b py-3">
          <span>{item.title || item.name}</span>
          <span>₹{item.price}</span>
        </div>
      ))}
      <div className="mt-6 font-bold text-xl">Total: ₹{total}</div>
    </div>
  )
}
