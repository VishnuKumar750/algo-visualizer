export function generateRecursiveDivision(grid, row, col, startIndex, finishIndex) {
  const maze = Array.from({ length: row }, () =>
      Array.from({ length: col }, () => ' ')
   );

   let walls = [];

   // call the recursive division algorithm
   recursiveDivision(maze, walls, 0, 0, col - 1, row - 1, chooseOrientation(col, row));

   // add boundary walls to the maze 
   for(let i = 0; i < maze.length; i++) {
      maze[i][0] = '█';
   }
   for(let i = 0; i < maze.length; i++) {
      maze[i][maze[0].length - 1] = '█';
   }

   for(let i = 0; i < maze[0].length; i++) {
      maze[0][i] = '█';
      maze[maze.length - 1][i] = '█';
   }


   for(let i = 0; i < maze.length; i++) {
      for(let j = 0; j < maze[0].length; j++) {
         if(maze[i][j] === ' ') {
            maze[i][j] = 's';
            walls.filter((wall) => {
                if(wall.row === i && wall.col === j) {
                    return false;
                }
                return true;
              } 
            )
         }
      }
   }

   for(let i = 0; i < maze.length; i++) {
      for(let j = 0; j < maze[0].length; j++) {
         if(maze[i][j] === '█') {
            walls.push({ row: i, col: j });
         } 
      }
   }

   for(let i = 0; i < maze.length; i++) {
    for(let j = 0; j < maze[0].length; j++) {
       if(maze[i][j] === 's') {
          walls = walls.filter((wall) => {
              if(wall.row === i && wall.col === j) {
                  return false;
              }
              return true;
            } 
          )
       }
    }
 }

  //  remove the startIndex and finish Index from the walls array
  walls = walls.filter((wall) => {
    if(wall.row === startIndex.row && wall.col === startIndex.col) {
      return false;
    }
    if(wall.row === finishIndex.row && wall.col === finishIndex.col) {
      return false;
    }
    return true;
  })

  for(let i = 0; i < walls.length; i++) {
    grid[walls[i].row][walls[i].col].isWall = true;
  }

      console.log(maze);
 
   return walls;
}

function recursiveDivision(maze,walls, x1, y1, x2, y2, orientation) {
  while (x2 >= x1 && y2 >= y1) {
    if (orientation === "horizontal") {
      // divide the maze horizontally
      let y = Math.floor(randomNumber(y1 + 1, y2 - 1) / 2) * 2;
      for (let x = x1; x <= x2; x++) {
        maze[y][x] = '█';
      }

      // create a hole in the wall
      const holeX = Math.floor(randomNumber(x1, x2) / 2) * 2 + 1;
      maze[y][holeX] = 's';

      // recursively divide the sub-mazes
      recursiveDivision(maze, walls, x1, y1, x2, y - 1, chooseOrientation(x2 - x1 + 1, y - y1));
      y = y + 2;
      y1 = y;
    } else {
      // divide the maze vertically
      let x = Math.floor(randomNumber(x1 + 1, x2 - 1) / 2) * 2;
      for (let y = y1; y <= y2; y++) {
        maze[y][x] = '█';
      }

      // create a hole in the wall
      const holeY = Math.floor(randomNumber(y1, y2) / 2) * 2 + 1;
      maze[holeY][x] = 's';

      // recursively divide the sub-mazes
      recursiveDivision(maze,walls, x1, y1, x - 1, y2, chooseOrientation(x - x1, y2 - y1 + 1));
      x = x + 2;
      x1 = x;
    }
    orientation = chooseOrientation(x2 - x1, y2 - y1);
  }
}


// function to choose the orientation of the wall to be divided
function chooseOrientation(width, height) {
  return width < height ? "horizontal" : "vertical";
}

// function to generate a random number
function randomNumber(min, max) {
  // console.log('min', min, 'max', max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}