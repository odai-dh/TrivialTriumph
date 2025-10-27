# **App Name**: Trivial Triumph

## Core Features:

- Player Setup: Input and manage player names (up to 8).
- Category Management: Add and edit trivia categories.
- AI Question Generation: Generate trivia questions for each category using AI, following a Jeopardy-style format. Difficulty increases from 100 to 500 points. The LLM will act as a tool by deciding which pieces of knowledge and trivia to include in the output, or not.
- Game Board Display: Display the game board with categories as columns and point values as rows. Each cell represents a question.
- Question Reveal: Show the selected question and category in a modal or new view when a cell is clicked.
- Scoring System: Track player scores with visible list and increment/decrement buttons (+/-) to award or subtract points based on the current question's value.
- Local Storage Persistence: Save game progress in localStorage, including player names, scores, and generated questions, to resume the game later.

## Style Guidelines:

- Primary color: Vibrant blue (#3B82F6) to evoke a sense of intelligence and competition.
- Background color: Light blue (#E0F7FA) to provide a clean and engaging backdrop.
- Accent color: Yellow (#EAB308) for interactive elements and to highlight important information.
- Body and headline font: 'PT Sans' (sans-serif) for clear and accessible readability.
- Use a grid layout for the game board to clearly display categories and point values. Ensure all buttons are large and easy to click.
- Incorporate simple, clear icons to represent different actions, like awarding points.
- Subtle animations when revealing questions or updating scores to provide visual feedback.