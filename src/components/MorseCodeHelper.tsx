
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Volume2, Volume1, VolumeX } from "lucide-react";
import { predictMorse, predictText } from '@/utils/morseCodeUtils';
import { toast } from 'sonner';

type InputMode = 'text' | 'morse';

const MorseCodeHelper: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<InputMode>('text');
  const [volume, setVolume] = useState<number>(50);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  
  useEffect(() => {
    if (mode === 'text') {
      setOutput(predictMorse(input));
    } else {
      setOutput(predictText(input));
    }
  }, [input, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const toggleMode = () => {
    setInput('');
    setOutput('');
    setMode(mode === 'text' ? 'morse' : 'text');
  };

  const copyToClipboard = () => {
    if (!output) return;
    
    navigator.clipboard.writeText(output)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  const playMorseCode = () => {
    if (!output || audioPlaying) return;
    
    const dotDuration = 100;
    const dashDuration = dotDuration * 3;
    const symbolPause = dotDuration;
    const characterPause = dotDuration * 3;
    const wordPause = dotDuration * 7;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let currentTime = audioContext.currentTime;
    
    setAudioPlaying(true);
    
    // Play morse code
    for (let i = 0; i < output.length; i++) {
      const symbol = output[i];
      
      if (symbol === '.') {
        playTone(audioContext, currentTime, dotDuration);
        currentTime += dotDuration / 1000 + symbolPause / 1000;
      } else if (symbol === '-') {
        playTone(audioContext, currentTime, dashDuration);
        currentTime += dashDuration / 1000 + symbolPause / 1000;
      } else if (symbol === ' ') {
        currentTime += characterPause / 1000;
      } else if (symbol === '/') {
        currentTime += wordPause / 1000;
      }
    }
    
    // Release audio playing state after playback
    setTimeout(() => {
      setAudioPlaying(false);
    }, (currentTime - audioContext.currentTime) * 1000 + 100);
  };
  
  const playTone = (audioContext: AudioContext, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 600;
    gainNode.gain.value = volume / 100;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration / 1000);
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
    <Card className="w-full max-w-lg bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Morse Code Helper</CardTitle>
        <CardDescription className="text-[#FFDEE2]">
          Convert between text and Morse code
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="input" className="text-white font-medium">
              {mode === 'text' ? 'Enter Text' : 'Enter Morse Code'}
            </Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleMode}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Settings className="mr-2 h-4 w-4" />
              Switch to {mode === 'text' ? 'Morse' : 'Text'} Input
            </Button>
          </div>
          <Input
            id="input"
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'text' ? 'Type text here...' : 'Type morse code (. -) here...'}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <Separator className="bg-white/20" />
        
        <div className="space-y-2">
          <Label htmlFor="output" className="text-white font-medium">
            {mode === 'text' ? 'Morse Code Output' : 'Text Output'}
          </Label>
          <div className="relative">
            <Input
              id="output"
              value={output}
              readOnly
              className="bg-white/10 border-white/20 text-white font-mono pr-20"
            />
            {mode === 'text' && output && (
              <div className="absolute top-0 right-0 h-full flex items-center space-x-1 px-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playMorseCode}
                  disabled={audioPlaying}
                  className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : volume < 50 ? (
                    <Volume1 className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <Label htmlFor="volume" className="text-white/80 text-sm">Volume: {volume}%</Label>
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-full mt-1"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-white/20 pt-4">
        <div className="text-sm text-white/70">
          {input.length} {mode === 'text' ? 'characters' : 'symbols'}
        </div>
        <Button 
          onClick={copyToClipboard}
          disabled={!output}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          Copy to Clipboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MorseCodeHelper;
