
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CellValue } from './TicTacToeGrid';

interface TicTacToeControlsProps {
  onReset: () => void;
  onAnalyze: () => void;
  onChangeTurn: (player: CellValue) => void;
  gameStatus: string;
  currentTurn: CellValue;
}

const TicTacToeControls: React.FC<TicTacToeControlsProps> = ({
  onReset,
  onAnalyze,
  onChangeTurn,
  gameStatus,
  currentTurn
}) => {
  return (
    <div className="flex flex-col gap-4 w-full mb-6">
      <div className="flex flex-wrap gap-2 justify-center md:justify-between">
        <div className="flex gap-2">
          <Button onClick={onReset} variant="secondary">
            Reset Board
          </Button>
          <Button onClick={onAnalyze} variant="default">
            Suggest Move
          </Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Current Turn:</span>
          <div className="flex gap-2">
            <Button 
              variant={currentTurn === 'X' ? "default" : "outline"} 
              onClick={() => onChangeTurn('X')}
              size="sm"
            >
              X
            </Button>
            <Button 
              variant={currentTurn === 'O' ? "default" : "outline"} 
              onClick={() => onChangeTurn('O')}
              size="sm"
            >
              O
            </Button>
          </div>
        </div>
      </div>
      
      {gameStatus && (
        <Alert variant={gameStatus.includes('won') ? "default" : "default"} className="mt-2">
          <AlertTitle>{gameStatus.split(':')[0]}</AlertTitle>
          <AlertDescription>
            {gameStatus.includes(':') ? gameStatus.split(':')[1] : gameStatus}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TicTacToeControls;
