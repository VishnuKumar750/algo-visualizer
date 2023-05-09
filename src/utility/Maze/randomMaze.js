export function generateRecursiveDivision(grid, row, col, startIndex, finishIndex) {
  // create maze containing path
  const maze = [];
  for (let i = 0; i < grid.length; i++) {
    maze.push([]);
    for (let j = 0; j < grid[0].length; j++) {
      maze[i].push(1);
    }
  }
  let walls = [];

  recursiveDivison(maze, 0, 0, maze.length - 1, maze[0].length - 1, 'horizontal', true);
  
  maze[startIndex.row][startIndex.col] = 1;
  maze[finishIndex.row][finishIndex.col] = 1;

  for(let i = 0; i < maze.length; i++) {
      for(let j = 0; j < maze[0].length; j++) {
          if(maze[i][j] === 0) {
              grid[i][j].isWall = true;
            walls.push({row: i, col: j});
          }
      }
  }

  return {walls, grid};
}

function recursiveDivison(maze, rowStart, colStart, rowEnd, colEnd, orientation, boundary) {
  // base Case 
  // console.log(rowStart === checkRow, rowStart === checkRowEnd);
  if(rowEnd < rowStart || colEnd < colStart) {
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

  if(orientation === 'horizontal') {
     let possibleRows = [];
     
     for(let i=rowStart + 2; i<=rowEnd - 2; i += 2) {
        // if(i !== checkRow && i !== checkRowEnd) {
           possibleRows.push(i);
        // } 
     }

  //    console.log(possibleRows);
  
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

     if(rowStart === undefined || colStart === undefined || rowEnd === undefined || colEnd === undefined) {
        return;
     }

     // upside of the horizontal line
     // if(currentRow - rowStart < colEnd - colStart) {
        recursiveDivison(maze, rowStart, colStart, currentRow, colEnd, 'vertical', boundary);
     // }
     // // down side of the horizontal line 
     // if(rowEnd - currentRow < colEnd - colStart) {
        recursiveDivison(maze, currentRow, colStart, rowEnd, colEnd, 'horizontal', boundary);
     // }
     
  } else {
     // console.log('vertical ', rowStart, colStart, rowEnd, colEnd);
     let possibleCols = [];
     for(let i=colStart + 2; i<= colEnd - 2; i += 2) {
        possibleCols.push(i);
     }

     let possibleRows = [];
     for(let i=rowStart + 1; i<=rowEnd - 1; i += 2) {
        possibleRows.push(i);
     }
     // console.log(possibleRows);
     // console.log(possibleCols);

     let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
     let randomColIndex = Math.floor(Math.random() * possibleCols.length);

     let currentCol = possibleCols[randomColIndex];
     let rowRandom = possibleRows[randomRowIndex];

     // console.log(currentCol, rowRandom);

     for(let i = rowStart; i < rowEnd; i++) {
        for(let j = colStart; j < colEnd; j++) {
           if(j === currentCol && i !== rowRandom && j > colStart + 1 && j < colEnd - 1) {
              maze[i][j] = 0;
           }
        }
     }

     if(rowStart === undefined || colStart === undefined || rowEnd === undefined || colEnd === undefined) {
        return;
     }


     // if(currentCol - colStart < rowEnd - rowStart) {
        recursiveDivison(maze, rowStart, colStart, rowEnd, currentCol , 'horizontal', boundary);
     // } 
     //  if(colEnd - currentCol < rowEnd - rowStart){
        recursiveDivison(maze, rowStart, currentCol, rowEnd, colEnd, 'vertical', boundary);
     // }
  }
}
