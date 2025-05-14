
import React from 'react';
import ScrabbleHelper from '@/components/ScrabbleHelper';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-1">Scrabble Helper</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Find the best words for your Scrabble game
        </p>
          
        <ScrabbleHelper />
        
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full max-w-2xl">
          <h2 className="font-bold text-lg mb-2">How to Use Scrabble Helper</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Enter all your available letter tiles in the input field</li>
            <li>Click "Find Words" to get a list of possible words</li>
            <li>Words are sorted by Scrabble point value</li>
            <li>Choose the best word for your game situation!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
