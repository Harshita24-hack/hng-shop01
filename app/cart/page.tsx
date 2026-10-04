"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function CartPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }
    const { data: items } = await supabase.from("cart_items").select("*");
    const { data: prods } = await supabase.from("products").select("*");
    setRows(items ?? []);
    setProducts(prods ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function changeQty(row: any, delta: number) {
    const q = row.quantity + delta;
    if (q <= 0) await supabase.from("cart_items").delete().eq("id", row.id);
    else await supabase.from("cart_items").update({ quantity: q }).eq("id", row.id);
    load();
  }

  async function remove(row: any) {
    await supabase.from("cart_items").delete().eq("id", row.id);
    load();
  }

  const lines = rows
    .map((r) => ({
      row: r,
      product: products.find((p) => String(p.id) === r.product_id),
    }))
    .filter((l) => l.product);

  const total = lines.reduce(
    (s, l) => s + Number(l.product.price) * l.row.quantity,
    0
  );

  if (loading) return <div className="p-10 text-center text-black">Loading...</div>;

  if (!loggedIn)
    return (
      <div className="p-10 text-center text-black">
        Please{" "}
        <Link href="/login" className="underline font-bold">
          sign in
        </Link>{" "}
        to see your cart.
      </div>
    );

  if (lines.length === 0)
    return (
      <div className="p-10 text-center text-black">
        Cart is empty.{" "}
        <Link href="/" className="underline font-bold">
          Back to shop
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto text-black">
      <Link href="/" className="underline text-sm">
        ← Back to shop
      </Link>
      <h1 className="text-2xl font-bold my-6">Your Cart</h1>
      {lines.map(({ row, product }) => (
        <div key={row.id} className="flex justify-between items-center border-b py-3">
          <div>
            <div className="font-bold">{product.name}</div>
            <div className="text-sm text-gray-500">₹{product.price}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => changeQty(row, -1)} className="border rounded px-2">
              −
            </button>
            <span>{row.quantity}</span>
            <button onClick={() => changeQty(row, 1)} className="border rounded px-2">
              +
            </button>
            <button onClick={() => remove(row)} className="text-red-600 text-sm ml-2">
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="mt-6 font-bold text-xl">Total: ₹{total}</div>
    </div>
  );
}
