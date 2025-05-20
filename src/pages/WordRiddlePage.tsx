
import React from 'react';
import WordRiddleHelper from '@/components/WordRiddleHelper';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon } from "lucide-react";

const WordRiddlePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-amber-100 to-amber-200 p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <HomeIcon size={18} />
              Home
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-1 text-amber-800">Word Riddle Helper</h1>
        <p className="text-amber-700/80 mb-6 text-center">
          Tools to help you solve word puzzles and riddles
        </p>
          
        <WordRiddleHelper />
        
        <div className="mt-8 p-4 bg-amber-100/80 backdrop-blur-sm rounded-lg w-full max-w-lg text-amber-900">
          <h2 className="font-bold text-lg mb-2">How to Use the Word Riddle Helper</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Riddle Analyzer:</strong> Enter a riddle to get word suggestions</li>
            <li><strong>Anagram Solver:</strong> Rearrange letters to find possible words</li>
            <li><strong>Pattern Matcher:</strong> Find words matching a specific pattern</li>
            <li>Try different approaches for the best results</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default WordRiddlePage;
