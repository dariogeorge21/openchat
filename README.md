# OpenChat — WhatsApp-Web-Inspired End-to-End Encrypted Real-Time Chat

A production-quality, publicly deployable, real-time messaging application inspired by the WhatsApp Web user experience and powered by **Next.js**, **TypeScript**, **Supabase**, and the browser-native **Web Crypto API**.

OpenChat enforces **True Zero-Knowledge End-to-End Encryption (E2EE)**. Message plaintexts and private encryption keys are generated and held exclusively on client devices — the PostgreSQL database and realtime servers only ever receive and transmit authenticated ciphertext and cryptographic nonces.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Authentication Architecture](#5-authentication-architecture)
6. [End-to-End Encryption (E2EE) Architecture](#6-end-to-end-encryption-e2ee-architecture)
7. [Threat Model & Security Guarantees](#7-threat-model--security-guarantees)
8. [Database Schema & Row Level Security (RLS)](#8-database-schema--row-level-security-rls)
9. [Realtime Architecture](#9-realtime-architecture)
10. [Step-by-Step Supabase Setup Guide](#10-step-by-step-supabase-setup-guide)
11. [Google OAuth Configuration Guide](#11-google-oauth-configuration-guide)
12. [Environment Variables](#12-environment-variables)
13. [Local Development](#13-local-development)
14. [Vercel Deployment Guide](#14-vercel-deployment-guide)
15. [Automated Cryptographic Testing](#15-automated-cryptographic-testing)
16. [Security & Known Limitations](#16-security--known-limitations)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. Project Overview

OpenChat is designed to deliver the polished, frictionless desktop and mobile experience of WhatsApp Web combined with verifiable zero-knowledge privacy.

- **Client-Side Cryptography**: Keys are generated inside the browser via `window.crypto.subtle`. Private keys are stored in client `IndexedDB` and **never transmitted over the network**.
- **1:1 Direct Encrypted Messaging**: Authenticated key agreement using **ECDH** over the **NIST P-256** curve, combined with **AES-256-GCM** symmetric encryption.
- **Encrypted Group Messaging**: 256-bit AES-GCM group key envelopes distributed to authorized members via pairwise ECDH secrets.
- **Forward-Secure Key Rotation**: When a group member is removed or leaves, a new group key version is automatically generated and distributed only to remaining active members. The removed user is cryptographically prevented from decrypting subsequent messages.
- **Ephemeral & Persistent Realtime**: Pure broadcast channels for typing indicators and presence; PostgreSQL replication channels for live message stream and delivery/read receipts (`sent` &rarr; `delivered` &rarr; `seen`).
- **Aesthetic Excellence**: Native Light and Dark themes inspired by WhatsApp Web, responsive mobile sliding transition, and accessible contrast.

---

## 2. Key Features

- **Google OAuth Authentication**: Frictionless login with PKCE session exchange; user profiles automatically created via database triggers.
- **Zero-Knowledge Privacy**: Server administrators cannot read message contents even with direct database access.
- **Device Fingerprints**: SHA-256 public key fingerprints formatted as safety numbers (e.g. `EE8D 6AE6 15B7 ...`) for out-of-band identity verification.
- **Real-Time Presence**: Track whether contacts are "Online", "Last seen just now", or timestamped last seen.
- **Live Typing Indicators**: Debounced and throttled broadcast indicators ("Maya is typing...").
- **WhatsApp-Style Status Ticks**: Single grey tick (Sent), double grey ticks (Delivered), double blue ticks (Seen).
- **Group Administration**: Create groups, add/remove members, promote/demote admins, and automatic forward-secure key rotation.
- **Safe User Search**: Search registered users by display name or username with 250ms debouncing without exposing sensitive profile or credential fields.
- **Graceful Error Handling**: Corrupted or untrusted ciphertext renders as `"🔒 Unable to decrypt this message"` without crashing the client.

---

## 3. Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript 5 (Strict Mode)
- **UI & Components**: Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Framer Motion
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Realtime**: Supabase Realtime (Presence, Broadcast, and PostgreSQL Replication)
- **Cryptographic Primitives**: Browser-native Web Crypto API (`ECDH P-256`, `AES-256-GCM`, `SHA-256`)
- **Client Storage**: Browser IndexedDB (`openchat_e2ee`)
- **Theme**: `next-themes` (System, Light, Dark)

---

## 4. System Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Browser Client                         │
│                                                           │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │   IndexedDB      │  │    Web Crypto API Engine       │  │
│  │ (Private Keys    │  │ • ECDH P-256 Key Agreement     │  │
│  │  & Group Keys)   │  │ • AES-256-GCM Authenticated Enc│  │
│  └────────▲─────────┘  │ • SHA-256 Fingerprint Gen      │  │
│           │            └───────────────▲────────────────┘  │
│           │                            │                   │
│  ┌────────▼────────────────────────────▼────────────────┐  │
│  │     Next.js React UI (Hooks, State, Components)      │  │
│  └────────────────────────▲─────────────────────────────┘  │
└───────────────────────────┼───────────────────────────────┘
                            │ HTTPS / WSS
                            ▼ (Ciphertext & Public Keys Only)
┌───────────────────────────────────────────────────────────┐
│                   Supabase Cloud Backend                  │
│                                                           │
│  ┌───────────────────────┐   ┌─────────────────────────┐  │
│  │    Supabase Auth      │   │    Supabase Realtime    │  │
│  │ (Google OAuth PKCE)   │   │ (Presence & Broadcast)  │  │
│  └───────────────────────┘   └─────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database + RLS              │  │
│  │  • profiles (Public user metadata)                  │  │
│  │  • user_keys (Public ECDH keys ONLY)                │  │
│  │  • conversations & conversation_members             │  │
│  │  • group_member_keys (Encrypted key envelopes)      │  │
│  │  • messages (Ciphertext & IVs ONLY)                 │  │
│  │  • message_receipts (Delivery & seen receipts)      │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## 5. Authentication Architecture

1. User clicks **"Continue with Google"** on `/login`.
2. Supabase initiates OAuth 2.0 PKCE flow with Google Identity Services.
3. Upon consent, Google redirects to `/auth/callback?code=...`.
4. The server-side route handler exchanges the authorization code for a session and sets secure HTTP-only cookies.
5. In the client, `AuthProvider` (`contexts/auth-context.tsx`) boots:
   - Detects the authenticated user.
   - Synchronizes or inserts the public profile in `profiles`.
   - Checks browser `IndexedDB` for existing device ECDH keys.
   - If no keys exist, generates an ECDH P-256 key pair, saves the private key in `IndexedDB`, and publishes the public JWK and fingerprint to `user_keys`.
   - Directs the user into `/chat`.

---

## 6. End-to-End Encryption (E2EE) Architecture

### 1:1 Direct Conversation Flow
1. **Key Discovery**: Alice's client queries `user_keys` for Bob's public ECDH key.
2. **Key Agreement**: Alice computes the shared secret:
   ```ts
   deriveKey({ name: "ECDH", public: bobPublicKey }, alicePrivateKey, { name: "AES-GCM", length: 256 })
   ```
3. **Encryption**: Alice generates a freshly randomized 12-byte IV via `crypto.getRandomValues(new Uint8Array(12))` and encrypts the UTF-8 plaintext with `AES-GCM`.
4. **Persistence**: Alice inserts `{ ciphertext, iv, algorithm: 'AES-GCM-256' }` into PostgreSQL.
5. **Decryption**: Bob receives the ciphertext and IV via Supabase Realtime, derives the same shared secret with Alice's public key, and decrypts the message locally.

### Group Conversation Flow & Key Rotation Lifecycle
1. **Creation**: Admin client generates a 256-bit AES-GCM group key (`GK_v`, starting at `v=1`).
2. **Envelope Distribution**: For each member, the admin encrypts `GK_v` using pairwise ECDH shared keys and stores the result in `group_member_keys`.
3. **Group Messaging**: Members unwrap `GK_v` once and cache it in `IndexedDB`. All messages in the group are encrypted with `GK_v` using a unique 12-byte IV.
4. **Member Removal & Forward Secrecy**:
   - When an admin removes a member, the member is deleted from `conversation_members`.
   - The admin client automatically generates `GK_(v+1)`.
   - `GK_(v+1)` is wrapped and uploaded **only for the remaining active members**.
   - The conversation's `current_key_version` advances to `v+1`.
   - The removed user never receives `GK_(v+1)` and cannot decrypt any future messages sent to the group.

---

## 7. Threat Model & Security Guarantees

### What Is Protected
- **Confidentiality Against Database Compromise**: If an attacker dumps the Supabase database, message contents remain undecryptable without the participants' client-side private keys.
- **Confidentiality Against Network Eavesdropping**: All messages in transit are double-protected (TLS/HTTPS + AES-GCM-256).
- **Integrity & Tamper Resistance**: Any tampering with ciphertext or IV causes AES-GCM authentication verification to fail.
- **Forward Secrecy on Group Departure**: Removed group members cannot read subsequent messages.

### What Is NOT Protected (Documented Limitations)
- **Metadata Visibility**: The server knows who is messaging whom, timestamps, group memberships, and ciphertext lengths.
- **Client Endpoint Compromise**: If a malicious actor has physical access, root privileges, or malware on a user's machine, client memory or `IndexedDB` could be extracted.
- **Out-of-band Verification**: Public key fingerprints are displayed in the profile modal for manual safety number comparison; automated Signal-style multi-device Pre-Key Double Ratchet is not implemented in this version.

---

## 8. Database Schema & Row Level Security (RLS)

The complete SQL schema is located in [`supabase/schema.sql`](file:///d:/VS%20CODE/open-chat/openchat/supabase/schema.sql).

### Tables
| Table | Description | Plaintext Content? |
| :--- | :--- | :--- |
| `profiles` | Display name, username, avatar URL, last seen, online status | Public metadata only |
| `user_keys` | Public ECDH key (JWK) & SHA-256 fingerprint | **NO** (Public keys only) |
| `conversations` | Conversation records (`type`: 'direct' or 'group', name, avatar) | Metadata only |
| `conversation_members` | Memberships, roles (`admin` / `member`), read timestamps | Authorization metadata |
| `group_member_keys` | Group AES keys wrapped with pairwise ECDH secrets | **NO** (Ciphertext only) |
| `messages` | `ciphertext`, `iv`, `key_version`, `status` | **NO** (Ciphertext only) |
| `message_receipts` | Message delivery and seen receipts per user | Status timestamps only |

### Row Level Security (RLS) Enforcement
- **`profiles`**: Publicly readable by authenticated users; updateable only by self (`auth.uid() = id`).
- **`user_keys`**: Public keys readable by authenticated users; insertable/updateable only by self.
- **`conversations`**: Selectable only by verified members (`is_conversation_member(id)`).
- **`conversation_members`**: Viewable only by participants; insertable/removable only by group admins or direct conversation participants.
- **`group_member_keys`**: Users can **strictly select only their own key envelope** (`user_id = auth.uid()`).
- **`messages`**: Users can only query messages from conversations where they hold an active membership. Users can only insert messages with `sender_id = auth.uid()` in conversations they belong to.

---

## 9. Realtime Architecture

| Channel | Type | Payload / Purpose |
| :--- | :--- | :--- |
| `messages:{convId}` | PostgreSQL Changes (`INSERT`, `UPDATE`) | Dispatches encrypted messages and status tick changes |
| `conversation:{convId}:typing` | Ephemeral Broadcast | Throttled typing indicator `{ userId, displayName, isTyping }` (no DB writes) |
| `openchat:presence` | Ephemeral Presence | Tracks live online/offline state across open tabs and windows |
| `openchat:conversations_global`| PostgreSQL Changes | Dynamically updates conversation list ordering when new messages arrive |

---

## 10. Step-by-Step Supabase Setup Guide

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **"New Project"**.
3. Choose your organization, assign a project name (e.g. `openchat-prod`), select a database region close to your users, and create a strong database password.

### Step 2: Run the Database Schema Migration
1. In your Supabase dashboard, navigate to the **SQL Editor** (left menu).
2. Click **"New query"**.
3. Open [`supabase/schema.sql`](file:///d:/VS%20CODE/open-chat/openchat/supabase/schema.sql) from this repository, copy the entire SQL script, and paste it into the editor.
4. Click **"Run"**.
5. Verify that all 7 tables, indexes, triggers, and RLS policies are created without errors.

### Step 3: Enable Realtime Replication
The SQL script automatically adds `messages`, `conversations`, `conversation_members`, and `message_receipts` to the `supabase_realtime` publication.
To verify:
1. Go to **Database** &rarr; **Publications** &rarr; click on `supabase_realtime`.
2. Confirm the 4 tables are listed with replication enabled.

### Step 4: Obtain API Credentials
1. Go to **Project Settings** &rarr; **API**.
2. Copy the **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`).
3. Copy the **anon / public key** or **publishable key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).

---

## 11. Google OAuth Configuration Guide

### Step 1: Create Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `OpenChat Auth`).
3. Navigate to **APIs & Services** &rarr; **OAuth consent screen**:
   - User Type: **External**.
   - App name: `OpenChat`.
   - User support email & Developer email: your email.
   - Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
4. Navigate to **APIs & Services** &rarr; **Credentials**:
   - Click **Create Credentials** &rarr; **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `OpenChat Supabase Client`.
   - **Authorized redirect URIs**:
     Add your Supabase OAuth callback URL:
     ```
     https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback
     ```
5. Click **Create** and copy your **Client ID** and **Client Secret**.

### Step 2: Configure Google Provider in Supabase
1. In the Supabase dashboard, navigate to **Authentication** &rarr; **Providers** &rarr; **Google**.
2. Toggle Google to **Enabled**.
3. Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
4. Click **Save**.

### Step 3: Configure Redirect URLs in Supabase
1. Navigate to **Authentication** &rarr; **URL Configuration**.
2. Set **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://your-openchat-domain.vercel.app`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
   - `https://your-openchat-domain.vercel.app/**`
   - `https://your-openchat-domain.vercel.app/auth/callback`
4. Click **Save**.

---

## 12. Environment Variables

Create a `.env` or `.env.local` file in the root of the project:

```env
# Supabase Public API Credentials (Safe for browser / client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Or use publishable key:
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Site URL (used for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> [!WARNING]
> **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code or `NEXT_PUBLIC_*` variables. OpenChat relies strictly on Row Level Security and client-side cryptography.

---

## 13. Local Development

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 14. Vercel Deployment Guide

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete openchat E2EE implementation"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
   - Select your `openchat` repository.
   - Framework Preset: **Next.js**.

3. **Configure Environment Variables in Vercel**:
   Add the following variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) = your Supabase public key
   - `NEXT_PUBLIC_SITE_URL` = `https://your-openchat-project.vercel.app`

4. **Update Redirects in Supabase & Google Cloud**:
   - In Google Cloud Console, add `https://your-openchat-project.vercel.app/auth/callback` to Authorized Redirect URIs.
   - In Supabase Auth &rarr; URL Configuration, add `https://your-openchat-project.vercel.app/**` to Redirect URLs.

5. Click **Deploy**.

---

## 15. Automated Cryptographic Testing

An automated verification test suite is provided in [`scripts/test-e2ee.ts`](file:///d:/VS%20CODE/open-chat/openchat/scripts/test-e2ee.ts).

Run the tests using:
```bash
npm run test:crypto
```

### Verified Properties
- Client-side ECDH P-256 key generation.
- Deterministic SHA-256 identity fingerprinting.
- 1:1 pairwise shared key derivation and AES-GCM encryption/decryption roundtrip.
- Tamper resistance: bit-flipping ciphertext causes AES-GCM authentication failure.
- Group AES-256 key generation and envelope wrapping for multiple members.
- Forward-secure group key rotation: removed member cannot decrypt subsequent key version messages.

---

## 16. Security & Known Limitations

1. **Browser Cache & IndexedDB**:
   - Private keys are stored in browser `IndexedDB`. If a user logs in on a shared/untrusted public computer, they should use Incognito mode or click **Sign Out** to clear local cryptographic storage.
2. **Device Multi-Device Synchronization**:
   - Because private keys are generated on a single client device and never uploaded to Supabase, logging in from a completely new browser generates a new device keypair. In this version, historical messages from prior sessions on other devices are not retroactively imported unless exported/restored.
3. **No Out-of-Band Channel Binding**:
   - While public key fingerprints are displayed in the profile dialog, users should manually verify fingerprints out-of-band to safeguard against theoretical public-key substitution.

---

## 17. Troubleshooting

- **Decryption Error ("Unable to decrypt this message")**:
  - Occurs if a user wiped their browser `IndexedDB` or if the message was sent to an older device key.
- **Google OAuth Redirect Loops**:
  - Verify that the redirect URI in Google Cloud Console matches `https://<PROJECT_REF>.supabase.co/auth/v1/callback` exactly.
- **Messages Not Appearing in Real Time**:
  - Verify in Supabase Dashboard &rarr; Database &rarr; Publications that `messages` is included in `supabase_realtime`.

---

## License

MIT &bull; OpenChat
