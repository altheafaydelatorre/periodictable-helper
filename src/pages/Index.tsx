
import React from 'react';
import CryptogramHelper from '@/components/CryptogramHelper';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#FFA500] to-[#FF8C00] p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-1 text-white">Cryptogram Helper</h1>
        <p className="text-white/80 mb-6 text-center">
          Solve and create letter substitution puzzles
        </p>
          
        <CryptogramHelper />
        
        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-lg text-white/90">
          <h2 className="font-bold text-lg mb-2">How to Use the Cryptogram Helper</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>In Solve Mode, try to guess which letter each cipher symbol represents</li>
            <li>Type your guesses in the boxes below each cipher letter</li>
            <li>Use the hint button if you get stuck</li>
            <li>Switch to Create Mode to make your own cryptogram puzzles</li>
            <li>Share the encrypted message with friends to solve</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
