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
import { ActiveQuestion } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: ActiveQuestion | null;
}

export default function QuestionModal({ isOpen, onClose, questionData }: QuestionModalProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnswer(false);
    }
  }, [isOpen]);

  if (!questionData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full p-8 bg-background">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary text-center">
            {questionData.categoryTitle.toUpperCase()} for ${questionData.value}
          </DialogTitle>
        </DialogHeader>
        
        <div className="my-8 flex items-center justify-center min-h-[200px]">
          <p className="text-4xl text-center font-semibold text-foreground">
            {questionData.question}
          </p>
        </div>

        {showAnswer && (
          <Card className="bg-secondary mt-6 animate-in fade-in duration-500">
            <CardContent className="p-6">
                <p className="text-center text-3xl font-bold text-accent">
                    <span className="text-lg font-normal text-foreground block">Answer:</span>
                    {questionData.answer}
                </p>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="mt-8 sm:justify-center gap-4">
          {!showAnswer && (
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowAnswer(true)}>
              Reveal Answer
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={onClose}>
            Close & Award Points
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
