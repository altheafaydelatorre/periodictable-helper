
import React from 'react';
import MorseCodeHelper from '@/components/MorseCodeHelper';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB] p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-1 text-white">Morse Code Helper</h1>
        <p className="text-white/80 mb-6 text-center">
          Convert text to Morse code and vice versa
        </p>
          
        <MorseCodeHelper />
        
        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg w-full max-w-lg text-white/90">
          <h2 className="font-bold text-lg mb-2">How to Use Morse Code Helper</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Type text in the input field to get Morse code</li>
            <li>Click the switch button to change to Morse code input mode</li>
            <li>Use dots (.) and dashes (-) for Morse code, spaces between characters, and "/" for word separations</li>
            <li>Click the sound icon to hear the Morse code</li>
            <li>Copy the result to your clipboard with the copy button</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
