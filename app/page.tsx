"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<number>(0);

  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f3ee]"> {/* OFF WHITE background */}
      {/* NAVBAR */}
      <nav className="bg-white border-b border-black/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight text-black">HNG-SHOP<span className="text-blue-600">.</span></h1>
          <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold">
            Cart ({cart})
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-[#111]">Trending Products</h2>
        <p className="text-[#666] font-medium mt-1 mb-8">Fresh drops from Supabase • Live database</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all border border-black/[0.04]">
              <div className="h-72 bg-[#f0f0f0] overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-black text-[18px] text-black tracking-tight">{p.name}</h3>
                <p className="text-[14px] text-[#666] mt-1 font-medium">{p.description}</p>
                <div className="flex justify-between items-center mt-5">
                  <span className="text-[20px] font-black text-black">₹{p.price}</span>
                  <button onClick={()=>setCart(cart+1)} className="bg-[#0a66ff] hover:bg-black text-white px-5 py-2.5 rounded-full text-[13px] font-black tracking-wide transition-colors">
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