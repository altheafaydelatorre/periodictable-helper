
import React from 'react';
import CryptogramHelper from '@/components/CryptogramHelper';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PuzzleIcon, AtomIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FFA500] to-[#FF8C00] p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <div className="w-full flex justify-end gap-2 mb-4">
          <Link to="/periodic-table">
            <Button variant="secondary" className="flex items-center gap-2">
              <AtomIcon size={18} />
              Periodic Table Helper
            </Button>
          </Link>
          <Link to="/word-riddles">
            <Button variant="secondary" className="flex items-center gap-2">
              <PuzzleIcon size={18} />
              Word Riddle Helper
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-1 text-white">Cryptogram Helper</h1>
        <p className="text-white/80 mb-6 text-center">
          Decode and encode letter substitution text
        </p>
          
        <CryptogramHelper />
        
        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-lg text-white/90">
          <h2 className="font-bold text-lg mb-2">How to Use the Cryptogram Helper</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>In <strong>Decode</strong> mode, enter encrypted text to decode</li>
            <li>Type your guesses for each cipher letter in the boxes</li>
            <li>See your decoded text update in real-time</li>
            <li>Switch to <strong>Encode</strong> mode to create your own encrypted messages</li>
            <li>Share the encrypted text with friends to decode</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
