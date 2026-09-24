"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

const contactCards = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Inquiries",
    subtitle: "For stall bookings, partnerships & mela queries",
    value: "hello@kaarigarexpo.in",
    color: "text-[#B5541B]",
    bg: "bg-[#FDF0E8]",
    border: "border-[#F4C9AB]",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Artisan Helpline",
    subtitle: "Mon – Sat, 8:00 AM – 7:00 PM IST",
    value: "+91 80 4567 8901 / 8902",
    color: "text-[#1A6B45]",
    bg: "bg-[#EBF7F0]",
    border: "border-[#A8DFC4]",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Registered Office",
    subtitle: "Walk-in by prior appointment only",
    value: "Craft Bhawan, 2nd Floor, MG Road, Bengaluru – 560001, Karnataka",
    color: "text-[#5B35A0]",
    bg: "bg-[#F2EDFC]",
    border: "border-[#C9B8F0]",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Support Hours",
    subtitle: "We respond within 24 hours",
    value: "Mon – Fri: 9 AM – 6 PM\nSat: 10 AM – 2 PM",
    color: "text-[#A0521A]",
    bg: "bg-[#FBF3E9]",
    border: "border-[#E8C9A0]",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-[#FDFAF6] min-h-screen">

      {/* ── HERO — Warm Saffron gradient ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#B5541B] via-[#D4762E] to-[#E8A45C] py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white border border-white/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
            📬 Helpdesk & Inquiries
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
            Get in Touch<br />with Us
          </h1>
          <p className="text-lg text-orange-100 max-w-xl mx-auto leading-relaxed">
            Have questions about artisan stall applications, visitor entry passes, or organizing a mela? Our team is here to help every step of the way.
          </p>
        </div>
        {/* Decorative arch */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#FDFAF6] rounded-t-[3rem]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ── LEFT: Contact Cards ── */}
          <div className="lg:col-span-2 space-y-5">
            {contactCards.map((card) => (
              <div key={card.title} className={`flex gap-4 p-5 rounded-2xl border ${card.bg} ${card.border}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color} bg-white shadow-sm border ${card.border}`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#2D1A0E] mb-0.5">{card.title}</h3>
                  <p className="text-xs text-[#9C7B6A] mb-1">{card.subtitle}</p>
                  <p className={`text-sm font-semibold ${card.color} whitespace-pre-line`}>{card.value}</p>
                </div>
              </div>
            ))}

            {/* Craft image */}
            <div className="rounded-2xl overflow-hidden h-44 border border-[#E8C9A0] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&auto=format&fit=crop"
                alt="Artisan at work"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── RIGHT: Contact Form ── */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-lg border border-[#F0E6D6] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#FDF0E8] border border-[#F4C9AB] rounded-xl flex items-center justify-center text-[#B5541B]">
                <Send className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-[#2D1A0E]">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#4A2E1A] mb-2">Your Full Name <span className="text-[#B5541B]">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radheshyam Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8D5C0] focus:ring-2 focus:ring-[#B5541B] focus:border-[#B5541B] outline-none text-[#2D1A0E] placeholder:text-[#C4A882] bg-[#FDFAF6] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4A2E1A] mb-2">Email Address <span className="text-[#B5541B]">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8D5C0] focus:ring-2 focus:ring-[#B5541B] focus:border-[#B5541B] outline-none text-[#2D1A0E] placeholder:text-[#C4A882] bg-[#FDFAF6] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4A2E1A] mb-2">Subject / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Stall booking inquiry for Jaipur Mela"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8D5C0] focus:ring-2 focus:ring-[#B5541B] focus:border-[#B5541B] outline-none text-[#2D1A0E] placeholder:text-[#C4A882] bg-[#FDFAF6] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4A2E1A] mb-2">Message <span className="text-[#B5541B]">*</span></label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please describe how we can assist you..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8D5C0] focus:ring-2 focus:ring-[#B5541B] focus:border-[#B5541B] outline-none text-[#2D1A0E] placeholder:text-[#C4A882] bg-[#FDFAF6] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-[#B5541B] to-[#D4762E] hover:from-[#9E4B1F] hover:to-[#B5541B] text-white py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-[#B5541B]/30 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
                {sending ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
