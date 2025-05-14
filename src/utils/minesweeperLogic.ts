
import { CellType, CellValue, GridType } from '@/components/MinesweeperGrid';

// Create an empty grid with given dimensions
export const createEmptyGrid = (width: number, height: number): GridType => {
  const grid: GridType = [];
  for (let y = 0; y < height; y++) {
    const row: CellType[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        value: 'unrevealed',
        x,
        y,
        predicted: null
      });
    }
    grid.push(row);
  }
  return grid;
};

// Count mines around a cell
export const countAdjacentMines = (grid: GridType, x: number, y: number): number => {
  const height = grid.length;
  const width = grid[0].length;
  let count = 0;

  // Check all 8 surrounding cells
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue; // Skip the center cell

      const newX = x + dx;
      const newY = y + dy;

      // Check if coordinates are valid
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        if (grid[newY][newX].value === 'bomb' || grid[newY][newX].value === 'flag') {
          count++;
        }
      }
    }
  }

  return count;
};

// Get adjacent cells
export const getAdjacentCells = (grid: GridType, x: number, y: number): CellType[] => {
  const height = grid.length;
  const width = grid[0].length;
  const adjacentCells: CellType[] = [];

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        adjacentCells.push(grid[newY][newX]);
      }
    }
  }

  return adjacentCells;
};

// Returns unrevealed adjacent cells
export const getUnrevealedAdjacentCells = (grid: GridType, x: number, y: number): CellType[] => {
  return getAdjacentCells(grid, x, y).filter(
    cell => cell.value === 'unrevealed'
  );
};

// Returns flagged adjacent cells
export const getFlaggedAdjacentCells = (grid: GridType, x: number, y: number): CellType[] => {
  return getAdjacentCells(grid, x, y).filter(
    cell => cell.value === 'flag'
  );
};

// Simple solver to predict bombs based on revealed numbers
export const analyzeBoard = (grid: GridType): GridType => {
  // Create a deep copy of the grid to avoid modifying the original
  const analyzedGrid = JSON.parse(JSON.stringify(grid)) as GridType;
  
  // Reset all predictions
  for (let y = 0; y < analyzedGrid.length; y++) {
    for (let x = 0; x < analyzedGrid[0].length; x++) {
      analyzedGrid[y][x].predicted = null;
    }
  }
  
  // First pass: Find definite bombs (when the number equals unrevealed cells)
  for (let y = 0; y < analyzedGrid.length; y++) {
    for (let x = 0; x < analyzedGrid[0].length; x++) {
      const cell = analyzedGrid[y][x];
      
      // Skip if not a number
      if (typeof cell.value !== 'number' || cell.value === 0) {
        continue;
      }
      
      const unrevealed = getUnrevealedAdjacentCells(analyzedGrid, x, y);
      const flagged = getFlaggedAdjacentCells(analyzedGrid, x, y);
      
      // If the number of unrevealed cells equals the number minus already flagged cells,
      // all unrevealed cells must be bombs
      if (unrevealed.length > 0 && unrevealed.length === cell.value - flagged.length) {
        unrevealed.forEach(uCell => {
          analyzedGrid[uCell.y][uCell.x].predicted = 'bomb';
        });
      }
    }
  }
  
  // Second pass: Find definite safe cells
  for (let y = 0; y < analyzedGrid.length; y++) {
    for (let x = 0; x < analyzedGrid[0].length; x++) {
      const cell = analyzedGrid[y][x];
      
      // Skip if not a number
      if (typeof cell.value !== 'number') {
        continue;
      }
      
      const unrevealed = getUnrevealedAdjacentCells(analyzedGrid, x, y);
      const flagged = getFlaggedAdjacentCells(analyzedGrid, x, y);
      const predictedBombs = getAdjacentCells(analyzedGrid, x, y).filter(c => c.predicted === 'bomb');
      
      // If we have enough flagged cells and predicted bombs, all other unrevealed cells are safe
      if (unrevealed.length > 0 && flagged.length + predictedBombs.length === cell.value) {
        unrevealed.forEach(uCell => {
          // Skip if already predicted as bomb
          if (analyzedGrid[uCell.y][uCell.x].predicted !== 'bomb') {
            analyzedGrid[uCell.y][uCell.x].predicted = 'safe';
          }
        });
      }
    }
  }
  
  return analyzedGrid;
};

// Count how many cells are flagged in the grid
export const countFlaggedCells = (grid: GridType): number => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x].value === 'flag') {
        count++;
      }
    }
  }
  return count;
};

// Count unrevealed cells in the grid
export const countUnrevealedCells = (grid: GridType): number => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x].value === 'unrevealed') {
        count++;
      }
    }
  }
  return count;
};
