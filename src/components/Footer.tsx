export default function Footer() {
  return (
    <footer className="bg-[#192742] text-white pt-16 pb-8 border-t-[8px] border-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#ddaf56]">✨</span>
              <span className="text-2xl font-extrabold tracking-tight">
                Kaarigar Expo
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dedicated to celebrating, preserving, and providing market access to India's traditional handicraft masters, weaves, and folk heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#ddaf56] font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/events" className="hover:text-white transition-colors">Upcoming Melas</a></li>
              <li><a href="/kaarigars" className="hover:text-white transition-colors">Featured Kaarigars</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Platform</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-[#ddaf56] font-bold mb-4">Portals</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="/register" className="hover:text-white transition-colors">Artisan Registration</a></li>
              <li><a href="/events" className="hover:text-white transition-colors">Visitor Passes</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Account Login</a></li>
              <li><a href="/events" className="hover:text-white transition-colors">Event Calendar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#ddaf56] font-bold mb-4">Contact & Helpdesk</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-slate-400">✉</span> support@kaarigarexpo.org
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-400">📞</span> +91 11 2436 0000
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-400">📍</span> New Delhi, India
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 Kaarigar Expo - Mela Registration Platform. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Empowering Indian Artisans with ❤️</p>
        </div>
      </div>
    </footer>
  );
}
