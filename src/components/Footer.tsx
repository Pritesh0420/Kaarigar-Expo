import Link from "next/link";
import { Flame } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-[#EAE0CF] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-[#C4602A] rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Kaarigar Expo</span>
            </div>
            <p className="text-sm text-[#9C7B6A] leading-relaxed">
              Dedicated to celebrating, preserving, and providing market access to India's traditional handicraft masters, weavers, and folk heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#D4A96A] font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm text-[#9C7B6A]">
              {[
                { href: "/", label: "Home" },
                { href: "/events", label: "Upcoming Melas" },
                { href: "/kaarigars", label: "Featured Kaarigars" },
                { href: "/about", label: "About Platform" },
                { href: "/contact", label: "Contact Support" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#D4A96A] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-[#D4A96A] font-bold mb-5 text-sm uppercase tracking-wider">Portals</h4>
            <ul className="space-y-3 text-sm text-[#9C7B6A]">
              {[
                { href: "/register", label: "Artisan Registration" },
                { href: "/events", label: "Visitor Passes" },
                { href: "/login", label: "Account Login" },
                { href: "/events", label: "Event Calendar" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-[#D4A96A] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#D4A96A] font-bold mb-5 text-sm uppercase tracking-wider">Contact & Helpdesk</h4>
            <ul className="space-y-3 text-sm text-[#9C7B6A]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✉</span>
                <span>hello@kaarigarexpo.in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📞</span>
                <span>+91 80 4567 8901</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>Craft Bhawan, MG Road,<br />Bengaluru – 560001, KA</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#6B4C3B]/50 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#9C7B6A] gap-2">
          <p>© 2026 Kaarigar Expo – Mela Registration Platform. All rights reserved.</p>
          <p>Empowering Indian Artisans with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
