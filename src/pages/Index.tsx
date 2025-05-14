
import React, { useState, useEffect } from 'react';
import TicTacToeGrid, { GridType as TicTacGridType, CellValue } from '@/components/TicTacToeGrid';
import TicTacToeControls from '@/components/TicTacToeControls';
import { createEmptyGrid, checkWinner, isGridFull, determineTurn } from '@/utils/ticTacToeLogic';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [ticTacGrid, setTicTacGrid] = useState<TicTacGridType>(createEmptyGrid());
  const [currentTurn, setCurrentTurn] = useState<CellValue>('X');
  const [gameStatus, setGameStatus] = useState<string>('');
  const [winningLine, setWinningLine] = useState<number[][]>([]);

  // Initialize tic-tac-toe grid
  useEffect(() => {
    checkTicTacToeWinner();
  }, [ticTacGrid]);
  
  const resetTicTacToeGrid = () => {
    setTicTacGrid(createEmptyGrid());
    setCurrentTurn('X');
    setGameStatus('');
    setWinningLine([]);
    
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
  
  const handleChangeTurn = (player: CellValue) => {
    if (player) {
      setCurrentTurn(player);
      
      toast({
        title: "Turn Changed",
        description: `Current turn: ${player}`,
      });
    }
  };
  
  const fixTicTacToeTurn = () => {
    const detectedTurn = determineTurn(ticTacGrid);
    setCurrentTurn(detectedTurn);
    
    toast({
      title: "Turn Fixed",
      description: `Turn set to ${detectedTurn} based on board analysis`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-1">Tic-tac-toe Helper</h1>
        <p className="text-muted-foreground mb-6 text-center">
          A simple helper for your Tic-tac-toe games
        </p>
          
        <TicTacToeControls
          onReset={resetTicTacToeGrid}
          onChangeTurn={handleChangeTurn}
          gameStatus={gameStatus}
          currentTurn={currentTurn}
        />
        
        <div className="flex flex-col items-center">
          <TicTacToeGrid
            grid={ticTacGrid}
            onCellClick={handleTicTacToeClick}
            winningLine={winningLine}
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
            <li>Click on cells to place X or O based on current turn</li>
            <li>Use the "Current Turn" buttons to select whose move it is</li>
            <li>The board will highlight winning lines in green</li>
            <li>If the board doesn't match turns correctly, use "Fix Turn Order"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
