import React, { useState, useEffect } from 'react';
import MinesweeperGrid, { GridType as MineGridType, CellType, CellValue as MineCellValue } from '@/components/MinesweeperGrid';
import GameControls from '@/components/GameControls';
import MobileWarning from '@/components/MobileWarning';
import { 
  createEmptyGrid as createEmptyMineGrid, 
  countAdjacentMines, 
  analyzeBoard,
  countFlaggedCells,
  countUnrevealedCells
} from '@/utils/minesweeperLogic';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Import Tic-tac-toe components and logic
import TicTacToeGrid, { GridType as TicTacGridType, CellValue as TicTacCellValue } from '@/components/TicTacToeGrid';
import TicTacToeControls from '@/components/TicTacToeControls';
import {
  createEmptyGrid as createEmptyTicTacGrid,
  checkWinner,
  findBestMove,
  determineTurn,
  isGridFull
} from '@/utils/ticTacToeLogic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Grid size presets
const gridSizes = {
  '9x9': { width: 9, height: 9, bombs: 10 },
  '16x16': { width: 16, height: 16, bombs: 40 },
  '24x16': { width: 24, height: 16, bombs: 99 }
};

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<string>("minesweeper");
  
  // Minesweeper State
  const [selectedSize, setSelectedSize] = useState<string>('9x9');
  const [grid, setGrid] = useState<MineGridType>([]);
  const [bombCount, setBombCount] = useState(10);
  
  // Tic-tac-toe State
  const [ticTacGrid, setTicTacGrid] = useState<TicTacGridType>(createEmptyTicTacGrid());
  const [currentTurn, setCurrentTurn] = useState<TicTacCellValue>('X');
  const [gameStatus, setGameStatus] = useState<string>('');
  const [winningLine, setWinningLine] = useState<number[][]>([]);
  const [suggestedMove, setSuggestedMove] = useState<[number, number] | null>(null);
  
  // Initialize minesweeper grid
  useEffect(() => {
    resetGrid();
  }, [selectedSize]);
  
  // Initialize tic-tac-toe grid
  useEffect(() => {
    checkTicTacToeWinner();
  }, [ticTacGrid]);
  
  const resetGrid = () => {
    const { width, height, bombs } = gridSizes[selectedSize as keyof typeof gridSizes];
    const newGrid = createEmptyMineGrid(width, height);
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
      value: adjacentFlagged as MineCellValue,
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
  
  // Tic-tac-toe handlers
  const resetTicTacToeGrid = () => {
    setTicTacGrid(createEmptyTicTacGrid());
    setCurrentTurn('X');
    setGameStatus('');
    setWinningLine([]);
    setSuggestedMove(null);
    
    toast({
      title: "Board Reset",
      description: "Created a new Tic-tac-toe board.",
    });
  };
  
  const handleTicTacToeClick = (row: number, col: number) => {
    if (ticTacGrid[row][col] !== null || winningLine.length > 0) return;
    
    const newGrid = [...ticTacGrid.map(r => [...r])];
    newGrid[row][col] = currentTurn;
    setTicTacGrid(newGrid);
    
    // Switch turns
    setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
    setSuggestedMove(null);
  };
  
  const checkTicTacToeWinner = () => {
    const result = checkWinner(ticTacGrid);
    
    if (result) {
      setWinningLine(result.line);
      setGameStatus(`Game Over: ${result.winner} has won!`);
    } else if (isGridFull(ticTacGrid)) {
      setGameStatus('Game Over: It\'s a draw!');
    } else {
      setGameStatus(`Current Turn: ${currentTurn}'s move`);
    }
  };
  
  const analyzeTicTacToe = () => {
    if (winningLine.length > 0 || isGridFull(ticTacGrid)) {
      toast({
        title: "Game Already Over",
        description: "Start a new game to get move suggestions.",
      });
      return;
    }
    
    const move = findBestMove(ticTacGrid, currentTurn);
    
    if (move) {
      setSuggestedMove(move);
      toast({
        title: "Move Analysis",
        description: `Suggested move: row ${move[0] + 1}, column ${move[1] + 1}`,
      });
    } else {
      toast({
        title: "No Moves Available",
        description: "The board is full or there are no good moves.",
      });
    }
  };
  
  const handleChangeTurn = (player: TicTacCellValue) => {
    if (player) {
      setCurrentTurn(player);
      setSuggestedMove(null);
      
      toast({
        title: "Turn Changed",
        description: `Current turn: ${player}`,
      });
    }
  };
  
  const fixTicTacToeTurn = () => {
    const detectedTurn = determineTurn(ticTacGrid);
    setCurrentTurn(detectedTurn);
    setSuggestedMove(null);
    
    toast({
      title: "Turn Fixed",
      description: `Turn set to ${detectedTurn} based on board analysis`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <Tabs 
          defaultValue="minesweeper" 
          value={selectedTab}
          onValueChange={setSelectedTab} 
          className="w-full max-w-4xl"
        >
          <div className="flex flex-col items-center w-full mb-6">
            <h1 className="text-3xl font-bold mb-1">Game Helpers</h1>
            <p className="text-muted-foreground mb-4 text-center">
              Tools to help you win your favorite games
            </p>
            
            <TabsList className="mb-2 grid grid-cols-2 w-[400px]">
              <TabsTrigger value="minesweeper">Mine Whisperer</TabsTrigger>
              <TabsTrigger value="tictactoe">Tic-tac-toe Helper</TabsTrigger>
            </TabsList>
          </div>
          
          <MobileWarning />
          
          <TabsContent value="minesweeper" className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Mine Whisperer</h2>
            
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
          </TabsContent>
          
          <TabsContent value="tictactoe" className="w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Tic-tac-toe Helper</h2>
            
            <TicTacToeControls
              onReset={resetTicTacToeGrid}
              onAnalyze={analyzeTicTacToe}
              onChangeTurn={handleChangeTurn}
              gameStatus={gameStatus}
              currentTurn={currentTurn}
            />
            
            <div className="flex flex-col items-center">
              <TicTacToeGrid
                grid={ticTacGrid}
                onCellClick={handleTicTacToeClick}
                winningLine={winningLine}
                nextMove={suggestedMove}
              />
              
              <Button 
                onClick={fixTicTacToeTurn} 
                variant="outline" 
                size="sm"
                className="mt-4"
              >
                Fix Turn Order
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg w-full max-w-2xl">
              <h2 className="font-bold text-lg mb-2">How to Use Tic-tac-toe Helper</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Set up the board to match your current game:
                  <ul className="list-disc list-inside ml-6 text-sm text-muted-foreground">
                    <li>Click on cells to place X or O based on current turn</li>
                    <li>Use the "Current Turn" buttons to select whose move it is</li>
                  </ul>
                </li>
                <li>Click "Suggest Move" to get the best next move:
                  <ul className="list-disc list-inside ml-6 text-sm text-muted-foreground">
                    <li>Blue highlight: Suggested optimal move</li>
                    <li>Green highlight: Winning line when game is over</li>
                  </ul>
                </li>
                <li>The helper will analyze the board and suggest the best strategic move</li>
                <li>If the board doesn't match turns correctly, use "Fix Turn Order"</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
