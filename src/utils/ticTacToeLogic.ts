
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

// Determine whose turn it should be based on the board state
export const determineTurn = (grid: GridType): CellValue => {
  let xCount = 0;
  let oCount = 0;
  
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell === 'X') xCount++;
      else if (cell === 'O') oCount++;
    });
  });
  
  return xCount <= oCount ? 'X' : 'O';
};
