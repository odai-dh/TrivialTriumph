'use client';

import type { Player, Category, ActiveQuestion } from '@/lib/types';
import GameBoard from './GameBoard';
import ScoringPanel from './ScoringPanel';
import QuestionModal from './QuestionModal';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"


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
  return (
    <div className="flex flex-col gap-8 h-full">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <TrivialTriumphLogo className="w-48 h-auto text-primary" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg">
              <RefreshCw className="mr-2 h-5 w-5" /> Reset Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all scores, players, and questions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onResetGame}>Reset Game</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <GameBoard
          categories={categories}
          answeredQuestions={answeredQuestions}
          pointValues={pointValues}
          onQuestionSelect={onQuestionSelect}
        />
        <ScoringPanel
          players={players}
          questionValue={activeQuestion?.value ?? lastQuestionValue ?? 0}
          onScoreUpdate={onScoreUpdate}
        />
      </div>

      <QuestionModal
        isOpen={!!activeQuestion}
        onClose={onCloseQuestion}
        questionData={activeQuestion}
      />
    </div>
  );
}
