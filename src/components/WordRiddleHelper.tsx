
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { LightbulbIcon, SearchIcon, PuzzleIcon } from "lucide-react";

const WordRiddleHelper: React.FC = () => {
  const [riddleText, setRiddleText] = useState<string>("");
  const [clue, setClue] = useState<string>("");
  const [potentialAnswers, setPotentialAnswers] = useState<string[]>([]);
  const [revealedLetters, setRevealedLetters] = useState<string>("");
  const [letterPattern, setLetterPattern] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Common English words for suggestions
  const commonWords = [
    "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", 
    "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "home", 
    "water", "room", "fact", "month", "lot", "right", "study", "book", "word", "business",
    "issue", "side", "kind", "head", "house", "service", "friend", "father", "power", "hour", 
    "game", "line", "end", "member", "law", "car", "city", "community", "name", "president",
    "team", "minute", "idea", "kid", "body", "information", "back", "parent", "face", "others",
    "level", "office", "door", "health", "person", "art", "war", "history", "party", "result",
    "change", "morning", "reason", "research", "girl", "guy", "moment", "air", "teacher", "force"
  ];
  
  // Handle anagram solver
  const solveAnagram = () => {
    if (!clue.trim()) {
      toast({
        title: "Missing Letters",
        description: "Please enter the letters to rearrange.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Clean input - remove spaces and non-alphabetic characters
    const cleanedClue = clue.toLowerCase().replace(/[^a-z]/g, "");
    
    // Find all permutations would be too resource-intensive
    // Instead, find words that can be formed from the letters
    const possibleAnswers = commonWords.filter(word => {
      // Skip words that are too long
      if (word.length > cleanedClue.length) return false;
      
      // Check if the word can be formed with the available letters
      const letterCount: Record<string, number> = {};
      
      // Count letters in the clue
      for (const letter of cleanedClue) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
      }
      
      // Check if we have enough letters for the word
      for (const letter of word) {
        if (!letterCount[letter] || letterCount[letter] <= 0) {
          return false;
        }
        letterCount[letter]--;
      }
      
      return true;
    });
    
    setPotentialAnswers(possibleAnswers);
    setIsLoading(false);
    
    if (possibleAnswers.length === 0) {
      toast({
        title: "No Matches",
        description: "No matches found in our dictionary. Try a different combination.",
      });
    } else {
      toast({
        title: "Possible Answers",
        description: `Found ${possibleAnswers.length} possible words.`,
      });
    }
  };
  
  // Handle pattern matching
  const findWordsByPattern = () => {
    if (!letterPattern.trim()) {
      toast({
        title: "Missing Pattern",
        description: "Please enter a letter pattern using ? for unknown letters.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Clean and prepare the pattern for regex matching
    // ? represents unknown letters
    const patternString = letterPattern.toLowerCase().replace(/\?/g, ".");
    const pattern = new RegExp(`^${patternString}$`);
    
    // Filter words by pattern
    const matches = commonWords.filter(word => {
      return pattern.test(word) && word.length === letterPattern.length;
    });
    
    setPotentialAnswers(matches);
    setIsLoading(false);
    
    if (matches.length === 0) {
      toast({
        title: "No Pattern Matches",
        description: "No words found matching this pattern. Try a different pattern.",
      });
    } else {
      toast({
        title: "Pattern Matches",
        description: `Found ${matches.length} matching words.`,
      });
    }
  };
  
  // Handle riddle analysis
  const analyzeRiddle = () => {
    if (!riddleText.trim()) {
      toast({
        title: "Missing Riddle",
        description: "Please enter a riddle to analyze.",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Extract key words from the riddle (simplified approach)
    const words = riddleText.toLowerCase().split(/\s+/);
    const keyWords = words.filter(word => 
      word.length > 3 && 
      !["what", "when", "where", "which", "who", "whom", "whose", "why", "how"].includes(word)
    );
    
    // Find related words based on key words (simplified)
    const suggestions = new Set<string>();
    keyWords.forEach(keyword => {
      commonWords.forEach(word => {
        if (word.includes(keyword.slice(0, 3)) || keyword.includes(word.slice(0, 3))) {
          suggestions.add(word);
        }
      });
    });
    
    setPotentialAnswers(Array.from(suggestions));
    setIsLoading(false);
    
    if (suggestions.size === 0) {
      toast({
        title: "Analysis Complete",
        description: "No suggestions found. Try being more specific in your riddle.",
      });
    } else {
      toast({
        title: "Analysis Complete",
        description: `Found ${suggestions.size} potential words related to your riddle.`,
      });
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-4 border-amber-500/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-500/80 to-amber-600/80">
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <PuzzleIcon size={24} />
            Word Riddle Helper
          </CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="riddle" className="w-full">
          <TabsList className="grid grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="riddle">Riddle Analyzer</TabsTrigger>
            <TabsTrigger value="anagram">Anagram Solver</TabsTrigger>
            <TabsTrigger value="pattern">Pattern Matcher</TabsTrigger>
          </TabsList>
          
          <CardContent className="p-6">
            <TabsContent value="riddle" className="space-y-4">
              <div>
                <Label htmlFor="riddle-text">Enter your riddle:</Label>
                <Input
                  id="riddle-text"
                  value={riddleText}
                  onChange={(e) => setRiddleText(e.target.value)}
                  placeholder="Enter the riddle you're trying to solve..."
                  className="mt-1"
                />
              </div>
              
              {revealedLetters && (
                <div>
                  <Label htmlFor="revealed-letters">Known letters (if any):</Label>
                  <Input
                    id="revealed-letters"
                    value={revealedLetters}
                    onChange={(e) => setRevealedLetters(e.target.value)}
                    placeholder="Enter any letters you know (e.g., first letter is 'c')"
                    className="mt-1"
                  />
                </div>
              )}
              
              <Button 
                onClick={analyzeRiddle} 
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading || !riddleText.trim()}
              >
                <LightbulbIcon size={18} />
                Analyze Riddle
              </Button>
            </TabsContent>
            
            <TabsContent value="anagram" className="space-y-4">
              <div>
                <Label htmlFor="anagram-clue">Letters to rearrange:</Label>
                <Input
                  id="anagram-clue"
                  value={clue}
                  onChange={(e) => setClue(e.target.value)}
                  placeholder="Enter letters to rearrange (e.g., 'aeplp' for 'apple')"
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={solveAnagram} 
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading || !clue.trim()}
              >
                <SearchIcon size={18} />
                Find Anagrams
              </Button>
            </TabsContent>
            
            <TabsContent value="pattern" className="space-y-4">
              <div>
                <Label htmlFor="letter-pattern">
                  Letter pattern (use ? for unknown letters):
                </Label>
                <Input
                  id="letter-pattern"
                  value={letterPattern}
                  onChange={(e) => setLetterPattern(e.target.value)}
                  placeholder="e.g., '?a?t' for words like 'fast', 'last', etc."
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={findWordsByPattern} 
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading || !letterPattern.trim()}
              >
                <SearchIcon size={18} />
                Find Matching Words
              </Button>
            </TabsContent>
            
            {potentialAnswers.length > 0 && (
              <div className="mt-6">
                <Label className="block mb-2">Possible Answers:</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {potentialAnswers.map((word, index) => (
                    <div
                      key={index}
                      className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="bg-amber-100/50 p-4 text-sm text-amber-900">
            <p>
              This helper provides suggestions based on common words. For complex riddles,
              consider the context and multiple possible interpretations.
            </p>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default WordRiddleHelper;
