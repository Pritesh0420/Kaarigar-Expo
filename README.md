<div align="center">

# 🏺 Kaarigar Expo

### India's Premier Artisan & Handicraft Mela Platform

*Connecting master craftspeople with visitors across India's most celebrated cultural fairs*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-v10-orange?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**Kaarigar Expo** is a full-stack event management and artisan registration platform built to elevate India's traditional craftspeople. It provides a transparent digital channel for Kaarigars (artisans) to apply for handicraft mela stalls, and for visitors to discover and RSVP for cultural events near them.

---

## ✨ Features

### 🔐 Role-Based Authentication
Three distinct user roles, each with a dedicated dashboard and post-login redirect:

| Role | Capabilities |
|------|-------------|
| **Admin** | Create & manage events, approve/reject artisan applications, view all RSVPs |
| **Kaarigar (Artisan)** | Build profile, browse events, apply for stalls, track application status |
| **Visitor** | Browse events, RSVP for melas, manage saved events, edit profile |

### 📅 Core Pages
- **`/`** — Hero carousel with auto-advancing slides, featured live/upcoming events, stats, and platform highlights
- **`/events`** — Full events catalog with search, city filter, and status filter (Active, Upcoming, Past)
- **`/events/[id]`** — Event detail with banner, approved artisan list, interactive Google Map, and RSVP/Apply actions
- **`/kaarigars`** — Public directory of all registered artisans with craft-type filters and search
- **`/about`** — Platform mission, vision, and values
- **`/contact`** — Contact form with helpdesk info

### 🎛️ Dashboards
- **Admin** (`/admin/dashboard`) — 3-tab layout: Manage Events · Review Applications · View RSVPs
- **Kaarigar** (`/kaarigar/dashboard`) — Profile card (with photo upload), craft bio, application tracker
- **Visitor** (`/visitor/my-rsvps`) — RSVP history, profile editing, event search

### 🧅 Onboarding Flows
- **Kaarigar registration** collects: City, State, Primary Craft Specialization, Artisan Bio, and Profile/Banner Photo
- **Visitor registration** collects: Areas of Interest
- Both flows redirect to their respective dashboards immediately after signup

### 🔍 SEO Optimizations
- Unique `<title>` and `<meta description>` per page via Next.js Metadata API
- Open Graph & Twitter Card tags on all public pages
- Per-event dynamic metadata (`generateMetadata`) with event-specific OG images
- JSON-LD Organization schema on homepage
- Auto-generated `sitemap.xml` at `/sitemap.xml`
- `robots.txt` blocking private routes from crawlers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Vanilla CSS + Tailwind CSS |
| Auth & Database | Firebase v10 (Auth + Firestore) |
| Maps | `@react-google-maps/api` (graceful fallback if no key) |
| Fonts | Google Fonts — Inter + Playfair Display |
| Notifications | `react-hot-toast` |
| Icons | Lucide React |
| Hosting | Vercel (recommended) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js `18+`
- A Firebase project (free Spark plan is sufficient)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/kaarigar-expo.git
cd kaarigar-expo
npm install
```

### 2. Configure Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In **Project Settings → Your apps**, register a new **Web app** (`</>`) and copy the config keys.
3. Enable **Authentication → Email/Password** sign-in provider.
4. Enable **Firestore Database** and initialize it in production mode.

### 3. Configure Google Maps *(Optional)*

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Maps JavaScript API**.
3. Create an **API Key** under **APIs & Services → Credentials**.

### 4. Create Environment File

Create a `.env.local` file in the project root:

```env
# Firebase (required for auth & database)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Google Maps (optional – shows placeholder if missing)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

> **Note:** The app runs without these keys (using dummy strings), but Firebase Auth & Firestore will not connect. The map gracefully degrades to a static placeholder if no Maps key is set.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed the Database *(Optional)*

The app auto-seeds on first load if Firestore is empty. To manually trigger seeding, hit:

```
GET http://localhost:3000/api/seed
```

This creates **5 sample events**, **4 users** (1 admin, 2 kaarigars, 1 visitor), and **3 applications**.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@kaarigarexpo.in` | `password123` |
| Kaarigar | `artisan@kaarigarexpo.in` | `password123` |
| Visitor | `visitor@kaarigarexpo.in` | `password123` |

> These credentials only work after seeding your Firestore database.

---

## 🔒 Firestore Security Rules

Deploy the included `firestore.rules` to secure your database:

```bash
firebase deploy --only firestore:rules
```

Or copy the rules below directly into the Firebase Console (Firestore → Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // User profiles — anyone can read, only self or admin can write
    match /users/{userId} {
      allow read: if true;
      allow write: if (isSignedIn() && request.auth.uid == userId) || isAdmin();
    }

    // Events — public read, admin-only write
    match /events/{eventId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Applications — public read, signed-in create, admin/owner update
    match /applications/{appId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isAdmin() ||
        (isSignedIn() && request.auth.uid == resource.data.kaarigarId);
    }

    // RSVPs — owner/admin read, signed-in create, owner/admin update
    match /rsvps/{rsvpId} {
      allow read: if isAdmin() ||
        (isSignedIn() && request.auth.uid == resource.data.visitorId);
      allow create: if isSignedIn();
      allow update, delete: if isAdmin() ||
        (isSignedIn() && request.auth.uid == resource.data.visitorId);
    }
  }
}
```

