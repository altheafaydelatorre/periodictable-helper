
import React from 'react';
import { cn } from '@/lib/utils';
import { X, Circle } from 'lucide-react';

export type CellValue = 'X' | 'O' | null;
export type GridType = CellValue[][];

interface TicTacToeGridProps {
  grid: GridType;
  onCellClick: (row: number, col: number) => void;
  winningLine?: number[][];
}

const TicTacToeGrid: React.FC<TicTacToeGridProps> = ({ 
  grid, 
  onCellClick, 
  winningLine = [],
}) => {
  const isInWinningLine = (row: number, col: number): boolean => {
    return winningLine.some(pos => pos[0] === row && pos[1] === col);
  };

  return (
    <div className="inline-block border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <div className="grid grid-cols-3 gap-0">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              className={cn(
                "w-16 h-16 flex items-center justify-center border border-gray-200 dark:border-gray-800 cursor-pointer transition-colors",
                rowIndex < 2 && "border-b-2",
                colIndex < 2 && "border-r-2",
                isInWinningLine(rowIndex, colIndex) && "bg-green-100 dark:bg-green-900"
              )}
            >
              {cell === 'X' && <X size={32} className="text-rose-500" />}
              {cell === 'O' && <Circle size={32} className="text-blue-500" />}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default TicTacToeGrid;
