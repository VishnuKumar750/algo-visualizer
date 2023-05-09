export function generateEllers(grid, startIndex, finishIndex) {
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
 
   // Generate rows and remove walls
   const numRows = grid.length - 2;
   const numCols = grid[0].length - 2;
   let sets = [];
   for (let row = 1; row < numRows; row++) {
     for (let col = 1; col < numCols; col++) {
       grid[row][col].isVisited = true;
       if (row === 1) {
         sets.push(col);
         console.log(sets);
       } else {
         if (sets.indexOf(col) === -1 && Math.random() < 0.4) {
           const randomIndex = Math.floor(Math.random() * sets.length);
           console.log(sets);
           const setCol = sets[randomIndex];
           console.log(row, setCol);
           removeVerticalWall(grid, row, setCol);
           sets = sets.filter((setCol) => setCol !== setCol);
         } else {
           sets.push(col);
           removeHorizontalWall(grid, row, col);
         }
       }
     }
     if (sets.length) {
       const randomIndex = Math.floor(Math.random() * sets.length);
       const setCol = sets[randomIndex];
       console.log( 'setcol', row, setCol);
       removeVerticalWall(grid, row, setCol);
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
 
 function removeVerticalWall(grid, row, col) {
   grid[row][col].isWall = false;
   grid[row][col - 1].isWall = false;
 }
 
 function removeHorizontalWall(grid, row, col) {
   grid[row][col].isWall = false;
   grid[row - 1][col].isWall = false;
 }
 