
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { GridType } from './MinesweeperGrid';
import { Flag, Bomb, Circle } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  onAnalyze: () => void;
  onChangeSize: (size: string) => void;
  bombCount: number;
  flaggedCount: number;
  remainingCells: number;
  selectedSize: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onAnalyze,
  onChangeSize,
  bombCount,
  flaggedCount,
  remainingCells,
  selectedSize
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto">
          <Select value={selectedSize} onValueChange={onChangeSize}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Grid Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9x9">Beginner (9x9)</SelectItem>
              <SelectItem value="16x16">Intermediate (16x16)</SelectItem>
              <SelectItem value="24x16">Expert (24x16)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="flex-1 sm:flex-initial"
          >
            Reset Grid
          </Button>
          <Button 
            onClick={onAnalyze} 
            className="flex-1 sm:flex-initial"
          >
            Analyze Board
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-3 rounded-md shadow flex justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Bomb size={20} className="text-red-500" />
          <span>Bombs: {bombCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag size={20} className="text-orange-500" />
          <span>Flagged: {flaggedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle size={20} className="text-blue-500" />
          <span>Remaining: {remainingCells}</span>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p><strong>How to use:</strong> Left-click to reveal a cell, right-click to flag a bomb.</p>
        <p>Click "Analyze Board" to get bomb predictions (red outline = probable bomb, green = safe).</p>
      </div>
    </div>
  );
};

export default GameControls;
