# Trivial Triumph 🎯

An interactive Jeopardy-style trivia game powered by AI question generation.

## Features

- 🎮 **Multiple Players** - Support for up to 8 players
- 🤖 **AI-Generated Questions** - Uses Google's Gemini AI to create unique trivia
- 🎨 **Modern UI** - Beautiful, animated interface with dark mode support
- 💾 **Auto-Save** - Game state persists in localStorage
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## Tech Stack

- **Framework:** Next.js 15 with React 19
- **AI:** Firebase Genkit + Google Gemini 2.0 Flash
- **Styling:** Tailwind CSS + shadcn/ui components
- **Language:** TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:odai-dh/TrivialTriumph.git
cd TrivialTriumph
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Google AI API key to `.env.local`:
```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## How to Play

1. **Setup:** Add players and select 5 categories
2. **Generate:** Click to generate AI-powered trivia questions
3. **Play:** Click question values to reveal clues
4. **Score:** Award or deduct points based on answers
5. **Win:** Highest score at the end wins!

## License

MIT

## Author

Created by Odai