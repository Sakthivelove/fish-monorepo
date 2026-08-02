"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    router.replace("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="p-6">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              Fish Admin
            </h1>

            <button
              className="md:hidden border px-3 py-2 rounded"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

          <nav className="hidden md:flex gap-4 items-center mt-4">
            <Link
              href="/admin/dashboard"
              className={
                pathname ===
                  "/admin/dashboard"
                  ? "font-bold"
                  : ""
              }
            >
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className={
                pathname.startsWith(
                  "/admin/orders"
                )
                  ? "font-bold"
                  : ""
              }
            >
              Orders
            </Link>

            <Link
              href="/admin/products"
              className={
                pathname.startsWith(
                  "/admin/products"
                )
                  ? "font-bold"
                  : ""
              }
            >
              Products
            </Link>

            <Link
              href="/admin/inventory"
              className={
                pathname.startsWith(
                  "/admin/inventory"
                )
                  ? "font-bold"
                  : ""
              }
            >
              Inventory
            </Link>

            <Link
              href="/admin/customers"
              className={
                pathname.startsWith("/admin/customers")
                  ? "font-bold"
                  : ""
              }
            >
              Customers
            </Link>

            <Link
              href="/admin/reports"
              className={
                pathname.startsWith(
                  "/admin/reports"
                )
                  ? "font-bold"
                  : ""
              }
            >
              Reports
            </Link>

            <button
              onClick={handleLogout}
              className="border px-3 py-1 rounded"
            >
              Logout
            </button>
          </nav>
          {
            menuOpen && (
              <nav className="md:hidden flex flex-col gap-3 mt-4 border-t pt-4">

                <Link
                  href="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname.startsWith("/admin/dashboard")
                      ? "font-bold text-blue-600"
                      : ""
                  }
                >
                  Dashboard
                </Link>

                <Link
                  href="/admin/orders"
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname.startsWith("/admin/orders")
                      ? "font-bold text-blue-600"
                      : ""
                  }
                >
                  Orders
                </Link>

                <Link
                  href="/admin/products"
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname.startsWith("/admin/products")
                      ? "font-bold text-blue-600"
                      : ""
                  }
                >
                  Products
                </Link>

                <Link
                  href="/admin/inventory"
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname.startsWith("/admin/inventory")
                      ? "font-bold text-blue-600"
                      : ""
                  }
                >
                  Inventory
                </Link>

                <Link
                  href="/admin/customers"
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname.startsWith("/admin/customers")
                      ? "font-bold text-blue-600"
                      : ""
                  }
                >
                  Customers
                </Link>

                <Link
                  href="/admin/reports"
                  onClick={() => setMenuOpen(false)}
                  className={
                    pathname.startsWith("/admin/reports")
                      ? "font-bold text-blue-600"
                      : ""
                  }
                >
                  Reports
                </Link>

                <button
                  onClick={handleLogout}
                  className="border px-3 py-2 rounded text-left w-full"
                >
                  Logout
                </button>

              </nav>
            )
          }
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}