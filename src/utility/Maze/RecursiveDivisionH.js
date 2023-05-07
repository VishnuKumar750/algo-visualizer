export function RecursiveDivisonHorizontal(grid, rows, cols, startIndex, finishIndex) {
   // console.log(startIndex, finishIndex);
   let walls = [];

   const maze = Array(rows).fill().map(() => Array(cols).fill(1));

   recursiveDivison(maze, 0, 0, maze.length - 1, maze[0].length - 1, 'horizontal', true, 0, startIndex.row, startIndex.col, finishIndex.row, finishIndex.col);


   maze[startIndex.row][startIndex.col] = 1;
   maze[finishIndex.row][finishIndex.col] = 1;

   for(let i=0; i<maze.length; i++) {
      for(let j=0; j<maze[0].length; j++) {
         if(maze[i][j] === 0) {
            walls.push({row: i, col: j});
            grid[i][j].isWall = true;
         } 
      }
   }

   return walls;
}

function recursiveDivison(maze, rowStart, colStart, rowEnd, colEnd, boundary, checkRow, checkCol, checkRowEnd, checkColEnd) {
      // base Case 
      if(rowStart === checkRow || rowEnd === checkRowEnd  || rowEnd < rowStart || colEnd < colStart) {
         return;
      }
   
      // add boundary to the maze
      if(boundary) {
         for(let i=0; i<maze.length; i++) {
            maze[i][0] = 0;
            maze[i][maze[0].length - 1] = 0;
         }
   
         for(let i=0; i<maze[0].length; i++) {
            maze[0][i] = 0;
            maze[maze.length - 1][i] = 0;
         }
   
         boundary = false;
      }
   
         let possibleRows = [];
         
         for(let i=rowStart + 2; i<=rowEnd - 2; i += 2) {
            possibleRows.push(i);
         }
      
         let possibleCols = [];
         for(let i=colStart + 1; i<= colEnd - 1; i += 2) {
            possibleCols.push(i);
         }
      
         let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
         let randomColIndex = Math.floor(Math.random() * possibleCols.length);
   
         let currentRow = possibleRows[randomRowIndex];
         let colRandom = possibleCols[randomColIndex];
   
      
         for(let i = rowStart; i < rowEnd; i++) {
            for(let j = colStart; j < colEnd; j++) {
               if(i > rowStart + 1 && j !== 0 && i < rowEnd - 1 && j < colEnd && i === currentRow && j !== colRandom) {
                  // console.log(i, j);
                  maze[i][j] = 0;
               }
            }
         }
   
         // upside of the horizontal line
         if(currentRow - rowStart < colEnd - colStart) {
            recursiveDivison(maze, rowStart, colStart, currentRow, colEnd, 'horizontal', boundary, checkRow, checkCol, checkRowEnd, checkColEnd);
         }
         // down side of the horizontal line 
         if(rowEnd - currentRow < colEnd - colStart) {
            recursiveDivison(maze, currentRow, colStart, rowEnd, colEnd, 'horizontal', boundary, checkRow, checkCol, checkRowEnd, checkColEnd);
         }
}