# Trivial Triumph 🎯

An interactive Jeopardy-style trivia game powered by AI question generation.

## Features

- 🎮 **Multiple Players** - Support for up to 8 players
- 🤖 **AI-Generated Questions** - Uses Hugging Face AI to create unique trivia
- 🎨 **Modern UI** - Beautiful, animated interface with dark mode support
- 💾 **Auto-Save** - Game state persists in localStorage
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## Tech Stack

- **Framework:** Next.js 15 with React 19
- **AI:** Hugging Face Inference API + Qwen2.5-72B-Instruct model
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

Add your Hugging Face API key to `.env.local`:
```
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002)

## Deploy to Netlify

### Quick Deploy

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variable:
   - **Key**: `HUGGINGFACE_API_KEY`
   - **Value**: Your Hugging Face API key
7. Click "Deploy site"

### Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Note**: Make sure to set your `HUGGINGFACE_API_KEY` environment variable in Netlify's site settings before deploying.

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