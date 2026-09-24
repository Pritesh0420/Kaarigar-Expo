# Kaarigar Expo

A fullstack Mela (artisan fair) discovery and registration platform built with Next.js (App Router), Tailwind CSS, and Firebase.

## Features Built

1. **Role-based Authentication**
   - **Admin:** Can create events, manage artisan applications (Approve/Reject), and view RSVPs.
   - **Kaarigar (Artisan):** Can set up their profile, browse upcoming events, apply for booths, and track application status (Pending, Approved, Rejected).
   - **Visitor:** Can browse events, use city/search filters, view approved artisans, and RSVP to events.
   - Includes a 1-click Quick Login on the login page which automatically creates the user if they don't exist.

2. **Core Pages & Dashboards**
   - **Landing Page (`/`):** Hero section, featured events, and a quick database seeding button.
   - **Events Catalog (`/events`):** Full list of events with search and city filters.
   - **Event Details (`/events/[id]`):** Details including dates, interactive map, list of approved artisans, and context-aware action buttons (RSVP for visitors, Apply for artisans).
   - **Admin Dashboard (`/admin/dashboard`):** 3-tab layout for Managing Events, Applications, and RSVPs.
   - **Kaarigar Dashboard (`/kaarigar/dashboard`):** Profile management and application tracker.
   - **Visitor Dashboard (`/visitor/my-rsvps`):** List of registered events.

3. **Tech Stack & Integrations**
   - Next.js 15 (App Router, TypeScript)
   - Tailwind CSS for responsive and premium styling
   - Firebase v10 Web SDK (Auth, Firestore)
   - `@react-google-maps/api` for Map embedding (with graceful fallback if no API key is provided)
   - `react-hot-toast` for UI notifications
   - Lucide React for modern SVG icons

## Local Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory. To do this, you will need credentials for Firebase and Google Maps.
   
   **Step-by-step Firebase setup:**
   1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   2. Navigate to **Project Settings** (the gear icon on the left).
   3. Under the "Your apps" section, click the **Web icon (`</>`)** to register a new web app.
   4. Copy the `firebaseConfig` keys provided by Firebase.
   5. Go to **Authentication** from the left menu, click **Get Started**, and enable the **Email/Password** sign-in method.
   6. Go to **Firestore Database** from the left menu, click **Create database**, and initialize it.

   **Step-by-step Google Maps setup:**
   1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
   2. Create a new project or select an existing one.
   3. Navigate to **APIs & Services > Library**.
   4. Search for and enable the **Maps JavaScript API**.
   5. Go to **APIs & Services > Credentials** and click **Create Credentials > API Key**.
   6. Copy your generated API Key.

   Populate your `.env.local` file with these values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   
   # For the interactive map component
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```
   *(Note: The app will run without these keys using dummy strings, but Firebase Auth & Firestore will fail to connect. The Google Map will gracefully fall back to a placeholder if the key is missing.)*

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Seed the Database (Optional):**
   On the home page (`/`), scroll down and click the **"Seed Mock Data"** button to populate your connected Firestore database with sample events, users, and applications.

## Firebase Security Rules

To secure your Firestore database, deploy the included `firestore.rules` file to your Firebase project.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if (isSignedIn() && request.auth.uid == userId) || isAdmin();
    }
    match /events/{eventId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /applications/{appId} {
      allow read: if true;
      allow create: if isSignedIn();
      allow update, delete: if isAdmin() || (isSignedIn() && request.auth.uid == resource.data.kaarigarId);
    }
    match /rsvps/{rsvpId} {
      allow read: if isAdmin() || (isSignedIn() && request.auth.uid == resource.data.visitorId);
      allow create: if isSignedIn();
      allow update, delete: if isAdmin() || (isSignedIn() && request.auth.uid == resource.data.visitorId);
    }
  }
}
```

## Deployment Guide for Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Add all the Environment Variables from your `.env.local` file into the Vercel project settings.
5. Click **Deploy**. Vercel will automatically detect Next.js and run the build command (`npm run build`).
