import Link from "next/link";
import { Heart, Globe, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#fbf9f4] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#e8e2d2] text-[#192742] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
          <span className="text-[#ddaf56]">✨</span> Preserving Indian Heritage
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#192742] tracking-tight mb-6">
          Empowering India’s Traditional Craftspeople
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Kaarigar Expo is a modern event management and digital registration platform dedicated to elevating artisans, bridging the gap between master creators and patrons of authentic handicrafts.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e2d2] flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#fbf9f4] rounded-2xl flex items-center justify-center text-[#192742] mb-6 border border-[#e8e2d2]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-[#192742] mb-4">Our Mission</h3>
          <p className="text-slate-600 leading-relaxed">
            To provide every Indian artisan a transparent, dignified, and direct channel to apply for, participate in, and excel at major handicraft melas, exhibitions, and cultural bazaars across the country.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e2d2] flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#fbf9f4] rounded-2xl flex items-center justify-center text-[#ddaf56] mb-6 border border-[#e8e2d2]">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-[#192742] mb-4">Our Vision</h3>
          <p className="text-slate-600 leading-relaxed">
            A sustainable cultural economy where traditional handicraft traditions thrive, artisan livelihoods are protected, and visitors experience the rich cultural tapestry of India firsthand.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8e2d2] flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#fbf9f4] rounded-2xl flex items-center justify-center text-green-600 mb-6 border border-[#e8e2d2]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-[#192742] mb-4">Authenticity & Trust</h3>
          <p className="text-slate-600 leading-relaxed">
            Rigorous curation and review workflows ensure only verified, authentic artisans are featured, safeguarding both visitor trust and artisan integrity.
          </p>
        </div>

      </div>

      <div className="max-w-5xl mx-auto bg-[#192742] rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#ddaf56] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
            Join the Cultural Movement
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Whether you are a generational master craftsperson or a passionate admirer of Indian arts, Kaarigar Expo welcomes you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/register" 
              className="bg-[#ddaf56] hover:bg-[#c99a41] text-[#192742] px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 w-full sm:w-auto"
            >
              Register Today
            </Link>
            <Link 
              href="/events" 
              className="bg-transparent border-2 border-slate-500 hover:border-white hover:text-white text-slate-300 px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto"
            >
              Explore Melas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
