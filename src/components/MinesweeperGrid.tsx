
import React from 'react';
import { cn } from '@/lib/utils';
import { Bomb, Flag, Square } from 'lucide-react';

export type CellValue = 
  | 0   // Empty cell
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8  // Numbers
  | 'unrevealed'
  | 'flag'
  | 'bomb';

export type CellType = {
  value: CellValue;
  x: number;
  y: number;
  predicted?: 'bomb' | 'safe' | null;
};

export type GridType = CellType[][];

interface MinesweeperGridProps {
  grid: GridType;
  onCellClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number) => void;
}

const MinesweeperGrid: React.FC<MinesweeperGridProps> = ({
  grid,
  onCellClick,
  onCellRightClick
}) => {
  const handleContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    onCellRightClick(x, y);
  };

  const renderCellContent = (cell: CellType) => {
    if (cell.value === 'unrevealed') {
      return null;
    } else if (cell.value === 'flag') {
      return <Flag size={20} className="text-white" />;
    } else if (cell.value === 'bomb') {
      return <Bomb size={20} />;
    } else if (cell.value === 0) {
      return null;
    } else {
      return cell.value;
    }
  };

  const getCellClass = (cell: CellType) => {
    if (cell.value === 'unrevealed') {
      return 'cell cell-unrevealed';
    } else if (cell.value === 'flag') {
      return 'cell cell-flagged';
    } else if (cell.value === 'bomb') {
      return 'cell cell-bomb';
    } else {
      return cn(
        'cell cell-revealed',
        typeof cell.value === 'number' && cell.value > 0 && `cell-${cell.value}`
      );
    }
  };

  return (
    <div className="border border-gray-300 inline-block bg-gray-200 p-1 shadow-md">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={cn(
                getCellClass(cell),
                cell.predicted === 'bomb' && 'ring-2 ring-red-500',
                cell.predicted === 'safe' && 'ring-2 ring-green-500'
              )}
              onClick={() => onCellClick(x, y)}
              onContextMenu={(e) => handleContextMenu(e, x, y)}
            >
              {renderCellContent(cell)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MinesweeperGrid;
