# Wake-Up Gallery Alarm 🚨📸

A viral alarm app that sends a random photo from your gallery to your family/friends group chat if you don't wake up on time.

## The Problem

Everyone struggles to wake up in the morning. Regular alarm clocks are too easy to snooze or ignore.

## The Solution

Social pressure! When you don't wake up on time, a random **embarrassing photo** from your gallery is sent to your selected group chat.

## Features ✨

### MVP (v1.0 - Current)
- ⏰ Set custom alarm time
- 📸 Upload embarrassing photos from your device
- 👀 Preview what will be sent
- 🔔 Real-time countdown to alarm
- 😊 "I WOKE UP!" button to cancel penalty
- 💥 Penalty screen with countdown
- 💾 Local storage persistence

### Coming Soon (v2.0)
- 📱 Actual WhatsApp integration for photo sending
- ⏰ Multiple alarms support
- 😴 Snooze feature (with increasing penalties)
- 📊 Streak tracking
- 👥 Leaderboard with friends

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: React Hooks
- **Storage**: localStorage
- **TypeScript**: Type-safe code
- **Icons**: Lucide React

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup

```bash
# Clone or download this project
cd wake-up-alarm

# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## How to Use

1. **Open the app** in your browser
2. **Set your alarm time** (e.g., 7:00 AM)
3. **Add embarrassing photos** (1-10 recommended)
4. **Preview** what will happen
5. **Click "Set Alarm"**
6. **Go to sleep**
7. **Wake up and click "I WOKE UP!" before alarm** → Success!
8. **Don't wake up** → Random photo sent to group chat 📸💥

## Project Structure

```
wake-up-alarm/
├── app/
│   ├── page.tsx          # Main app component
│   ├── layout.tsx         # Root layout
│   ├── globals.css         # Global styles
│   ├── lib/
│   │   └── storage.ts     # localStorage helpers
│   └── components/        # (for future components)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Safari (latest)
- ✅ Firefox (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- WhatsApp API integration for actual photo sharing
- Cloud backup of photos
- Multiple device sync
- Premium themes
- Group challenges
- Statistics dashboard

## License

MIT - Feel free to use and modify!

## Credits

Built with social accountability in mind. Wake up better, every morning! 🌅

---

**Version**: 1.0.0
**Last Updated**: February 1, 2026
