
import { GridType, CellValue } from '@/components/TicTacToeGrid';

// Create an empty 3x3 grid
export const createEmptyGrid = (): GridType => {
  return Array(3).fill(null).map(() => Array(3).fill(null));
};

// Check if the grid is full
export const isGridFull = (grid: GridType): boolean => {
  return grid.every(row => row.every(cell => cell !== null));
};

// Check for a winner
export const checkWinner = (grid: GridType): { winner: CellValue; line: number[][] } | null => {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (grid[i][0] !== null && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
      return { winner: grid[i][0], line: [[i, 0], [i, 1], [i, 2]] };
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (grid[0][i] !== null && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
      return { winner: grid[0][i], line: [[0, i], [1, i], [2, i]] };
    }
  }

  // Check diagonals
  if (grid[0][0] !== null && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
    return { winner: grid[0][0], line: [[0, 0], [1, 1], [2, 2]] };
  }
  if (grid[0][2] !== null && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
    return { winner: grid[0][2], line: [[0, 2], [1, 1], [2, 0]] };
  }

  return null;
};

// Find the best move for a player
export const findBestMove = (grid: GridType, player: CellValue): [number, number] | null => {
  // If we can win in the next move, do it
  const winningMove = findWinningMove(grid, player);
  if (winningMove) {
    return winningMove;
  }

  // If opponent can win in their next move, block them
  const opponent = player === 'X' ? 'O' : 'X';
  const blockingMove = findWinningMove(grid, opponent);
  if (blockingMove) {
    return blockingMove;
  }

  // Try to take the center
  if (grid[1][1] === null) {
    return [1, 1];
  }

  // Try to take the corners
  const corners = [
    [0, 0], [0, 2], [2, 0], [2, 2]
  ];
  
  for (const [row, col] of corners) {
    if (grid[row][col] === null) {
      return [row, col];
    }
  }

  // Take any available edge
  const edges = [
    [0, 1], [1, 0], [1, 2], [2, 1]
  ];
  
  for (const [row, col] of edges) {
    if (grid[row][col] === null) {
      return [row, col];
    }
  }

  return null;
};

// Find a move that would result in a win
const findWinningMove = (grid: GridType, player: CellValue): [number, number] | null => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row][col] === null) {
        // Try this move
        const gridCopy = JSON.parse(JSON.stringify(grid));
        gridCopy[row][col] = player;
        
        // Check if this move would result in a win
        const result = checkWinner(gridCopy);
        if (result && result.winner === player) {
          return [row, col];
        }
      }
    }
  }
  
  return null;
};

// Evaluate the board for minimax
const evaluate = (grid: GridType, depth: number): number => {
  const result = checkWinner(grid);
  
  if (result) {
    if (result.winner === 'X') {
      return 10 - depth; // X wins
    }
    if (result.winner === 'O') {
      return depth - 10; // O wins
    }
  }
  
  if (isGridFull(grid)) {
    return 0; // Draw
  }
  
  return -999; // No result yet
};

// Count the number of each symbol on the board
export const countSymbols = (grid: GridType): { X: number; O: number; empty: number } => {
  let xCount = 0;
  let oCount = 0;
  let emptyCount = 0;
  
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell === 'X') xCount++;
      else if (cell === 'O') oCount++;
      else emptyCount++;
    });
  });
  
  return { X: xCount, O: oCount, empty: emptyCount };
};

// Determine whose turn it should be based on the board state
export const determineTurn = (grid: GridType): CellValue => {
  const counts = countSymbols(grid);
  return counts.X <= counts.O ? 'X' : 'O';
};
