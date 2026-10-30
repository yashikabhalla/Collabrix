# Collabrix 🚀
 
### AI-Powered Real-Time Collaborative Coding Platform for Placement Preparation
 

# Live Demo
**[🌐 Live Demo](https://collabrix-two-kappa.vercel.app)** — 
Click **"Launch Demo"** for instant access, no signup required.
 

---
 
## 📖 What is Collabrix?
 
Collabrix is a full-stack collaborative coding platform built for technical interview preparation. Multiple users can join a shared coding room and code together in real-time, while an AI interviewer guides them through DSA problems — just like a real placement interview.
 
> **Built for:** CS/Engineering students preparing for product company placements at Google, Microsoft, Amazon, and Flipkart.
 
---
 
## ✨ Core Features
 
### 👨‍💻 Real-Time Collaborative Editor
- Monaco Editor with real-time multi-user editing and live cursor tracking
- Cursor tracking with user names and colors
- Presence indicators showing who is online

### 🤖 AI Interviewer (Chatbot)
- Powered by the Groq API with GPT-OSS-20B for fast LLM inference
- Choose between **Mock Interview** or **Practice Mode**
- AI asks DSA problems, gives hints, and evaluates solutions
- Remembers conversation context throughout the session
- Tailors difficulty based on your target company
### ▶️ Code Execution
- Supports **10+ programming languages** via JDoodle API
- Output displayed in real-time below the editor
```
JavaScript  •  TypeScript  •  Python  •  Java  •  C++  •  C
Go  •  Rust  •  Kotlin  •  Swift  •  PHP  •  Ruby
```
 
### 📹 Video Calling *(Pro only)*
- Video Calling with **Jitsi Meet** integration
- No external app needed — runs inside the browser
- Live notification when a collaborator starts a call
### 🔐 Authentication
- Secure sign-up/sign-in powered by **Clerk**
- Google social login supported
### 💳 Subscription & Payments
- **Free:** 3 rooms/month, 2 participants, 8 languages
- **Pro (₹299/month):** Unlimited rooms, video calling, session recordings, AI Interviewer
- Payments via **Razorpay** — UPI, cards, net banking supported
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 18, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Code Editor | Monaco Editor |
| Real-Time Sync | Liveblocks (CRDT) |
| AI | Groq API — GPT-OSS-20B |
| Video Calling | Jitsi Meet |
| Authentication | Clerk |
| Database | PostgreSQL + Prisma ORM |
| Payments | Razorpay |
| Code Execution | JDoodle API |
| Deployment | Vercel |
 
---
 
## 💡 Free vs Pro
 
| Feature | Free | Pro |
|---|:---:|:---:|
| Rooms | 3 | Unlimited |
| Programming languages | 8 | 10+ |
| Code execution | ✅ | ✅ |
| AI Interviewer | ❌ | ✅ |
| Video calling | ❌ | ✅ |
| Session recordings | ❌ | ✅ |
| Price | ₹0/month | ₹299/month |
 
---
 
## 📁 Project Structure
 
```
collabrix/
├── app/
│   ├── (auth)/                   # Sign in / Sign up pages
│   ├── (dashboard)/              # Dashboard page
│   ├── api/
│   │   ├── ai/                   # Groq AI chatbot endpoint
│   │   ├── execute/              # Code execution endpoint
│   │   ├── liveblocks-auth/      # Liveblocks auth endpoint
│   │   ├── payment/              # Razorpay create-order + verify
│   │   ├── rooms/                # Room CRUD API
│   │   ├── solved/               # Solved problems tracking
│   │   └── video-room/           # Jitsi video room API
│   ├── demo/                     # Demo mode (no auth required)
│   └── room/[roomId]/            # Individual room page
├── components/
│   ├── dashboard/                # Dashboard UI components
│   ├── editor/
│   │   ├── AIChat.tsx            # AI Interviewer chatbot
│   │   ├── CollaborativeEditor.tsx
│   │   ├── LiveCursors.tsx
│   │   ├── Output.tsx
│   │   ├── RoomClient.tsx
│   │   ├── Toolbar.tsx
│   │   └── VideoCall.tsx
│   └── landing/                  # Landing page sections
├── lib/
│   ├── db.ts                     # Prisma client
│   └── plans.ts                  # Free/Pro plan limits
├── prisma/
│   └── schema.prisma             # Database schema
└── liveblocks.config.ts          # Liveblocks types config
```
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) or [Supabase](https://supabase.com) free tier works)
- Accounts on: Clerk, Liveblocks, Groq, Razorpay, JDoodle
### 1. Clone the repository
 
```bash
git clone https://github.com/yashikabhalla/collabrix.git
cd collabrix
npm install
```
 
### 2. Set up environment variables
 
Create a `.env.local` file in the root:
 
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
 
# Database
DATABASE_URL=postgresql://...
 
# Liveblocks
LIVEBLOCKS_SECRET_KEY=sk_...
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
 
# Groq AI
GROQ_API_KEY=gsk_...
 
# Razorpay Payments
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
 
# JDoodle Code Execution
JDOODLE_CLIENT_ID=...
JDOODLE_CLIENT_SECRET=...
```
 
### 3. Set up the database
 
```bash
npx prisma db push
npx prisma generate
```
 
### 4. Run the development server
 
```bash
npm run dev
```
 
Open [http://localhost:3000](http://localhost:3000) 🎉
 
---
 
## ⚙️ How It Works
 
```
User creates or joins a room
          │
          ▼
Real-Time Collaboration (Liveblocks)
cursors · presence · real-time sync
          │
          ▼
Code Editor & Execution
Monaco Editor · JDoodle · 10+ languages
          │
          ▼
AI Interviewer (Groq)
mock interview · hints · evaluation
          │
          ▼
Video Call (Jitsi) — Pro only
face-to-face mock interviews
```
 
---

## 🔧 Key Technical Decisions

| Decision | Reason |
|---|---|
| **Liveblocks** | Managed real-time collaboration with CRDT-based synchronization and presence support |
| **Groq** | Fast inference API with an OpenAI-compatible chat-completions interface |
| **Jitsi** | Browser-based video calling without requiring a separate application |
| **Clerk** | Managed authentication with social login and secure user identity management |
| **Razorpay** | Integrated Indian payment gateway supporting UPI and card payments |
| **Monaco Editor** | VS Code's underlying editor technology, providing a familiar browser-based coding experience |

---
 
## 📜 Built By
 
 © [Yashika Bhalla](https://github.com/yashikabhalla)
 
---
 
<div align="center">
**Built with ❤️**
 
[🌐 Live Demo](https://collabrix-two-kappa.vercel.app) &nbsp;·&nbsp;
 
</div>
