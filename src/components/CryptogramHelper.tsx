
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { 
  generateSubstitution, 
  encryptMessage, 
  decryptWithKey,
  getUniqueLetters,
  getRandomQuote,
  checkSolution
} from '@/utils/cryptogramUtils';

const CryptogramHelper: React.FC = () => {
  const [mode, setMode] = useState<'solve' | 'create'>('solve');
  const [originalText, setOriginalText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [substitutionKey, setSubstitutionKey] = useState<Record<string, string>>({});
  const [userKey, setUserKey] = useState<Record<string, string>>({});
  const [uniqueLetters, setUniqueLetters] = useState<string[]>([]);
  
  // Initialize with a random quote
  useEffect(() => {
    if (mode === 'solve') {
      const quote = getRandomQuote();
      const key = generateSubstitution();
      const encrypted = encryptMessage(quote, key);
      
      setOriginalText(quote);
      setEncryptedText(encrypted);
      setSubstitutionKey(key);
      setUniqueLetters(getUniqueLetters(encrypted));
      
      // Reset user's solution
      setUserKey({});
    }
  }, [mode]);
  
  // When user creates a new cryptogram
  const handleCreateCryptogram = () => {
    if (!originalText.trim()) {
      toast.error('Please enter some text to encrypt');
      return;
    }
    
    const key = generateSubstitution();
    const encrypted = encryptMessage(originalText, key);
    
    setEncryptedText(encrypted);
    setSubstitutionKey(key);
    setUniqueLetters(getUniqueLetters(encrypted));
    toast.success('Cryptogram created!');
  };
  
  // Update user's solution mapping
  const handleUpdateKey = (cipherLetter: string, plainLetter: string) => {
    // Remove this mapping from any other cipher letter
    const newUserKey = { ...userKey };
    
    // If the plain letter is already assigned to another cipher letter, remove it
    Object.keys(newUserKey).forEach(cipher => {
      if (newUserKey[cipher] === plainLetter.toUpperCase()) {
        delete newUserKey[cipher];
      }
    });
    
    // Add the new mapping
    if (plainLetter) {
      newUserKey[cipherLetter] = plainLetter.toUpperCase();
    } else {
      delete newUserKey[cipherLetter];
    }
    
    setUserKey(newUserKey);
  };
  
  // Check user's solution
  const checkUserSolution = () => {
    if (checkSolution(encryptedText, originalText, userKey)) {
      toast.success('Congratulations! You solved it!');
    } else {
      toast.error('Not quite right, keep trying!');
    }
  };
  
  // Generate a new puzzle
  const getNewPuzzle = () => {
    const quote = getRandomQuote();
    const key = generateSubstitution();
    const encrypted = encryptMessage(quote, key);
    
    setOriginalText(quote);
    setEncryptedText(encrypted);
    setSubstitutionKey(key);
    setUniqueLetters(getUniqueLetters(encrypted));
    
    // Reset user's solution
    setUserKey({});
    toast.success('New cryptogram loaded!');
  };
  
  // Show a hint
  const showHint = () => {
    // Find a letter the user hasn't guessed yet
    const unguessedLetters = uniqueLetters.filter(letter => !userKey[letter]);
    
    if (unguessedLetters.length === 0) {
      toast.info('You already have guesses for all letters!');
      return;
    }
    
    // Pick a random unguessed letter
    const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
    const cipherLetter = unguessedLetters[randomIndex];
    
    // Find the correct plain letter from the key
    const invertedKey: Record<string, string> = {};
    Object.entries(substitutionKey).forEach(([plain, cipher]) => {
      invertedKey[cipher] = plain;
    });
    
    const correctPlainLetter = invertedKey[cipherLetter];
    
    // Update the user's key with this hint
    const newUserKey = { ...userKey, [cipherLetter]: correctPlainLetter };
    setUserKey(newUserKey);
    
    toast.success(`Hint: "${cipherLetter}" is "${correctPlainLetter}"`);
  };
  
  // Format encrypted text with user's guesses
  const renderEncryptedText = () => {
    return encryptedText.split('').map((char, index) => {
      if (/[A-Z]/.test(char)) {
        const guess = userKey[char] || '';
        const style = guess ? 'text-green-600 font-bold' : 'text-gray-400';
        
        return (
          <span key={index} className="relative inline-block">
            <span className="text-xl">{char}</span>
            <span className={`absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2 text-xs ${style}`}>
              {guess}
            </span>
          </span>
        );
      }
      return <span key={index} className="text-xl">{char}</span>;
    });
  };
  
  return (
    <Card className="w-full max-w-lg bg-gradient-to-br from-[#FFB347] to-[#FFCC33] text-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Cryptogram Helper</CardTitle>
        <CardDescription className="text-gray-700">
          Solve or create letter substitution puzzles
        </CardDescription>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setMode('solve')}
            className={`${mode === 'solve' ? 'bg-amber-600 text-white' : 'bg-white/30'}`}
          >
            Solve Mode
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setMode('create')}
            className={`${mode === 'create' ? 'bg-amber-600 text-white' : 'bg-white/30'}`}
          >
            Create Mode
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mode === 'solve' ? (
          <>
            <div className="bg-amber-100 p-4 rounded-lg shadow-inner min-h-20 text-center">
              {renderEncryptedText()}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {uniqueLetters.map((letter) => (
                <div key={letter} className="text-center">
                  <div className="bg-amber-200 rounded-md py-1 mb-1 text-xl font-bold">{letter}</div>
                  <Input
                    maxLength={1}
                    value={userKey[letter] || ''}
                    onChange={(e) => handleUpdateKey(letter, e.target.value)}
                    className="text-center uppercase font-bold bg-white/70"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between gap-2">
              <Button 
                onClick={checkUserSolution}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                Check Solution
              </Button>
              <Button 
                onClick={getNewPuzzle}
                variant="outline"
                className="flex-1 bg-white/30"
              >
                New Puzzle
              </Button>
              <Button 
                onClick={showHint}
                variant="outline"
                className="flex-1 bg-white/30"
              >
                Hint
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="original" className="text-gray-800 font-medium">
                Enter text to encrypt
              </Label>
              <Input
                id="original"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Type your message here..."
                className="bg-white/70"
              />
            </div>
            
            <Button 
              onClick={handleCreateCryptogram}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Create Cryptogram
            </Button>
            
            {encryptedText && (
              <div>
                <Label className="text-gray-800 font-medium">
                  Encrypted Result
                </Label>
                <div className="bg-amber-100 p-4 rounded-lg shadow-inner break-words">
                  {encryptedText}
                </div>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(encryptedText);
                    toast.success('Copied to clipboard!');
                  }}
                  variant="outline"
                  className="mt-2 bg-white/30"
                >
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-amber-400/30 pt-4">
        <div className="text-sm text-amber-800/70">
          {mode === 'solve' ? 'Solve the puzzle by replacing cipher letters' : 'Create and share your own cryptogram'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CryptogramHelper;
