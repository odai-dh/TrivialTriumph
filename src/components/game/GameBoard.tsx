'use client';

import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
  const validCategories = categories.filter(c => c.title && c.questions.length > 0);

  return (
    <div className="grid gap-2 sm:gap-4" style={{ gridTemplateColumns: `repeat(${validCategories.length}, minmax(0, 1fr))` }}>
      {validCategories.map((category, catIndex) => (
        <div key={category.title + catIndex} className="flex flex-col gap-2 sm:gap-4">
          <Card className="h-24 sm:h-32 flex items-center justify-center p-2 bg-primary text-primary-foreground shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-xl md:text-2xl text-center break-word">{category.title.toUpperCase()}</CardTitle>
            </CardHeader>
          </Card>
          {pointValues.map((value, qIndex) => {
            const questionId = `${category.title}-${value}`;
            const isAnswered = answeredQuestions.includes(questionId);
            const questionExists = category.questions.find(q => q.value === value);

            return (
              <Button
                key={questionId}
                variant="default"
                className={`h-16 sm:h-20 text-xl sm:text-3xl font-bold shadow-md transition-all duration-300 transform hover:scale-105 ${
                  isAnswered ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50 hover:bg-muted' : 'bg-card text-card-foreground hover:bg-secondary'
                }`}
                style={{backgroundColor: isAnswered ? '' : 'hsl(var(--card))', color: isAnswered ? '' : 'hsl(var(--accent))'}}
                onClick={() => onQuestionSelect(categories.findIndex(c => c.title === category.title), qIndex)}
                disabled={isAnswered || !questionExists}
              >
                ${value}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
