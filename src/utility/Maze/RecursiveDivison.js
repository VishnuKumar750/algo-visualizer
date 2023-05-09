export function generateRecursiveDivisionMaze(grid, startIndex, finishIndex) {
   const walls = [];
   
   // Add boundary walls
   for (let row = 0; row < grid.length; row++) {
     for (let col = 0; col < grid[0].length; col++) {
       if (row === 0 || row === grid.length - 1 || col === 0 || col === grid[0].length - 1) {
         walls.push({ row, col });
         grid[row][col].isWall = true;
       }
     }
   }
 
   divide(1, 1, grid.length - 2, grid[0].length - 2, pickOrientation(grid.length, grid[0].length), grid, walls, startIndex, finishIndex);
   
   return walls;
 }
 
 function divide(x, y, width, height, orientation, grid, walls, startIndex, finishIndex) {
   if (width < 2 || height < 2) {
     return;
   }
 
   let horizontal = orientation === 'horizontal';
   let wx = x + (horizontal ? 0 : Math.floor(Math.random() * (width - 1)));
   let wy = y + (horizontal ? Math.floor(Math.random() * (height - 1)) : 0);
   
   let dx = horizontal ? 1 : 0;
   let dy = horizontal ? 0 : 1;
 
   let length = horizontal ? width : height;
 
   let door = { row: wy + dy, col: wx + dx };
   let wall = { row: wy, col: wx };
 
   for (let i = 0; i < length; i++) {
     if (wx !== startIndex.col || wy !== startIndex.row || i !== Math.floor(length / 2)) {
       walls.push(wall);
       grid[wy][wx].isWall = true;
     }
     
     wx += dx;
     wy += dy;
   }
 
   let nx = x;
   let ny = y;
   let w = horizontal ? width : wx - x;
   let h = horizontal ? wy - y : height;
   divide(nx, ny, w, h, pickOrientation(w, h), grid, walls, startIndex, finishIndex);
 
   nx = horizontal ? x : wx + 1;
   ny = horizontal ? wy + 1 : y;
   w = horizontal ? width : x + width - wx - 1;
   h = horizontal ? y + height - wy - 1 : height;
   divide(nx, ny, w, h, pickOrientation(w, h), grid, walls, startIndex, finishIndex);
 }
 
 function pickOrientation(width, height) {
   if (width < height) {
     return 'horizontal';
   } else if (height < width) {
     return 'vertical';
   } else {
     return Math.random() < 0.5 ? 'horizontal' : 'vertical';
   }
 }
 