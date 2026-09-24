import Link from "next/link";
import { Heart, Globe, ShieldCheck, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F5EFE6] min-h-screen">

      {/* Header */}
      <div className="bg-[#3D2B1F] earthy-texture py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 border border-[#C4602A]/50 text-[#C4602A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          🏺 Preserving Indian Heritage
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 max-w-3xl mx-auto">
          Empowering India's Traditional Craftspeople
        </h1>
        <p className="text-lg text-[#9C7B6A] max-w-2xl mx-auto leading-relaxed">
          Kaarigar Expo is a modern event management and digital registration platform dedicated to elevating artisans, bridging the gap between master creators and patrons of authentic handicrafts.
        </p>
      </div>

      {/* Mission / Vision / Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white p-9 rounded-3xl shadow-sm border border-[#EAE0CF] flex flex-col items-center text-center hover:shadow-md transition-shadow group">
            <div className="w-14 h-14 bg-[#F5EFE6] border border-[#EAE0CF] rounded-2xl flex items-center justify-center mb-6 text-[#C4602A] group-hover:bg-[#C4602A] group-hover:text-white group-hover:border-[#C4602A] transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">Our Mission</h3>
            <p className="text-[#6B4C3B] leading-relaxed text-sm">
              To provide every Indian artisan a transparent, dignified, and direct channel to apply for, participate in, and excel at major handicraft melas, exhibitions, and cultural bazaars across the country.
            </p>
          </div>

          <div className="bg-white p-9 rounded-3xl shadow-sm border border-[#EAE0CF] flex flex-col items-center text-center hover:shadow-md transition-shadow group">
            <div className="w-14 h-14 bg-[#F5EFE6] border border-[#EAE0CF] rounded-2xl flex items-center justify-center mb-6 text-[#D4A96A] group-hover:bg-[#D4A96A] group-hover:text-white group-hover:border-[#D4A96A] transition-colors">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">Our Vision</h3>
            <p className="text-[#6B4C3B] leading-relaxed text-sm">
              A sustainable cultural economy where traditional handicraft traditions thrive, artisan livelihoods are protected, and visitors experience the rich cultural tapestry of India firsthand.
            </p>
          </div>

          <div className="bg-white p-9 rounded-3xl shadow-sm border border-[#EAE0CF] flex flex-col items-center text-center hover:shadow-md transition-shadow group">
            <div className="w-14 h-14 bg-[#F5EFE6] border border-[#EAE0CF] rounded-2xl flex items-center justify-center mb-6 text-green-700 group-hover:bg-green-700 group-hover:text-white group-hover:border-green-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-4">Authenticity & Trust</h3>
            <p className="text-[#6B4C3B] leading-relaxed text-sm">
              Rigorous curation and review workflows ensure only verified, authentic artisans are featured, safeguarding both visitor trust and artisan integrity.
            </p>
          </div>

        </div>

        {/* CTA block */}
        <div className="bg-[#3D2B1F] rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden earthy-texture">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#C4602A] rounded-full opacity-20 blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4A96A] rounded-full opacity-20 blur-[80px] -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-5">
              Join the Cultural Movement
            </h2>
            <p className="text-[#9C7B6A] max-w-xl mx-auto mb-10 text-lg">
              Whether you are a generational master craftsperson or a passionate admirer of Indian arts, Kaarigar Expo welcomes you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/register"
                className="bg-[#C4602A] hover:bg-[#9E4B1F] text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg"
              >
                Register Today <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/events"
                className="border border-[#6B4C3B] hover:border-[#D4A96A] text-[#EAE0CF] hover:text-[#D4A96A] px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto"
              >
                Explore Melas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
