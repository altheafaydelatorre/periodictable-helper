
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { 
  generateSubstitution, 
  encryptMessage, 
  decryptWithKey,
  getUniqueLetters,
  getRandomQuote
} from '@/utils/cryptogramUtils';

const CryptogramHelper: React.FC = () => {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [originalText, setOriginalText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [substitutionKey, setSubstitutionKey] = useState<Record<string, string>>({});
  const [userKey, setUserKey] = useState<Record<string, string>>({});
  const [uniqueLetters, setUniqueLetters] = useState<string[]>([]);
  const [decodedMeaning, setDecodedMeaning] = useState('');
  
  // Handle mode change
  useEffect(() => {
    // Reset state when changing modes
    setOriginalText('');
    setEncryptedText('');
    setUserKey({});
    setDecodedMeaning('');
    
    if (mode === 'encode') {
      const key = generateSubstitution();
      setSubstitutionKey(key);
    }
  }, [mode]);
  
  // When user creates a new cryptogram
  const handleEncryptText = () => {
    if (!originalText.trim()) {
      toast.error('Please enter some text to encrypt');
      return;
    }
    
    const key = generateSubstitution();
    const encrypted = encryptMessage(originalText, key);
    
    setEncryptedText(encrypted);
    setSubstitutionKey(key);
    toast.success('Text encrypted successfully!');
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
  
  // For decode mode - when user enters encrypted text
  const handleEncryptedTextChange = (text: string) => {
    setEncryptedText(text);
    if (text.trim()) {
      setUniqueLetters(getUniqueLetters(text));
    } else {
      setUniqueLetters([]);
    }
    setDecodedMeaning(''); // Reset decoded meaning when text changes
  };
  
  // Decode according to current user key
  const decodedText = decryptWithKey(encryptedText, userKey);
  
  // Reset all user inputs
  const resetInputs = () => {
    setUserKey({});
    setDecodedMeaning('');
    if (mode === 'decode') {
      setEncryptedText('');
      setUniqueLetters([]);
    } else {
      setOriginalText('');
      setEncryptedText('');
    }
  };
  
  // Format encrypted text with user's guesses for decode mode
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

  // Function to attempt to decode the meaning of the encrypted text
  const handleDecodeMeaning = () => {
    // This would typically use an algorithm or API to decode
    // For now, we'll use a simplified approach with the current user key
    if (!encryptedText.trim()) {
      toast.error('Please enter encrypted text first');
      return;
    }

    // Count how complete the user's key is
    const completionPercentage = Object.keys(userKey).length / uniqueLetters.length;
    
    if (completionPercentage < 0.5) {
      setDecodedMeaning("Need more letter mappings to suggest a meaning. Try filling in more letters.");
      toast.info('Add more letter mappings to improve meaning detection');
    } else {
      // In a real app, this could use language models or pattern matching
      // For now, we'll just return the current decoded text with a confidence indicator
      setDecodedMeaning(`Possible meaning: "${decodedText}"\n(Confidence: ${Math.round(completionPercentage * 100)}%)`);
      toast.success('Meaning analysis complete');
    }
  };
  
  return (
    <Card className="w-full max-w-lg bg-gradient-to-br from-[#FFB347] to-[#FFCC33] text-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Cryptogram Helper</CardTitle>
        <CardDescription className="text-gray-700">
          Decode or encode letter substitution text
        </CardDescription>
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => setMode('decode')}
            className={`${mode === 'decode' ? 'bg-amber-600 text-white' : 'bg-white/30'}`}
          >
            Decode Text
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setMode('encode')}
            className={`${mode === 'encode' ? 'bg-amber-600 text-white' : 'bg-white/30'}`}
          >
            Encode Text
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mode === 'decode' ? (
          <>
            <div>
              <Label htmlFor="encryptedText" className="text-gray-800 font-medium">
                Enter encrypted text
              </Label>
              <Input
                id="encryptedText"
                value={encryptedText}
                onChange={(e) => handleEncryptedTextChange(e.target.value.toUpperCase())}
                placeholder="Enter the cryptogram text here..."
                className="bg-white/70"
              />
            </div>
            
            {encryptedText && (
              <>
                <div className="bg-amber-100 p-4 rounded-lg shadow-inner min-h-20 text-center">
                  {renderEncryptedText()}
                </div>
                
                {uniqueLetters.length > 0 && (
                  <>
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
                    
                    <div className="p-4 bg-amber-100 rounded-lg">
                      <Label className="text-gray-800 font-medium block mb-2">
                        Decoded Result
                      </Label>
                      <div className="min-h-12 p-2 break-words">
                        {decodedText}
                      </div>
                    </div>

                    <Button 
                      onClick={handleDecodeMeaning}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Analyze Possible Meaning
                    </Button>
                    
                    {decodedMeaning && (
                      <div className="p-4 bg-amber-100 rounded-lg">
                        <Label className="text-gray-800 font-medium block mb-2">
                          Meaning Analysis
                        </Label>
                        <div className="min-h-12 p-2 break-words whitespace-pre-line">
                          {decodedMeaning}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      onClick={resetInputs}
                      variant="outline"
                      className="w-full bg-white/30"
                    >
                      Reset
                    </Button>
                  </>
                )}
              </>
            )}
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
              onClick={handleEncryptText}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Encrypt Text
            </Button>
            
            {encryptedText && (
              <div>
                <Label className="text-gray-800 font-medium">
                  Encrypted Result
                </Label>
                <div className="bg-amber-100 p-4 rounded-lg shadow-inner break-words">
                  {encryptedText}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(encryptedText);
                      toast.success('Copied to clipboard!');
                    }}
                    variant="outline"
                    className="flex-1 bg-white/30"
                  >
                    Copy to Clipboard
                  </Button>
                  <Button 
                    onClick={resetInputs}
                    variant="outline"
                    className="flex-1 bg-white/30"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-amber-400/30 pt-4">
        <div className="text-sm text-amber-800/70">
          {mode === 'decode' ? 'Decode by assigning letters to cipher text' : 'Create encrypted messages to share'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CryptogramHelper;
