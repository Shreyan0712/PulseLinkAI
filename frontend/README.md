# PulseLink AI - Digital Health Assistant

A modern, AI-powered voice & chat-based digital health assistant built with React, Vite, TypeScript, and Tailwind CSS. This is a **frontend prototype** with mock data for demonstration purposes.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📋 Features Implemented

### ✅ Core Features
- **Authentication Flow**
  - Sign up with complete form validation
  - OTP verification for both phone and email (UI-only, check console for OTP codes)
  - Login system with mock backend
  - Session management via localStorage

- **Chat Interface**
  - Logged-in chat with conversation history
  - Guest "Quick Chat" mode (clears on refresh)
  - File upload support (PDF, JPG, PNG)
  - Voice and camera UI placeholders
  - Message composer with popover actions

- **Doctor Search & Booking**
  - Pincode filter (strict 6-digit validation)
  - Fallback modal when no doctors found in pincode
  - Multi-select specialization filter
  - Doctor cards with ratings, experience, fees (in ₹)
  - Complete appointment booking flow
  - Date picker with month/year selection
  - Time slot selection grouped by session
  - Confirm & Pay (disabled until date+slot selected)

- **Profile Management**
  - View user information
  - Display all signup details

### 🎨 Design Features
- Pastel blue & green healthcare theme
- Poppins font throughout
- Subtle medical doodle background pattern
- Responsive design (mobile & desktop)
- Accessible UI with keyboard navigation
- Smooth animations and transitions

## 🗂️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── DoctorCard.tsx   # Doctor listing card
│   ├── Navbar.tsx       # App navigation bar
│   └── OTPVerification.tsx  # OTP input component
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── ChatContext.tsx  # Chat & messaging state
├── mocks/              # Mock data files
│   ├── doctors.json    # Sample doctor data
│   └── chatHistory.json # Sample chat threads
├── pages/              # Application pages
│   ├── Start.tsx       # Landing page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup with OTP
│   ├── QuickChat.tsx   # Guest chat
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Chat.tsx        # Logged-in chat
│   ├── Appointments.tsx # Doctor search
│   ├── DoctorBooking.tsx # Appointment booking
│   └── Profile.tsx     # User profile
├── index.css           # Global styles & design system
└── App.tsx            # Main app with routing
```

## 🔧 Replacing Mock Backend

### Where to Hook Real APIs

1. **Authentication** (`src/contexts/AuthContext.tsx`)
   - Replace `login()` function with real API call
   - Replace `signup()` function with real API call
   - Update localStorage usage with proper token management

2. **OTP Verification** (`src/components/OTPVerification.tsx`)
   - Replace `sendPhoneOTP()` with real SMS API (Twilio, AWS SNS, etc.)
   - Replace `sendEmailOTP()` with email service (SendGrid, AWS SES, etc.)
   - Update validation to check against backend

3. **Chat Backend** (`src/contexts/ChatContext.tsx`)
   - Replace mock AI responses with real API (OpenAI, Claude, custom LLM)
   - Implement WebSocket for real-time responses
   - Add conversation persistence

4. **Doctor Data** (`src/pages/Appointments.tsx`, `src/pages/DoctorBooking.tsx`)
   - Replace `doctorsData` import with API fetch
   - Implement real-time slot availability
   - Add booking confirmation emails

5. **Payment Integration**
   - Add Razorpay/Stripe in `DoctorBooking.tsx`
   - Replace mock "Confirm & Pay" with real payment flow

## 🖼️ Logo Replacement

**IMPORTANT**: The app currently uses placeholder "P" letters for logos.

### Required Logo Files
- `logo-full.png` - Full logo with text
- `logo-mark.png` - Icon/mark only (circular)

### Where to Update
Place logos in `public/` folder and update these files:
- `src/pages/Start.tsx` (line 14)
- `src/pages/Login.tsx` (line 42)
- `src/pages/Signup.tsx` (line 125)
- `src/components/Navbar.tsx` (line 19)
- `src/pages/QuickChat.tsx` (line 22)

Example:
```tsx
<img 
  src="/logo-mark.png" 
  alt="PulseLink AI Logo" 
  className="w-24 h-24 object-contain"
/>
```

## 🧪 Testing Features

### OTP Verification
1. Sign up with valid details
2. Check browser console for OTP codes
3. Enter both phone and email OTPs to proceed

### Doctor Search
1. Try pincode: `400050` (has results)
2. Try pincode: `999999` (triggers fallback modal)
3. Filter by specialization (Cardiology, Dermatology, etc.)

### Appointment Booking
1. Select a doctor
2. Choose date (only available dates are selectable)
3. Select time slot
4. Confirm & Pay button activates
5. Mock confirmation shows summary

## 📱 Keyboard Shortcuts

- **Chat Input**: 
  - `Enter` to send message
  - `Shift + Enter` for new line

## 🎯 Accessibility

- ARIA labels on interactive elements
- Keyboard-navigable forms and buttons
- Semantic HTML structure
- Focus management in modals
- Screen reader friendly

## 🔐 Security Notes (Production)

Before deploying to production:
- Implement proper password hashing (bcrypt, argon2)
- Use HTTPS for all communications
- Store JWT tokens securely (httpOnly cookies)
- Implement rate limiting for OTP requests
- Add CSRF protection
- Validate all inputs server-side
- Implement proper session management

## 📝 Environment Variables

Create `.env` file for production:
```
VITE_API_URL=https://your-api-url.com
VITE_PAYMENT_KEY=your-payment-key
VITE_SMS_API_KEY=your-sms-api-key
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Known Limitations

- Mock data only (no real backend)
- OTP codes shown in console (for testing)
- No actual payment processing
- File uploads are UI-only
- Voice & camera features are placeholders
- Chat AI responses are static

## 📚 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📸 Screenshots

(Add screenshots here showing key features)

---

**Made with ❤️ for healthcare**
