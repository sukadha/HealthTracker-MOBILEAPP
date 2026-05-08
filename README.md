# 🌱 TRACK — Habit Building App

A personal habit-tracking mobile app built with **React Native** and **Expo**. Build streaks, stay consistent, and become the best version of yourself — one small habit at a time.

---

## 📸 Screenshots

<div align="center">
  <img src="Screenshot 2026-05-08 165136.png" alt="Calculator" width="200" />
  <img src="Screenshot 2026-05-08 165350.png" alt="Calculator" width="200" />
  <img src="Screenshot 2026-05-08 165411.png" alt="Calculator" width="200" />
  <img src="Screenshot 2026-05-08 165419.png" alt="Calculator" width="200" />   
</div>



## 📱 Features

- ✅ Track daily habits and build streaks
- 🔔 Push notifications (iOS & Android)
- ⏰ Daily reminders at 9:00 AM
- 🌙 Dark mode support
- ⭐ In-app rating system
- 🔒 Privacy Policy & Terms of Service
- 🚪 Logout / onboarding flow

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile UI framework |
| Expo | Build & development toolchain |
| Expo Router | File-based navigation |
| expo-notifications | Push & scheduled notifications |
| expo-device | Device detection for notification guards |
| TypeScript | Type safety |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- iOS Simulator / Android Emulator **or** a physical device with Expo Go

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/track-app.git
cd track-app

# 2. Install dependencies
npm install

# 3. Install notification packages
npx expo install expo-notifications expo-device

# 4. Start the development server
npx expo start
```

---

## 🔔 Push Notifications Setup

Push notifications use `expo-notifications` and **only work on real physical devices** (iOS & Android). They are not supported in the browser (Expo Web).

### How it works

| Trigger | Behavior |
|---|---|
| Toggle "Push Notifications" ON | Requests OS permission, sends an immediate confirmation notification |
| Toggle "Daily Reminders" ON | Schedules a repeating notification every day at **9:00 AM** |
| Toggle either OFF | Cancels all scheduled notifications |

### Platform support

| Platform | Push Notifications |
|---|---|
| Android (Expo Go) | ✅ Fully supported |
| iOS (Dev Build) | ✅ Fully supported |
| iOS (Expo Go) | ⚠️ Immediate notifications work; scheduled triggers limited |
| Web / Browser | ❌ Not supported — shows a friendly alert instead |

### Android Notification Channel

On Android, a dedicated notification channel called **"Habit Reminders"** is created automatically with:
- High importance
- Vibration pattern enabled
- Accent color: `#4A90D9`

---

## 📁 Project Structure

```
track-app/
├── app/
│   ├── index.tsx          # Welcome / onboarding screen
│   ├── settings.tsx       # Settings screen (this file)
│   └── ...                # Other screens
├── assets/                # Images, icons, fonts
├── components/            # Reusable UI components
├── app.json               # Expo configuration
├── package.json
└── README.md
```

---

## ⚙️ Settings Screen Overview

The Settings screen (`settings.tsx`) includes:

### Preferences (Toggles)
- **Push Notifications** — Requests device permission and fires a live notification on enable
- **Dark Mode** — Switches the UI between light and dark themes
- **Daily Reminders** — Schedules a recurring 9:00 AM habit reminder

### Information (Modals)
- **About** — App version and description
- **Privacy Policy** — Data usage and storage details
- **Terms of Service** — Usage terms and conditions
- **Rate App** — Interactive 5-star rating UI

### Actions
- **Log Out** — Confirmation dialog, navigates back to the welcome screen

---

## 🔧 Customizing the Reminder Time

To change the daily reminder time, update the `scheduleDailyReminder` function in `settings.tsx`:

```typescript
trigger: {
  hour: 9,    // Change this (0–23)
  minute: 0,  // Change this (0–59)
  repeats: true,
},
```

---

## 🧪 Testing Notifications

1. Run the app on a **physical device** using Expo Go
2. Open **Settings** in the app
3. Toggle **Push Notifications** ON
4. Accept the permission prompt
5. You should receive a notification immediately: *"🔔 Notifications Enabled!"*
6. Toggle **Daily Reminders** ON to schedule the 9:00 AM daily notification

> 💡 To test scheduled notifications quickly, temporarily change the trigger `hour` and `minute` to a time a few minutes from now.

---

## 🔐 Privacy

- All data is stored **locally on the device** — nothing is sent to external servers
- No personal identifying information is collected
- Notifications are scheduled locally using `expo-notifications` — no remote push server required
- Full privacy policy is available inside the app under **Settings → Privacy Policy**

---

## 📄 License

```
© 2026 TRACK App. All rights reserved.
```

---

## 💬 Contact

| Purpose | Email |
|---|---|
| Privacy inquiries | privacy@trackapp.io |
| Legal inquiries | legal@trackapp.io |
| General support | support@trackapp.io |

---

> Built with ❤️ using React Native & Expo. Designed to be simple, beautiful, and distraction-free.