---

## 📦 Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout with SEO metadata
│   ├── page.tsx              # Homepage (hero, featured events)
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   ├── events/
│   │   ├── page.tsx          # Events catalog
│   │   └── [id]/page.tsx     # Event detail page
│   ├── kaarigars/            # Public artisan directory
│   ├── login/                # Login page
│   ├── register/             # Registration with role-based fields
│   ├── admin/dashboard/      # Admin panel (Events/Applications/RSVPs)
│   ├── kaarigar/dashboard/   # Kaarigar profile & application tracker
│   ├── visitor/my-rsvps/     # Visitor RSVP dashboard
│   ├── robots.ts             # Auto-generated robots.txt
│   └── sitemap.ts            # Auto-generated sitemap.xml
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   └── Map.tsx
├── contexts/
│   └── AuthContext.tsx        # Global auth state + UserProfile type
└── lib/
    ├── firebase.ts            # Firebase app init
    ├── seedData.ts            # Sample data seeder
    └── autoSeed.ts            # Auto-seed on first load
```

---

## 🌐 Deployment on Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) → **New Project** → Import your repo.
3. Add all environment variables from `.env.local` under **Settings → Environment Variables**.
4. Click **Deploy** — Vercel auto-detects Next.js and runs `npm run build`.

After deploying, remember to:
- Update `siteUrl` in `src/app/layout.tsx` and `src/app/sitemap.ts` with your production domain.
- Deploy Firestore rules: `firebase deploy --only firestore:rules`

---

## 📬 Submission Checklist

### ✅ Source Code
- Available on GitHub (link below) or as a `.zip` file
- All code is original, written in TypeScript with Next.js App Router

---

### 🏗️ What Was Built

| Feature | Status | Notes |
|---------|--------|-------|
| Role-based Auth (Admin, Kaarigar, Visitor) | ✅ Built | Firebase Auth + Firestore role lookup |
| Post-login redirect to role dashboard | ✅ Built | Each role lands on its own dashboard |
| Homepage hero carousel (auto-advancing) | ✅ Built | 5s auto-advance, manual prev/next/dots |
| Featured events on homepage | ✅ Built | Live Firestore query |
| Events catalog with search + city + status filter | ✅ Built | Client-side filtering |
| Event detail page (map, artisans, RSVP/Apply) | ✅ Built | Google Maps with fallback |
| Admin dashboard (create events, approve/reject apps, view RSVPs) | ✅ Built | 3-tab layout |
| Kaarigar dashboard (profile, photo upload, application tracker) | ✅ Built | Base64 photo stored in Firestore |
| Visitor dashboard (RSVP list, profile edit, interests) | ✅ Built | Search + filter |
| Kaarigar registration onboarding (city, state, craft, bio, photo) | ✅ Built | Shown after role selection |
| Visitor registration onboarding (interests) | ✅ Built | Shown after role selection |
| Edit Profile for Kaarigars | ✅ Built | Phone, craft type, bio, photo |
| Edit Profile for Visitors | ✅ Built | Phone, interests |
| Public Kaarigars directory | ✅ Built | Search + craft filter |
| About & Contact pages | ✅ Built | Contact form with toast feedback |
| SEO — per-page metadata, OG, Twitter Card | ✅ Built | Next.js Metadata API |
| SEO — JSON-LD Organization schema | ✅ Built | Injected on homepage |
| SEO — `sitemap.xml` + `robots.txt` | ✅ Built | Auto-generated via Next.js |
| Firestore Security Rules | ✅ Built | Admin-only event writes, role-gated reads |
| Database auto-seed on first load | ✅ Built | 5 events, 4 users, 3 applications |

---

### ⏭️ Skipped / Not Implemented (Due to Time)

| Feature | Reason Skipped |
|---------|---------------|
| **Firebase Storage for photo uploads** | Used Base64 encoding in Firestore instead — simpler and zero extra config; not suitable for large-scale production |
| **Email notifications** (RSVP confirmation, application status) | Would require a backend email service (e.g., SendGrid + Firebase Functions) |
| **Pagination** on events & kaarigars lists | Client-side filtering is sufficient for demo scale |
| **Payment / Entry Pass generation** | Out of scope for this submission |
| **Admin event editing** (updating existing events) | Admin can currently create and manage applications; edit-in-place was deprioritized |
| **Real-time updates** (Firestore `onSnapshot`) | Used one-time `getDocs` fetches; real-time listeners would improve UX |
| **Unit & integration tests** | Not included due to time constraints |
| **Dark mode** | Design uses a warm earthy palette that works well in light mode only |

---

### 🌐 Live Demo

> 🚀 **[https://kaarigar-expo.vercel.app](https://kaarigar-expo-idy0i9i6t-prits2.vercel.app/)**

**Quick demo credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@kaarigarexpo.in` | `password123` |
| Kaarigar | `artisan@kaarigarexpo.in` | `password123` |
| Visitor | `visitor@kaarigarexpo.in` | `password123` |

---

## 📄 License

This project is for demonstration and educational purposes.

---

<div align="center">
  Made with ❤️ for India's artisan community
</div>
