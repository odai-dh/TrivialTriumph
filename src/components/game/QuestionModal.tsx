'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ActiveQuestion } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Sparkles, Lightbulb } from 'lucide-react';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: ActiveQuestion | null;
}

export default function QuestionModal({ isOpen, onClose, questionData }: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowAnswer(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!questionData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl rounded-3xl border-2 border-border/70 bg-gradient-to-br from-background via-background to-primary/5 p-0 shadow-2xl">
        <div className="flex flex-col gap-6 p-8">
          <DialogHeader className="space-y-4 text-center">
            <Badge className="mx-auto w-fit gap-2 bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="h-4 w-4" />
              {questionData.categoryTitle}
            </Badge>
            <DialogTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-extrabold text-transparent">
              ${questionData.value}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Read the clue, then reveal the answer when ready to award points.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-[160px] items-center justify-center rounded-2xl border-2 border-border/70 bg-white/90 p-8 text-center shadow-inner dark:bg-slate-900/80">
            <p className="text-2xl font-semibold leading-relaxed text-foreground">
              {questionData.question}
            </p>
          </div>

          {showAnswer && (
            <Card className="animate-in fade-in-50 slide-in-from-top-4 rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-emerald-100/80 shadow-lg dark:from-emerald-900/40 dark:via-emerald-900/30 dark:to-emerald-900/20">
              <CardContent className="space-y-3 p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                  <Lightbulb className="h-5 w-5" />
                  Correct Response
                </div>
                <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-200">
                  {questionData.answer}
                </p>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!showAnswer ? (
              <Button 
                size="lg" 
                className="h-12 w-full rounded-full px-8 sm:w-auto" 
                onClick={() => setShowAnswer(true)}
              >
                <Lightbulb className="mr-2 h-5 w-5" />
                Reveal Answer
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="h-12 w-full rounded-full px-8 sm:w-auto" 
                onClick={onClose}
              >
                Close &amp; Award Points
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}