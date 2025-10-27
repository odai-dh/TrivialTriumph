'use client';

import type { Player, Category, ActiveQuestion } from '@/lib/types';
import GameBoard from './GameBoard';
import ScoringPanel from './ScoringPanel';
import QuestionModal from './QuestionModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Sparkles, Trophy, Target } from 'lucide-react';
import TrivialTriumphLogo from './TrivialTriumphLogo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface GameScreenProps {
  players: Player[];
  categories: Category[];
  answeredQuestions: string[];
  activeQuestion: ActiveQuestion | null;
  lastQuestionValue: number | null;
  pointValues: number[];
  onQuestionSelect: (catIndex: number, qIndex: number) => void;
  onCloseQuestion: () => void;
  onScoreUpdate: (playerIndex: number, amount: number) => void;
  onResetGame: () => void;
}

export default function GameScreen({
  players,
  categories,
  answeredQuestions,
  activeQuestion,
  lastQuestionValue,
  pointValues,
  onQuestionSelect,
  onCloseQuestion,
  onScoreUpdate,
  onResetGame,
}: GameScreenProps) {
  const activeValue = activeQuestion?.value ?? lastQuestionValue ?? 0;
  const totalAnswered = answeredQuestions.length;
  const totalQuestions = categories.reduce((count, category) => count + category.questions.length, 0);
  const topScore = players.length > 0 ? Math.max(...players.map((player) => player.score)) : 0;
  const leader = players.find((player) => player.score === topScore);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border-2 border-border/70 bg-white/95 px-6 py-5 shadow-lg backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <TrivialTriumphLogo className="h-auto w-48" />
          <Badge variant="outline" className="hidden sm:flex">Live Game</Badge>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="h-11 rounded-full px-6">
              <RefreshCw className="mr-2 h-5 w-5" />
              Reset Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset the game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear the board, players, and scores immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onResetGame}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-2 border-border/60 bg-white/95 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
              <Target className="h-4 w-4 text-primary" />
              Active Value
            </div>
            <div className="text-3xl font-extrabold text-primary">${activeValue}</div>
            <div className="text-xs text-muted-foreground">Last clue selected</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border/60 bg-white/95 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Progress
            </div>
            <div className="text-3xl font-extrabold text-amber-500">{totalAnswered}/{totalQuestions}</div>
            <div className="text-xs text-muted-foreground">Clues answered</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-border/60 bg-white/95 shadow-md dark:border-slate-700 dark:bg-slate-900/80">
          <CardContent className="flex flex-col gap-2 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
              <Trophy className="h-4 w-4 text-amber-500" />
              Current Leader
            </div>
            <div className="truncate text-2xl font-extrabold text-foreground">{leader ? leader.name : '—'}</div>
            <div className="text-xs text-muted-foreground">
              {leader ? `$${leader.score}` : 'No scores yet'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card className="border-2 border-border/60 bg-white/95 p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
          <GameBoard
            categories={categories}
            answeredQuestions={answeredQuestions}
            pointValues={pointValues}
            onQuestionSelect={onQuestionSelect}
          />
        </Card>
        <div>
          <ScoringPanel players={players} questionValue={activeValue} onScoreUpdate={onScoreUpdate} />
        </div>
      </div>

      <QuestionModal isOpen={!!activeQuestion} onClose={onCloseQuestion} questionData={activeQuestion} />
    </div>
  );
}