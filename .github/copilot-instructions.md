# Trivial Triumph - AI Coding Instructions

## Project Overview
Jeopardy-style trivia game with AI-generated questions. Built with Next.js 15 (App Router), React 19, Firebase Genkit, and Gemini 2.0 Flash. Game state persists in localStorage across sessions.

## Architecture & Data Flow

### State Management Pattern
- **Single source of truth**: `GameState` in `src/app/page.tsx` (client-side only with localStorage persistence)
- **State shape**: See `src/lib/types.ts` - `GameState` controls two phases: `'setup'` | `'game'`
- **Persistence**: Auto-saves to localStorage on every state change via `useEffect` hook
- **Question IDs**: Composite keys like `"CategoryTitle-100"` track answered questions in `answeredQuestions` array

### Component Architecture
```
page.tsx (state owner)
  ├── SetupScreen (setup phase)
  │   └── Category selection + player management
  └── GameScreen (game phase)
      ├── GameBoard (5x5 grid: categories × point values)
      ├── ScoringPanel (live player scores, +/- controls)
      └── QuestionModal (reveals question → answer flow)
```

### AI Integration (Token-Optimized)
- **Location**: `src/ai/flows/generate-jeopardy-questions.ts` (server action)
- **Model**: `gemini-2.0-flash-exp` (free tier, configured in `src/ai/genkit.ts`)
- **Token strategy**: 
  - Generate **sequentially** (one category at a time) to save tokens
  - Skip categories that already have questions
  - No retry logic to avoid double token usage
  - ~300 tokens per category = 1,500 tokens for full game (0.15% of daily quota)
- **Output validation**: Must return exactly 5 questions with values [100, 200, 300, 400, 500]
- **Prompt design**: Minimal, direct Jeopardy! format examples to reduce input tokens

## Critical Conventions

### Styling System (shadcn/ui + Custom Animations)
- **Color tokens**: Use HSL CSS variables from `globals.css` (e.g., `hsl(var(--primary))`)
- **Custom animations**: Defined in `@layer utilities` in `globals.css`:
  - `animate-float`, `animate-pulse-slow`, `animate-shimmer`, `animate-bounce-subtle`
  - `hover-lift`, `glow-primary`, `glow-accent` utility classes
- **Rounded corners**: Strategic use of `rounded-2xl`/`rounded-3xl` for modern look
- **Gradients**: `bg-gradient-to-br` patterns with primary/accent colors
- **Component pattern**: Always import from `@/components/ui/*`, use `cn()` from `@/lib/utils` for conditional classes

### Component Patterns
- **Client components**: All game components use `'use client'` directive (Next.js App Router requirement)
- **Modal state reset**: `QuestionModal` must reset `showAnswer` state in `useEffect` when closed (see bug fix history)
- **Disabled states**: Use `disabled={isAnswered || !questionExists}` pattern for question buttons
- **Leader highlighting**: Check `player.score === highestScore` and apply gold/amber styling with crown icon

### Development Workflow
```bash
# Primary dev server (runs on port 9002 with Turbopack)
npm run dev

# Genkit AI flow development & testing
npm run genkit:dev      # Start Genkit UI
npm run genkit:watch    # Auto-reload on changes

# Build & type checking
npm run build           # Production build
npm run typecheck       # TSC validation (note: next.config.ts has ignoreBuildErrors=true)
```

## Key Files & Patterns

### State Update Pattern (page.tsx)
```typescript
// Always use updateGameState helper to trigger localStorage save
const updateGameState = (newState: Partial<GameState>) => {
  setGameState((prev) => ({ ...prev, ...newState }));
};

// Sequential category generation (token-efficient)
for (const category of needsGeneration) {
  const questions = await generateJeopardyQuestions({ category: category.title });
  setGameState(prev => ({
    ...prev,
    categories: prev.categories.map(c => 
      c.title === category.title ? { ...c, questions: sortedQuestions } : c
    )
  }));
}
```

### AI Flow Pattern (generate-jeopardy-questions.ts)
```typescript
// 1. Define schemas with Zod
// 2. Create ai.definePrompt with structured I/O
// 3. Validate output (exact 5 questions, all point values present)
// 4. Sort by value before returning
```

### Responsive Grid Pattern (GameBoard.tsx)
```typescript
// Dynamic columns based on valid categories, min-width for mobile scroll
<div style={{ gridTemplateColumns: `repeat(${validCategories.length || 1}, 1fr)` }}>
```

## Important Constraints

1. **Token Budget**: Free tier Google AI limits (15 req/min, 1M tokens/day). Never add retry logic or parallel generation.
2. **No Server State**: All game state is client-side only. Server actions (`'use server'`) only for AI calls.
3. **Question Uniqueness**: Each category must have exactly one question per point value (100, 200, 300, 400, 500).
4. **LocalStorage**: Game survives page refresh but not browser data clear. No backend persistence.
5. **TypeScript**: Project has `ignoreBuildErrors: true` but strive to fix type errors properly.

## Common Pitfalls

- **Don't** use `Promise.all()` for question generation (wastes tokens)
- **Don't** forget to import `cn` utility when using conditional Tailwind classes
- **Don't** add `min-h` without allowing card expansion for long category titles
- **Don't** mutate state directly - always use `updateGameState()` or setter functions
- **Always** reset modal internal state (`showAnswer`) when modal closes
- **Always** sort questions by value after AI generation
