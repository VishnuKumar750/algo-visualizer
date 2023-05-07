export function generatePrims(grid, rows, cols, startIndex, finishIndex) {   
   // const newArr = [...grid]
   // console.log(grid);

   // Reset the grid
   for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
            grid[i][j].isWall = false;
      }
   }


   divide(grid, 1, 1, rows - 2, cols - 2, startIndex, finishIndex);
   let walls = [];

   for(let i=0;i<rows;i++){
      for(let j=0;j<cols;j++){
            if(i==0 || j==0 || i==rows-1 || j==cols-1){
               grid[i][j].isWall = true;
            }
      }
   }

   grid[startIndex.row][startIndex.col].isWall = false;
   grid[finishIndex.row][finishIndex.col].isWall = false;

   for(let i = 0; i < rows; i++) {
       for(let j = 0; j < cols; j++) {
          if(grid[i][j].isWall) {
            walls.push({ row: i, col: j });
          } 
       }
    }

    


    return walls;
 }
 
 function divide(grid, rowStart, colStart, rowEnd, colEnd, startIndex, finishIndex) {
   const ROW = rowEnd - rowStart;
   const COL = colEnd - colStart;
   
   if (ROW < 2 || COL < 2) {
     return;
   }

   // return if the rowStart and colStart are equal to startIndex and finishIndex
   if(rowStart === startIndex.row && colStart === startIndex.col){
      return;
   }
   if(rowStart === finishIndex.row && colStart === finishIndex.col){
      return;
   }

   // return if the rowEnd or colEnd are equal to startIndex and finishIndex
   if(rowEnd === startIndex.row && colEnd === startIndex.col){
      return;
   }

   if(rowEnd === finishIndex.row && colEnd === finishIndex.col){
      return;
   }
   

   // random orientation
   const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
   
   if (orientation === 'horizontal') {
     const wallRow = Math.floor((Math.random() * (ROW - 1)) / 2) * 2 + 1 + rowStart;
     addHorizontalWall(grid, wallRow, colStart, colEnd);
     divide(grid, rowStart, colStart, wallRow - 1, colEnd, startIndex, finishIndex);
     divide(grid, wallRow + 1, colStart, rowEnd, colEnd, startIndex, finishIndex);
   } else {
     const wallCol = Math.floor((Math.random() * (COL - 1)) / 2) * 2 + 1 + colStart;
     addVerticalWall(grid, wallCol, rowStart, rowEnd);
     divide(grid, rowStart, colStart, rowEnd, wallCol - 1, startIndex, finishIndex);
     divide(grid, rowStart, wallCol + 1, rowEnd, colEnd, startIndex, finishIndex);
   }
 }
 
 function addHorizontalWall(grid, row, start, end) {
   const colStart = Math.min(start, end);
   const colEnd = Math.max(start, end);

   for (let col = colStart; col <= colEnd; col++) {
     grid[row][col].isWall = true;
   }

   // for(let i = 0; i < grid[0].length; i++){
   //    grid[row][i].isWall = true;
   // }

   // console.log('colStart', colStart, 'colEnd', colEnd);
   // console.log(colEnd - colStart + 1);
   let randomSize = Math.floor(Math.random() * (colEnd - colStart + 1)) + colStart;

   // random size gap in the wall and randomSize does not greater than 3

   //  random indices to make a gap in the wall
   const randomIndices = Math.floor(Math.random() * (colEnd - colStart + 1)) + colStart;

   console.log('randomsize', randomSize, colStart);

   if(randomSize > 2){
      randomSize = 2;
   }

   // remove the random length of the wall
   for(let i = 0; i < randomSize; i++){
      grid[row][randomIndices + i].isWall = false;
   }
 }
 
 function addVerticalWall(grid, col, start, end) {
   const rowStart = Math.min(start, end);
   const rowEnd = Math.max(start, end);

   for (let row = rowStart; row <= rowEnd; row++) {
     grid[row][col].isWall = true;
   }

   // for(let i = 0; i < grid.length; i++){
   //    grid[i][col].isWall = true;
   // }

   // make a gap in the wall
   // random size gap in the wall and randomSize does not greater than 2
   let randomSize = Math.floor(Math.random() * (rowEnd - rowStart + 1)) + rowStart;

   //  random indices to make a gap in the wall
   const randomIndices = Math.floor(Math.random() * (rowEnd - rowStart + 1)) + rowStart;

   // console.log(randomSize);
   if(randomSize > 2){
      randomSize = 2;
   }

   // make a gap in the wall
   for(let i = 0; i < randomSize; i++){
      grid[randomIndices + i][col].isWall = false;
   }
 }