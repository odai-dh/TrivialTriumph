'use client';

import { Player } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, Minus, Crown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoringPanelProps {
  players: Player[];
  questionValue: number;
  onScoreUpdate: (playerIndex: number, amount: number) => void;
}

export default function ScoringPanel({ players, questionValue, onScoreUpdate }: ScoringPanelProps) {
  const highestScore = players.length > 0 ? Math.max(...players.map((player) => player.score)) : 0;
  const canAdjustScore = questionValue !== 0;

  return (
    <Card className="rounded-2xl border-2 border-border/70 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
      <CardHeader className="space-y-2 border-b border-border/50 pb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          Scoreboard
        </CardTitle>
        <CardDescription>
          Adjust scores using the active clue value ({questionValue > 0 ? `$${questionValue}` : 'select a clue'}).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {players.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-5 text-center text-sm text-muted-foreground dark:border-slate-700">
            Add players on the setup screen to begin tracking scores.
          </div>
        ) : (
          players.map((player, index) => {
            const isLeader = highestScore !== 0 && player.score === highestScore;

            return (
              <div
                key={index}
                className={cn(
                  'group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border-2 px-4 py-3 shadow-md transition-all duration-300',
                  isLeader
                    ? 'border-amber-400/60 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 hover:shadow-lg hover:shadow-amber-200 dark:from-amber-500/10 dark:via-yellow-500/10 dark:to-amber-500/10 dark:border-amber-500/40'
                    : 'border-border/60 bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 dark:border-slate-700 dark:bg-slate-900/75 dark:hover:border-primary/30'
                )}
              >
                {isLeader && (
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-amber-200/30 to-transparent dark:via-amber-400/20" />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold uppercase shadow-inner transition-all duration-300 group-hover:scale-110',
                      isLeader
                        ? 'animate-pulse-slow bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-amber-300'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {player.name.slice(0, 2).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                      {player.name}
                      {isLeader && <Crown className="h-4 w-4 animate-bounce-subtle text-amber-500" aria-hidden="true" />}
                    </p>
                    <p className={cn(
                      'text-xs font-semibold uppercase',
                      isLeader ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
                    )}>
                      ${player.score}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full border-2 border-emerald-400 bg-emerald-50 text-emerald-600 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-200 disabled:opacity-40 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                    onClick={() => onScoreUpdate(index, questionValue)}
                    disabled={!canAdjustScore}
                    aria-label={`Add ${questionValue} points to ${player.name}`}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 rounded-full border-2 border-rose-400 bg-rose-50 text-rose-600 shadow-sm transition-all duration-300 hover:scale-110 hover:bg-rose-100 hover:shadow-md hover:shadow-rose-200 disabled:opacity-40 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                    onClick={() => onScoreUpdate(index, -questionValue)}
                    disabled={!canAdjustScore}
                    aria-label={`Subtract ${questionValue} points from ${player.name}`}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}