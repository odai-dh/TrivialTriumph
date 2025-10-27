'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateJeopardyQuestions } from '@/ai/flows/generate-jeopardy-questions';
import type { Player, Category, GameState, ActiveQuestion } from '@/lib/types';
import SetupScreen from '@/components/game/SetupScreen';
import GameScreen from '@/components/game/GameScreen';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import TrivialTriumphLogo from '@/components/game/TrivialTriumphLogo';
import { sampleCategories } from '@/lib/sample-categories';

const initialGameState: GameState = {
  players: [{ name: 'Player 1', score: 0 }],
  categories: sampleCategories.slice(0, 5).map(title => ({ title, questions: [] })),
  answeredQuestions: [],
  gamePhase: 'setup',
};

const pointValues = [100, 200, 300, 400, 500];

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  const [lastQuestionValue, setLastQuestionValue] = useState<number | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const savedState = localStorage.getItem('trivialTriumphState');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Ensure there are always 5 categories, even if saved state has fewer
          if (parsedState.categories.length < 5) {
            const existingTitles = parsedState.categories.map(c => c.title);
            const additionalCategories = sampleCategories
              .filter(sc => !existingTitles.includes(sc))
              .slice(0, 5 - parsedState.categories.length)
              .map(title => ({ title, questions: [] }));
            parsedState.categories.push(...additionalCategories);
          }
          setGameState(parsedState);
        } else {
            setGameState(initialGameState);
        }
      } catch (error) {
        console.error('Could not load game state from localStorage', error);
        setGameState(initialGameState);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && !isLoading) {
      try {
        localStorage.setItem('trivialTriumphState', JSON.stringify(gameState));
      } catch (error) {
        console.error('Could not save game state to localStorage', error);
      }
    }
  }, [gameState, isClient, isLoading]);

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...newState }));
  };

  const handlePlayersChange = (newPlayers: Player[]) => {
    updateGameState({ players: newPlayers });
  };

  const handleCategoriesChange = (newCategories: Category[]) => {
    updateGameState({ categories: newCategories });
  };

  const handleGenerateQuestions = async () => {
    const validCategories = gameState.categories.filter((c) => c.title.trim() !== '');
    if (validCategories.length === 0) {
      toast({
        title: 'No Categories',
        description: 'Please select at least one category.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedCategories = await Promise.all(
        validCategories.map(async (category) => {
          if (category.questions.length > 0) return category; // Don't re-generate if questions exist
          const questions = await generateJeopardyQuestions({ category: category.title });
          const sortedQuestions = questions.sort((a, b) => a.value - b.value);
          return { title: category.title, questions: sortedQuestions };
        })
      );
      
      const allCategories = gameState.categories.map(c => {
        const found = generatedCategories.find(gc => gc.title === c.title);
        return found || c;
      });

      updateGameState({ categories: allCategories });
      const newlyGeneratedCount = generatedCategories.filter(c => c.questions.length > 0).length;
      toast({
        title: 'Success!',
        description: `Generated questions for ${newlyGeneratedCount} categor${newlyGeneratedCount > 1 ? 'ies' : 'y'}.`,
      });
    } catch (error) {
      console.error('Failed to generate questions:', error);
      toast({
        title: 'Error',
        description: 'Could not generate questions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartGame = () => {
    if (gameState.categories.every((c) => c.questions.length === 0)) {
      toast({
        title: 'No Questions',
        description: 'Please generate questions before starting the game.',
        variant: 'destructive',
      });
      return;
    }
    updateGameState({ gamePhase: 'game' });
  };

  const handleQuestionSelect = (catIndex: number, qIndex: number) => {
    const question = gameState.categories[catIndex]?.questions?.[qIndex];
    if (question) {
      setActiveQuestion({ ...question, categoryTitle: gameState.categories[catIndex].title });
      setLastQuestionValue(question.value);
    }
  };

  const handleCloseQuestion = () => {
    if (activeQuestion) {
      const questionId = `${activeQuestion.categoryTitle}-${activeQuestion.value}`;
      if (!gameState.answeredQuestions.includes(questionId)) {
        updateGameState({ answeredQuestions: [...gameState.answeredQuestions, questionId] });
      }
    }
    setActiveQuestion(null);
  };
  
  const handleScoreUpdate = (playerIndex: number, amount: number) => {
    const newPlayers = [...gameState.players];
    newPlayers[playerIndex].score += amount;
    updateGameState({ players: newPlayers });
  };

  const handleResetGame = () => {
    if (isClient) {
      localStorage.removeItem('trivialTriumphState');
    }
    setGameState(initialGameState);
    setActiveQuestion(null);
    setLastQuestionValue(null);
    toast({
        title: 'Game Reset',
        description: 'A new game has been started.',
    });
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center gap-4">
          <TrivialTriumphLogo className="w-48 h-auto text-primary" />
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-foreground">Loading Game...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      {gameState.gamePhase === 'setup' ? (
        <SetupScreen
          players={gameState.players}
          categories={gameState.categories}
          onPlayersChange={handlePlayersChange}
          onCategoriesChange={handleCategoriesChange}
          onGenerateQuestions={handleGenerateQuestions}
          onStartGame={handleStartGame}
          isGenerating={isGenerating}
          onResetGame={handleResetGame}
        />
      ) : (
        <GameScreen
          players={gameState.players}
          categories={gameState.categories}
          answeredQuestions={gameState.answeredQuestions}
          activeQuestion={activeQuestion}
          lastQuestionValue={lastQuestionValue}
          pointValues={pointValues}
          onQuestionSelect={handleQuestionSelect}
          onCloseQuestion={handleCloseQuestion}
          onScoreUpdate={handleScoreUpdate}
          onResetGame={handleResetGame}
        />
      )}
    </main>
  );
}
