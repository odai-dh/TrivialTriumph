export interface Player {
  name: string;
  score: number;
}

export interface Question {
  question: string;
  answer: string;
  value: number;
}

export interface Category {
  title: string;
  questions: Question[];
}

export interface ActiveQuestion extends Question {
    categoryTitle: string;
}

export interface GameState {
  players: Player[];
  categories: Category[];
  answeredQuestions: string[]; // e.g., ["CategoryTitle-100"]
  gamePhase: 'setup' | 'game';
}
