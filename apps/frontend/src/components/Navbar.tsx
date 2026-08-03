"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import SearchModal from "@/components/navbar/SearchModal";

const menus = [
  {
    name: "முகப்பு",
    href: "/",
  },
  {
    name: "பொருட்கள்",
    href: "/products",
  },
  {
    name: "என் ஆர்டர்கள்",
    href: "/orders",
  },
  {
    name: "தொடர்பு",
    href: "/contact",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [searchOpen, setSearchOpen] =
    useState(false);

  useEffect(() => {
    setCartCount(getCart().length);

    const interval = setInterval(() => {
      setCartCount(getCart().length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b shadow-sm">

      <div className="container mx-auto px-4">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="text-3xl">
              🎣
            </div>

            <div>
              <h1 className="font-bold text-blue-800 text-lg">
                எமனேரி மீனவன்
              </h1>

              <p className="text-xs text-gray-500">
                Fresh Sea Foods
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}

          <nav className="hidden lg:flex gap-8">

            {menus.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition
                ${pathname === item.href
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                  }`}
              >
                {item.name}
              </Link>
            ))}

          </nav>

          {/* Right */}

          <div className="hidden lg:flex items-center gap-5">

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/cart"
              className="relative"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            <a
              href="tel:+916381479365"
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <Phone size={18} />

              Order Now
            </a>

          </div>

          {/* Mobile */}

          <div className="flex lg:hidden items-center gap-4">

            <Link
              href="/cart"
              className="relative"
            >
              <ShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5">
                  {cartCount}
                </span>
              )}

            </Link>

            <button
              onClick={() =>
                setMobileOpen(!mobileOpen)
              }
            >
              <Menu />
            </button>

          </div>

        </div>

        {mobileOpen && (

          <div className="lg:hidden border-t py-4 space-y-4">

            {menus.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="block"
              >
                {item.name}
              </Link>
            ))}

            <a
              href="tel:+916381479365"
              className="flex items-center gap-2 bg-orange-500 text-white rounded-lg justify-center py-3"
            >
              <Phone size={18} />

              Order Now
            </a>

          </div>

        )}

      </div>
      <SearchModal
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
/>

    </header>
  );
}