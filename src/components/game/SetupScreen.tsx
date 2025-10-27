'use client';

import { useState, ChangeEvent } from 'react';
import type { Player, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Plus, Users, BrainCircuit, Play, RefreshCw, Loader2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    if (newPlayerName.trim() && players.length < 8) {
      onPlayersChange([...players, { name: newPlayerName.trim(), score: 0 }]);
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    onPlayersChange(players.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    const oldCategory = newCategories[index];
  
    // Find a category that is not currently selected
    const getAvailableCategory = () => {
      let newCategoryTitle = value;
      let i = 0;
      while (newCategories.some((c, idx) => idx !== index && c.title === newCategoryTitle)) {
        newCategoryTitle = sampleCategories[ (sampleCategories.indexOf(value) + i + 1) % sampleCategories.length];
        i++;
      }
      return newCategoryTitle;
    };
  
    if (newCategories.some((c, idx) => idx !== index && c.title === value)) {
        // If the selected category is already in use, try to find a replacement
        const replacement = getAvailableCategory();
        newCategories[index] = { ...newCategories[index], title: replacement };
    } else {
        newCategories[index] = { ...newCategories[index], title: value };
    }

    onCategoriesChange(newCategories);
  };
  
  const hasQuestions = categories.some(c => c.questions.length > 0);
  const usedCategories = categories.map(c => c.title);

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <TrivialTriumphLogo className="w-64 h-auto text-primary" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><Users className="mr-3 h-7 w-7 text-primary" /> Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newPlayerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                disabled={players.length >= 8}
              />
              <Button onClick={handleAddPlayer} disabled={players.length >= 8} size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                  <span className="font-medium text-secondary-foreground">{player.name}</span>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemovePlayer(index)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><BrainCircuit className="mr-3 h-7 w-7 text-primary" /> Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose up to 5 categories.
            </p>
            {categories.map((category, index) => (
              <div key={index}>
                <Label htmlFor={`category-${index}`} className="sr-only">Category {index + 1}</Label>
                <Select
                  value={category.title}
                  onValueChange={(value) => handleCategoryChange(index, value)}
                >
                  <SelectTrigger id={`category-${index}`}>
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
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-xl">
        <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                 <Button onClick={onGenerateQuestions} size="lg" className="w-full sm:w-auto" disabled={isGenerating}>
                    {isGenerating ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
                    ) : (
                        <><BrainCircuit className="mr-2 h-5 w-5" /> Generate Questions</>
                    )}
                </Button>
                 <Button onClick={onStartGame} size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={!hasQuestions || isGenerating}>
                    <Play className="mr-2 h-5 w-5" /> Start Game
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
