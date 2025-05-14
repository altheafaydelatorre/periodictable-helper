
import React, { useState, useEffect } from 'react';
import MinesweeperGrid, { GridType, CellType, CellValue } from '@/components/MinesweeperGrid';
import GameControls from '@/components/GameControls';
import MobileWarning from '@/components/MobileWarning';
import { 
  createEmptyGrid, 
  countAdjacentMines, 
  analyzeBoard,
  countFlaggedCells,
  countUnrevealedCells
} from '@/utils/minesweeperLogic';
import { toast } from "@/components/ui/use-toast";

// Grid size presets
const gridSizes = {
  '9x9': { width: 9, height: 9, bombs: 10 },
  '16x16': { width: 16, height: 16, bombs: 40 },
  '24x16': { width: 24, height: 16, bombs: 99 }
};

const Index = () => {
  const [selectedSize, setSelectedSize] = useState<string>('9x9');
  const [grid, setGrid] = useState<GridType>([]);
  const [bombCount, setBombCount] = useState(10);
  
  // Initialize grid
  useEffect(() => {
    resetGrid();
  }, [selectedSize]);
  
  const resetGrid = () => {
    const { width, height, bombs } = gridSizes[selectedSize as keyof typeof gridSizes];
    const newGrid = createEmptyGrid(width, height);
    setGrid(newGrid);
    setBombCount(bombs);
    
    toast({
      title: "Grid Reset",
      description: `Created a new ${width}x${height} grid with ${bombs} bombs.`,
    });
  };
  
  const handleCellClick = (x: number, y: number) => {
    if (grid[y][x].value !== 'unrevealed') return;
    
    const newGrid = [...grid];
    
    // Allow users to set a cell as a number (simulating a revealed cell in the real game)
    const adjacentFlagged = countAdjacentMines(newGrid, x, y);
    newGrid[y][x] = {
      ...newGrid[y][x],
      value: adjacentFlagged as CellValue,
      predicted: null
    };
    
    setGrid(newGrid);
  };
  
  const handleCellRightClick = (x: number, y: number) => {
    const newGrid = [...grid];
    const cell = newGrid[y][x];
    
    if (cell.value === 'unrevealed') {
      newGrid[y][x] = {
        ...cell,
        value: 'flag',
        predicted: null
      };
    } else if (cell.value === 'flag') {
      newGrid[y][x] = {
        ...cell,
        value: 'bomb',
        predicted: null
      };
    } else if (cell.value === 'bomb') {
      newGrid[y][x] = {
        ...cell,
        value: 'unrevealed',
        predicted: null
      };
    }
    
    setGrid(newGrid);
  };
  
  const handleAnalyze = () => {
    const analyzedGrid = analyzeBoard(grid);
    setGrid(analyzedGrid);
    
    // Count how many cells were predicted
    let bombPredictions = 0;
    let safePredictions = 0;
    
    analyzedGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.predicted === 'bomb') bombPredictions++;
        if (cell.predicted === 'safe') safePredictions++;
      });
    });
    
    if (bombPredictions === 0 && safePredictions === 0) {
      toast({
        title: "Analysis Complete",
        description: "No definite predictions could be made. Try revealing more cells.",
        variant: "default"
      });
    } else {
      toast({
        title: "Analysis Complete",
        description: `Found ${bombPredictions} probable bombs and ${safePredictions} safe cells.`,
        variant: "default"
      });
    }
  };
  
  const handleChangeSize = (size: string) => {
    setSelectedSize(size);
  };
  
  const flaggedCount = countFlaggedCells(grid);
  const remainingCells = countUnrevealedCells(grid);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">Mine Whisperer</h1>
        <p className="text-muted-foreground mb-6 text-center">
          A minesweeper solver that predicts bomb locations and helps you win
        </p>
        
        <MobileWarning />
        
        <GameControls
          onReset={resetGrid}
          onAnalyze={handleAnalyze}
          onChangeSize={handleChangeSize}
          bombCount={bombCount}
          flaggedCount={flaggedCount}
          remainingCells={remainingCells}
          selectedSize={selectedSize}
        />
        
        <div className="overflow-auto p-2 max-w-full">
          <MinesweeperGrid
            grid={grid}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        </div>
        
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full max-w-2xl">
          <h2 className="font-bold text-lg mb-2">How to Use Mine Whisperer</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Set up your grid to match your current Minesweeper game:
              <ul className="list-disc list-inside ml-6 text-sm text-muted-foreground">
                <li>Left-click to set a numbered cell</li>
                <li>Right-click to cycle: Empty → Flag → Bomb → Empty</li>
              </ul>
            </li>
            <li>Click "Analyze Board" to get predictions:
              <ul className="list-disc list-inside ml-6 text-sm text-muted-foreground">
                <li>Red outline: Probable bomb location</li>
                <li>Green outline: Safe cell to click</li>
              </ul>
            </li>
            <li>Update your board as you continue playing, and analyze again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
