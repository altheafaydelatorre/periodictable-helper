
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

// Common English words dictionary - this is a small subset for demo purposes
// In a real app, you would use a more complete dictionary
const DICTIONARY = [
  "act", "add", "age", "ago", "aid", "aim", "air", "all", "and", "any", "arm", "art", "ask", "ate",
  "bad", "bag", "bar", "bat", "bay", "bed", "bee", "beg", "bet", "bid", "big", "bit", "boa", "bob",
  "box", "boy", "bud", "bug", "bum", "bun", "bus", "but", "buy", "bye",
  "cab", "can", "cap", "car", "cat", "cog", "con", "cop", "cow", "cry", "cub", "cup", "cut",
  "dad", "dam", "dan", "day", "den", "dew", "did", "die", "dig", "dim", "dip", "doe", "dog", "don", "dot", "dry", "due", "dug",
  "ear", "eat", "eel", "egg", "ego", "elf", "elk", "elm", "end", "era", "eve", "eye",
  "fad", "fan", "far", "fat", "fax", "fed", "fee", "few", "fig", "fin", "fir", "fit", "fix", "fly", "foe", "fog", "for", "fox", "fry", "fun", "fur",
  "gag", "gap", "gas", "gel", "gem", "get", "gig", "gin", "god", "got", "gum", "gun", "gut", "guy", "gym",
  "had", "hag", "ham", "has", "hat", "hay", "hem", "hen", "her", "hey", "hid", "him", "hip", "his", "hit", "hog", "hop", "hot", "how", "hub", "hue", "hug", "hum", "hut",
  "ice", "icy", "ill", "ink", "inn", "ion", "its",
  "jab", "jar", "jaw", "jay", "jet", "job", "jog", "jot", "joy", "jug",
  "keg", "key", "kid", "kin", "kit", "lab", "lad", "lag", "lap", "law", "lay", "leg", "let", "lid", "lie", "lip", "lit", "log", "lot", "low",
  "mad", "man", "map", "mat", "may", "men", "met", "mix", "mob", "mop", "mud", "mug", "nag", "nap", "net", "new", "nod", "not", "now", "nun", "nut",
  "oak", "odd", "off", "oil", "old", "one", "our", "out", "owe", "owl", "own", "pad", "pan", "paw", "pay", "pea", "pen", "pet", "pie", "pig", "pin", "pit",
  "pod", "pot", "pry", "pub", "pup", "put", 
  "rad", "rag", "rap", "rat", "raw", "ray", "red", "rib", "rid", "rim", "rip", "rob", "rod", "rot", "row", "rub", "rug", "rum", "run", "rut",
  "sad", "sag", "sal", "sat", "saw", "say", "sea", "see", "set", "sew", "she", "shy", "sic", "sin", "sip", "sir", "sit", "six", "ski", "sky", "sly",
  "sob", "sod", "son", "sow", "spy", "sub", "sue", "sum", "sun", "sup", 
  "tab", "tag", "tam", "tan", "tap", "tar", "tax", "tea", "ten", "the", "thy", "tie", "tin", "tip", "toe", "tog", "tom", "ton", "too", "top", "tow", "toy", "try", "tub", "tug", "two",
  "use", "van", "vat", "vet", "via", "vie", "vow", 
  "wag", "wax", "way", "web", "wed", "wee", "wet", "who", "why", "wig", "win", "wit", "wok", "won", "woo", "wow", "wry",
  "yak", "yam", "yap", "yaw", "yea", "yen", "yes", "yet", "yew", "yip", "you",
  "zap", "zig", "zip", "zoo"
];

// Word scores based on Scrabble letter values
const LETTER_VALUES: {[key: string]: number} = {
  'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1, 'f': 4, 'g': 2, 'h': 4, 'i': 1,
  'j': 8, 'k': 5, 'l': 1, 'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1,
  's': 1, 't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10
};

type SuggestedWord = {
  word: string;
  score: number;
};

const ScrabbleHelper: React.FC = () => {
  const [letters, setLetters] = useState<string>("");
  const [suggestedWords, setSuggestedWords] = useState<SuggestedWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to find possible words from the given letters
  const findPossibleWords = () => {
    setIsLoading(true);
    
    // Convert input to lowercase and remove non-alphabetic characters
    const cleanLetters = letters.toLowerCase().replace(/[^a-z]/g, '');
    
    if (cleanLetters.length === 0) {
      toast({
        title: "Error",
        description: "Please enter some letters.",
      });
      setIsLoading(false);
      return;
    }

    // Find words that can be formed from the given letters
    const possibleWords: SuggestedWord[] = [];
    
    // For each word in the dictionary
    DICTIONARY.forEach(word => {
      // Check if we can form this word with our letters
      if (canFormWord(cleanLetters, word)) {
        // Calculate word score based on Scrabble letter values
        const score = calculateWordScore(word);
        possibleWords.push({ word, score });
      }
    });
    
    // Sort words by score (highest first)
    possibleWords.sort((a, b) => b.score - a.score);
    
    setSuggestedWords(possibleWords);
    setIsLoading(false);
    
    if (possibleWords.length === 0) {
      toast({
        title: "No words found",
        description: "No words can be formed from these letters.",
      });
    } else {
      toast({
        title: "Words Found!",
        description: `Found ${possibleWords.length} possible words.`,
      });
    }
  };

  // Check if a word can be formed from the given letters
  const canFormWord = (availableLetters: string, word: string): boolean => {
    const letterCount: {[key: string]: number} = {};
    
    // Count available letters
    for (const letter of availableLetters) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    
    // Check if we have enough of each letter to form the word
    for (const letter of word) {
      if (!letterCount[letter] || letterCount[letter] <= 0) {
        return false;
      }
      letterCount[letter]--;
    }
    
    return true;
  };

  // Calculate word score based on Scrabble letter values
  const calculateWordScore = (word: string): number => {
    let score = 0;
    for (const letter of word) {
      score += LETTER_VALUES[letter] || 0;
    }
    return score;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Scrabble Word Helper</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="letters" className="text-sm font-medium">
                Your Letters
              </label>
              <div className="flex space-x-2">
                <Input
                  id="letters"
                  value={letters}
                  onChange={(e) => setLetters(e.target.value)}
                  placeholder="Enter your available letters"
                  className="flex-1"
                />
                <Button 
                  onClick={findPossibleWords}
                  disabled={isLoading || letters.length === 0}
                >
                  Find Words
                </Button>
              </div>
            </div>
            
            {suggestedWords.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Possible Words:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {suggestedWords.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className="border rounded-md p-2 text-center flex flex-col justify-between"
                    >
                      <span className="font-medium">{suggestion.word}</span>
                      <span className="text-sm text-muted-foreground">Score: {suggestion.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="text-sm text-muted-foreground">
            <p>Enter your available Scrabble tiles to find possible words.</p>
            <p>Results are sorted by Scrabble point value.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ScrabbleHelper;
