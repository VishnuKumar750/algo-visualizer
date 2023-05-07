export function generateBinaryTree(grid, startIndex, finishIndex) {
   let walls = [];
 
   // Add boundary walls
   for (let row = 0; row < grid.length; row++) {
     for (let col = 0; col < grid[0].length; col++) {
         grid[row][col].isWall = true;
     }
   }
 
   // carve the path in the 2d array using carving maze algorithm
   generatePath(grid);

   // add walls to the grid
   for (let row = 0; row < grid.length; row++) {
       for (let col = 0; col < grid[0].length; col++) {
             if (grid[row][col].isWall) {
                   walls.push({ row, col });
               }
             }
         }
 
   return walls;
 }
 
   function generatePath(grid) {

   
   }