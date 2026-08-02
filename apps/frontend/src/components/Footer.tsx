import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Fish,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950 text-white">

      <div className="container mx-auto px-6 py-14">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Company */}

          <div>

            <div className="flex items-center gap-3 mb-4">

              <div className="bg-orange-500 rounded-full p-3">
                <Fish className="w-6 h-6" />
              </div>

              <div>

                <h2 className="font-bold text-2xl">
                  எமனேரி மீனவன்
                </h2>

                <p className="text-sm text-gray-300">
                  Fresh Sea Foods
                </p>

              </div>

            </div>

            <p className="text-gray-300 leading-7">

              கடலிலிருந்து நேரடியாக
              உங்கள் வீட்டிற்கு
              புத்துணர்ச்சியான
              மீன்களை கொண்டு
              வருகிறோம்.

            </p>

          </div>

          {/* Products */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-orange-400">
              Products
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                <Link href="/products">
                  அனைத்து பொருட்கள்
                </Link>
              </li>

              <li>
                <Link href="/products?category=மீன்">
                  மீன்கள்
                </Link>
              </li>

              <li>
                <Link href="/products?category=இறால்">
                  இறால்
                </Link>
              </li>

              <li>
                <Link href="/products?category=நண்டு">
                  நண்டு
                </Link>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-orange-400">
              Company
            </h3>

            <ul className="space-y-3 text-gray-300">

              <li>
                <Link href="/">
                  முகப்பு
                </Link>
              </li>

              <li>
                <Link href="/orders">
                  என் ஆர்டர்கள்
                </Link>
              </li>

              <li>
                <Link href="/contact">
                  தொடர்பு
                </Link>
              </li>

              <li>
                <Link href="/privacy">
                  Privacy Policy
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-orange-400">
              Contact
            </h3>

            <div className="space-y-4 text-gray-300">

              <div className="flex gap-3">

                <Phone className="w-5 h-5 mt-1 text-orange-400" />

                <span>
                  +91 63814 79365
                </span>

              </div>

              <div className="flex gap-3">

                <Mail className="w-5 h-5 mt-1 text-orange-400" />

                <span>
                  support@emanerimeenavan.in
                </span>

              </div>

              <div className="flex gap-3">

                <MapPin className="w-5 h-5 mt-1 text-orange-400" />

                <span>
                  Ariyalur,
                  Tamil Nadu
                </span>

              </div>

            </div>

          </div>

          {/* Social */}

          <div>

            <h3 className="font-bold text-lg mb-5 text-orange-400">
              Follow Us
            </h3>

            <div className="flex gap-4">

              <a
                href="#"
                className="bg-white/10 hover:bg-orange-500 rounded-full p-3 transition"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="#"
                className="bg-white/10 hover:bg-orange-500 rounded-full p-3 transition"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="bg-white/10 hover:bg-green-500 rounded-full p-3 transition"
              >
                <FaWhatsapp size={20} />
              </a>

              <a
                href="#"
                className="bg-white/10 hover:bg-red-600 rounded-full p-3 transition"
              >
                <FaYoutube size={20} />
              </a>

            </div>

            <div className="mt-8">

              <h4 className="font-semibold mb-3">
                Accepted Payments
              </h4>

              <div className="flex flex-wrap gap-2">

                <span className="bg-white/10 rounded px-3 py-1">
                  COD
                </span>

                <span className="bg-white/10 rounded px-3 py-1">
                  UPI
                </span>

                <span className="bg-white/10 rounded px-3 py-1">
                  Bank
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Trust */}

        <div className="grid md:grid-cols-3 gap-6 mt-14 border-t border-white/10 pt-10">

          <div className="flex items-center gap-3">

            <ShieldCheck className="text-green-400" />

            <div>

              <p className="font-semibold">
                Fresh Fish
              </p>

              <p className="text-sm text-gray-400">
                Daily Fresh Catch
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Truck className="text-blue-400" />

            <div>

              <p className="font-semibold">
                Fast Delivery
              </p>

              <p className="text-sm text-gray-400">
                Same Day Delivery
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Wallet className="text-yellow-400" />

            <div>

              <p className="font-semibold">
                Secure Payment
              </p>

              <p className="text-sm text-gray-400">
                COD & UPI Supported
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-gray-400 text-sm">

            © {new Date().getFullYear()} எமனேரி மீனவன்.
            அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.

          </p>

          <p className="text-sm text-gray-500">

            Made with ❤️ in Tamil Nadu

          </p>

        </div>

      </div>

    </footer>
  );
}