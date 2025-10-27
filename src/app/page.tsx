'use client';

import { useState, useEffect } from 'react';
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
          if (parsedState.categories.length < 5) {
            const existingTitles = parsedState.categories.map((c: Category) => c.title);
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
    const validCategories = gameState.categories.filter((c: Category) => c.title.trim() !== '');
    if (validCategories.length === 0) {
      toast({
        title: 'No Categories',
        description: 'Please select at least one category.',
        variant: 'destructive',
      });
      return;
    }

    // Only generate for categories WITHOUT questions to save tokens
    const needsGeneration = validCategories.filter(c => c.questions.length === 0);
    
    if (needsGeneration.length === 0) {
      toast({
        title: 'Already Generated',
        description: 'All categories already have questions.',
      });
      return;
    }

    setIsGenerating(true);
    let successCount = 0;

    try {
      // Generate one at a time to avoid timeout and reduce token burst
      for (const category of needsGeneration) {
        try {
          const questions = await generateJeopardyQuestions({ category: category.title });
          const sortedQuestions = questions.sort((a, b) => a.value - b.value);
          
          // Update immediately after each category succeeds
          setGameState(prev => ({
            ...prev,
            categories: prev.categories.map(c => 
              c.title === category.title ? { ...c, questions: sortedQuestions } : c
            )
          }));
          
          successCount++;
          
          toast({
            title: `Generated: ${category.title}`,
            description: `${successCount}/${needsGeneration.length} complete`,
          });
          
        } catch (error) {
          console.error(`Failed: ${category.title}`, error);
          toast({
            title: 'Generation Failed',
            description: `Could not generate "${category.title}". Try again.`,
            variant: 'destructive',
          });
        }
      }
      
      if (successCount > 0) {
        toast({
          title: 'Complete!',
          description: `Generated ${successCount} categor${successCount > 1 ? 'ies' : 'y'}.`,
        });
      }
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
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-background via-background to-primary/5 p-8">
        <TrivialTriumphLogo className="h-auto w-64 animate-pulse-slow" />
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">Loading your game...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-7xl space-y-6">
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
      </div>
    </main>
  );
}