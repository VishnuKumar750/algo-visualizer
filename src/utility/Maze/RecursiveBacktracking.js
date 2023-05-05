export function generateRecursiveBacktracking(grid, startIndex, finishIndex) {
   let walls = [];
 
   // Add boundary walls
   for (let row = 0; row < grid.length; row++) {
     for (let col = 0; col < grid[0].length; col++) {
       if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[0].length - 1) {
         walls.push({ row, col });
         grid[row][col].isWall = true;
       }
     }
   }
 
   // Add inner walls using recursive backtracking
   const stack = [{ row: 1, col: 1 }];
   while (stack.length) {
     const current = stack[stack.length - 1];
     grid[current.row][current.col].isVisited = true;
 
     const neighbors = getUnvisitedNeighbors(grid, current);
     if (neighbors.length) {
       const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
       removeWallBetween(grid, current, randomNeighbor);
       stack.push(randomNeighbor);
     } else {
       stack.pop();
     }
   }
 
   // Add random walls
   for (let row = 2; row < grid.length - 2; row++) {
     for (let col = 2; col < grid[0].length - 2; col++) {
       if (Math.random() < 0.3) {
         const wall = { row, col };
         if (
           (row === startIndex.row && col === startIndex.col) ||
           (row === finishIndex.row && col === finishIndex.col)
         ) {
           continue;
         }
         walls.push(wall);
         grid[row][col].isWall = true;
       }
     }
   }
 
   return walls;
 }
 
 function getUnvisitedNeighbors(grid, node) {
   const neighbors = [];
   const { row, col } = node;
 
   if (row > 2 && !grid[row - 2][col].isVisited) {
     neighbors.push({ row: row - 2, col: col });
   }
   if (col > 2 && !grid[row][col - 2].isVisited) {
     neighbors.push({ row: row, col: col - 2 });
   }
   if (row < grid.length - 3 && !grid[row + 2][col].isVisited) {
     neighbors.push({ row: row + 2, col: col });
   }
   if (col < grid[0].length - 3 && !grid[row][col + 2].isVisited) {
     neighbors.push({ row: row, col: col + 2 });
   }
 
   return neighbors;
 }
 
 function removeWallBetween(grid, nodeA, nodeB) {
   const rowDiff = nodeA.row - nodeB.row;
   const colDiff = nodeA.col - nodeB.col;
 
   if (rowDiff === 0) {
     if (colDiff > 0) {
       grid[nodeA.row][nodeA.col - 1].isWall = false;
     } else {
       grid[nodeA.row][nodeA.col + 1].isWall = false;
     }
   } else if (rowDiff > 0) {
     grid[nodeA.row - 1][nodeA.col].isWall = false;
   } else {
     grid[nodeA.row + 1][nodeA.col].isWall = false;
   }
 }
 