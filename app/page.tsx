"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  async function loadCount() {
    const { data } = await supabase.from("cart_items").select("quantity");
    setCount((data ?? []).reduce((s: number, r: any) => s + r.quantity, 0));
  }

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => {
      if (data) setProducts(data);
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadCount();
    });
  }, []);

  async function addToCart(p: any) {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const pid = String(p.id);
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("product_id", pid)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({ product_id: pid, quantity: 1 });
    }
    loadCount();
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setCount(0);
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-black">
      <nav className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight text-black">
            HNG-SHOP<span className="text-blue-600">.</span>
          </h1>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={logout} className="text-sm font-bold underline text-black">
                Log out
              </button>
            ) : (
              <Link href="/login" className="text-sm font-bold underline text-black">
                Sign in
              </Link>
            )}
            <Link href="/cart">
              <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold">
                Cart ({count})
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-[#111]">Trending Products</h2>
        <p className="text-[#666] font-medium mt-1 mb-8">
          Fresh drops from Supabase • Live database
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-black/[0.04]"
            >
              <div className="h-72 bg-[#f0f0f0] overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-black text-[18px] text-black tracking-tight">{p.name}</h3>
                <p className="text-[14px] text-[#666] mt-1 font-medium">{p.description}</p>
                <div className="flex justify-between items-center mt-5">
                  <span className="text-[20px] font-black text-black">₹{p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-[#0a66ff] hover:bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-black tracking-wide transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
