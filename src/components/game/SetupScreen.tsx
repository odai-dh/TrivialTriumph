'use client';

import { useState, ChangeEvent } from 'react';
import type { Player, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Plus,
  Users,
  BrainCircuit,
  Play,
  RefreshCw,
  Loader2,
  Sparkles,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sampleCategories } from '@/lib/sample-categories';

interface SetupScreenProps {
  players: Player[];
  categories: Category[];
  isGenerating: boolean;
  onPlayersChange: (players: Player[]) => void;
  onCategoriesChange: (categories: Category[]) => void;
  onGenerateQuestions: () => void;
  onStartGame: () => void;
  onResetGame: () => void;
}

const MAX_PLAYERS = 8;

export default function SetupScreen({
  players,
  categories,
  isGenerating,
  onPlayersChange,
  onCategoriesChange,
  onGenerateQuestions,
  onStartGame,
  onResetGame,
}: SetupScreenProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < MAX_PLAYERS) {
      onPlayersChange([...players, { name: newPlayerName.trim(), score: 0 }]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    onPlayersChange(players.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    
    // Check if this value is already used by another category
    const isDuplicate = newCategories.some((c, idx) => idx !== index && c.title === value);
    
    if (isDuplicate) {
      // Find first available category
      const usedTitles = new Set(newCategories.map((c, idx) => idx !== index ? c.title : ''));
      const available = sampleCategories.find(cat => !usedTitles.has(cat));
      
      if (available) {
        newCategories[index] = { ...newCategories[index], title: available };
      }
    } else {
      newCategories[index] = { ...newCategories[index], title: value };
    }

    onCategoriesChange(newCategories);
  };

  const hasQuestions = categories.some((c) => c.questions.length > 0);
  const usedCategories = categories.map((c) => c.title);
  const remainingSlots = MAX_PLAYERS - players.length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-background/80 px-6 py-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <TrivialTriumphLogo className="h-auto w-52 text-primary sm:w-64" />
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Add your players, pick five distinct categories, then generate the board. The game logic stays untouched—
            we’ve simply streamlined the host controls.
          </p>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <Badge variant="secondary" className="gap-2">
              <Users className="h-4 w-4" />
              {players.length} / {MAX_PLAYERS} players ready
            </Badge>
            <Badge variant="outline" className="gap-2">
              <BrainCircuit className="h-4 w-4" />
              {usedCategories.filter(Boolean).length} categories selected
            </Badge>
            <Badge variant="outline" className="gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              {remainingSlots > 0 ? `${remainingSlots} slots left` : 'Lobby full'}
            </Badge>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="h-12 rounded-full px-6">
              <RefreshCw className="mr-2 h-5 w-5" />
              Reset Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset the game?</AlertDialogTitle>
              <AlertDialogDescription>
                Players, scores, and generated questions will be cleared. You cannot undo this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onResetGame}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="border-border/60 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </span>
              Players
            </CardTitle>
            <CardDescription>
              Add up to eight contestants. Press Enter or the button to drop them into the roster.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
              <Input
                type="text"
                value={newPlayerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlayerName(e.target.value)}
                placeholder={remainingSlots > 0 ? 'Enter player name…' : 'Player limit reached'}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                disabled={players.length >= MAX_PLAYERS}
                className="h-11 flex-1 rounded-full bg-white/80 px-4"
              />
              <Button
                onClick={handleAddPlayer}
                disabled={players.length >= MAX_PLAYERS}
                size="lg"
                className="h-11 rounded-full px-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add
              </Button>
            </div>

            <ScrollArea className="max-h-64 pr-2">
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-white px-4 py-3 shadow-sm transition hover:border-primary/40 dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{player.name.slice(0, 2).toUpperCase() || 'P'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{player.name}</p>
                        <p className="text-xs uppercase text-muted-foreground">Slot {index + 1}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemovePlayer(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {players.length === 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-white px-4 py-5 text-sm text-muted-foreground dark:border-slate-700 dark:bg-slate-900/70">
                    <Sparkles className="h-4 w-4 text-primary" />
                    No players yet—add a name to seed the roster.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
                <BrainCircuit className="h-5 w-5" />
              </span>
              Categories
            </CardTitle>
            <CardDescription>
              Choose five unique topics. Selecting a duplicate automatically nudges to the next available option.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {usedCategories.map((category, index) => (
                <Badge key={`${category}-${index}`} variant="outline" className="border-border/70">
                  {category || `Category ${index + 1}`}
                </Badge>
              ))}
            </div>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="rounded-xl border border-border/70 bg-white/90 p-3 dark:bg-slate-900/70">
                  <Label htmlFor={`category-${index}`} className="pb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Category {index + 1}
                  </Label>
                  <Select value={category.title} onValueChange={(value) => handleCategoryChange(index, value)}>
                    <SelectTrigger id={`category-${index}`} className="h-11 rounded-lg px-3 text-sm font-medium">
                      <SelectValue placeholder={`Category ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleCategories.map((sampleCat) => (
                        <SelectItem
                          key={sampleCat}
                          value={sampleCat}
                          disabled={usedCategories.includes(sampleCat) && category.title !== sampleCat}
                        >
                          {sampleCat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Generate the game board</h3>
            <p className="text-sm text-muted-foreground">
              Generate questions first, then launch the board when every category is locked in.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={onGenerateQuestions}
              size="lg"
              className="h-11 rounded-full px-6"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Generate Questions
                </>
              )}
            </Button>
            <Button
              onClick={onStartGame}
              size="lg"
              className="h-11 rounded-full px-6"
              disabled={!hasQuestions || isGenerating}
            >
              <Play className="mr-2 h-4 w-4" />
              Launch Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
