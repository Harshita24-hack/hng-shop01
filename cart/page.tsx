"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setCart(JSON.parse(saved))
    }
  }, [])

  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0)

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index)
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  if (cart.length === 0) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 underline">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-6">Your Cart ({cart.length})</h1>
      {cart.map((item, i) => (
        <div key={i} className="flex gap-4 border p-4 mb-4 rounded-xl items-center">
          <img src={item.image_url || item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <h3 className="font-bold">{item.name || item.title}</h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
            <p className="font-bold mt-1">₹{item.price}</p>
          </div>
          <button onClick={() => removeItem(i)} className="bg-black text-white px-4 py-2 rounded-full text-sm">Remove</button>
        </div>
      ))}
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between text-2xl font-bold">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-4 rounded-full mt-6 font-bold">Checkout</button>
      </div>
    </div>
  )
}
