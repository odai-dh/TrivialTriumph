'use client';

import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';

interface GameBoardProps {
  categories: Category[];
  answeredQuestions: string[];
  pointValues: number[];
  onQuestionSelect: (catIndex: number, qIndex: number) => void;
}

export default function GameBoard({
  categories,
  answeredQuestions,
  pointValues,
  onQuestionSelect,
}: GameBoardProps) {
  const validCategories = categories
    .map((category, catIndex) => ({ category, catIndex }))
    .filter(({ category }) => category.title && category.questions.length > 0);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div
        className="grid min-w-[600px] gap-3 sm:min-w-full"
        style={{ 
          gridTemplateColumns: `repeat(${validCategories.length || 1}, 1fr)`,
        }}
      >
        {validCategories.map(({ category, catIndex }) => (
          <div key={`${category.title}-${catIndex}`} className="flex flex-col gap-2">
            <Card className="group relative flex min-h-[70px] items-center justify-center overflow-hidden rounded-xl border-2 border-primary/60 bg-gradient-to-br from-primary via-primary to-primary/80 p-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex w-full items-center justify-center gap-2 px-2 text-center">
                <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse-slow text-white" />
                <h3 className="text-[11px] font-bold uppercase leading-tight tracking-wide text-white drop-shadow-lg sm:text-xs">
                  {category.title}
                </h3>
              </div>
            </Card>
            
            {pointValues.map((value, qIndex) => {
              const questionId = `${category.title}-${value}`;
              const isAnswered = answeredQuestions.includes(questionId);
              const questionExists = category.questions.find((q) => q.value === value);
              
              return (
                <Button
                  key={questionId}
                  variant="secondary"
                  className={cn(
                    'group relative flex h-16 items-center justify-center overflow-hidden rounded-xl border-2 text-xl font-bold shadow-md transition-all duration-300',
                    isAnswered
                      ? 'cursor-not-allowed border-border/40 bg-muted/50 text-muted-foreground opacity-60'
                      : 'border-primary/30 bg-gradient-to-br from-card via-white to-card hover-lift hover:scale-105 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 active:scale-95'
                  )}
                  onClick={() => onQuestionSelect(catIndex, qIndex)}
                  disabled={isAnswered || !questionExists}
                >
                  {!isAnswered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  )}
                  <span className={cn('relative z-10 flex items-center gap-2', isAnswered && 'text-sm')}>
                    {isAnswered ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-medium">Claimed</span>
                      </>
                    ) : (
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:scale-110">
                        ${value}
                      </span>
                    )}
                  </span>
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}