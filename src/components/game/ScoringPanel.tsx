'use client';

import { Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';

interface ScoringPanelProps {
  players: Player[];
  questionValue: number;
  onScoreUpdate: (playerIndex: number, amount: number) => void;
}

export default function ScoringPanel({ players, questionValue, onScoreUpdate }: ScoringPanelProps) {

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-card border"
            >
              <p className="text-lg font-semibold text-foreground truncate pr-2">{player.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent w-20 text-right">${player.score}</span>
                <div className="flex flex-col gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-green-100 hover:bg-green-200 text-green-700 border-green-300"
                    onClick={() => onScoreUpdate(index, questionValue)}
                    disabled={questionValue === 0}
                    aria-label={`Add ${questionValue} points to ${player.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
                    onClick={() => onScoreUpdate(index, -questionValue)}
                    disabled={questionValue === 0}
                    aria-label={`Subtract ${questionValue} points from ${player.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
