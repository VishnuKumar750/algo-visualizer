export function generateRecursiveBacktracking(grid, startIndex, finishIndex) {
   let walls = [];
  
    const maze = recursiveBacktracking(grid.length, grid[0].length);

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
  
//   console.log(walls);

   return { walls, grid };
 }
 
 
 function recursiveBacktracking(rows, cols) {
  const maze = Array(rows)
     .fill()
     .map(() => Array(cols).fill(1)); // initialize the maze with walls
 
   const visited = Array(rows)
     .fill()
     .map(() => Array(cols).fill(false)); // initialize the visited flag

   // make boundary around maze
   for(let i=0; i<rows; i++) {
      maze[i][0] = 0;
      visited[i][0] = true;
      maze[i][cols-1] = 0;
      visited[i][cols-1] = true;
   }

   for(let i=0; i<cols; i++) {
      maze[0][i] = 0;
      visited[0][i] = true;
      maze[rows-1][i] = 0;
      visited[rows-1][i] = true;
   }
   visited[2][2] = true; // choose a random starting cell and mark it as visited
   maze[2][2] = 1; // mark the starting cell in the maze

   const stack = [[2, 2]]; // use a stack to keep track of the backtracking
  //  walls.push({row: 2, col: 2});
 
   while (stack.length) {
     const [row, col] = stack[stack.length - 1]; // get the current cell from the top of the stack
     
     
       const potentialNeighbours = [
         [row - 2, col],
         [row, col + 2],
         [row + 2, col],
         [row, col - 2],
         ]; // get all the potential neighbours

         const neighbours = potentialNeighbours.filter(
            ([row, col]) =>
               row > 0 &&
               row < rows - 1 &&
               col > 0 &&
               col < cols - 1 &&
               !visited[row][col]
         ); // get the neighbours that are within the maze and have not been visited

         if (neighbours.length) {
            const chosenIndex = Math.floor(Math.random() * neighbours.length); // choose a random neighbour
            const [row, col] = neighbours[chosenIndex];
            maze[row][col] = 0; // mark the neighbour as visited
            visited[row][col] = true;
            // walls.push({row: row, col: col});
            maze[row + Math.sign(row - stack[stack.length - 1][0])][col + Math.sign(col - stack[stack.length - 1][1])] = 0; // mark the cell between the neighbour and the current cell as visited
            stack.push([row, col]); // push the neighbour to the stack
         }
         else {
            stack.pop(); // if there are no neighbours pop the stack
         }
   }

   return maze;
 }