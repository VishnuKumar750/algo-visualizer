export function bfs(grid, startIndex, finishIndex) {
   let maze = [];

   // console.log('bfs', grid);

   for (let i = 0; i < grid.length; i++) {
      maze[i] = [];
      for (let j = 0; j < grid[0].length; j++) {
         maze[i][j] = grid[i][j].isWall ? 1 : 0;
      }
   }

   maze[startIndex.row][startIndex.col] = 2;
   maze[finishIndex.row][finishIndex.col] = 3;


   let visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));

   let visitedNodesInOrder = [];
   let shortestPath = [];


   let stack = [];
   stack.push([startIndex.row, startIndex.col]);

   let found = false;

   while (stack.length > 0) {
      const curr = stack.shift();
      const currRow = curr[0];
      const currCol = curr[1];

      if(visited[currRow][currCol]) {
         continue;
      }

      if(currRow === finishIndex.row && currCol === finishIndex.col) {
         found = true;
         visitedNodesInOrder.push({ row: curr[0], col: curr[1], ...curr, backtrack: false });
         break;
      }

      visitedNodesInOrder.push({ row: curr[0], col:curr[1], ...curr , backtrack: false });
      visited[currRow][currCol] = true;

      const neighbors = getAllNeighbors(maze, currRow, currCol, visited);
      for(let i = 0; i < neighbors.length; i++) {
         const neighbor = neighbors[i];
         neighbor.previousNode = { row: currRow, col: currCol };
         stack.push(neighbor);
      }
   }

   if(found) {
      // console.log("found");
      // find the visited Nodes shortest path
      let curr = visitedNodesInOrder[visitedNodesInOrder.length - 1];
      // console.log(curr);
      shortestPath = getshortestPath(visitedNodesInOrder, curr, startIndex);
   }

   // console.log(shortestPath);
   // console.log(visitedNodesInOrder);

   return { visitedNodesInOrder, shortestPath };
}


function getAllNeighbors(maze, row, col) {
   const unvisitedNeighbors = [];

   if (row > 0  && maze[row-1][col] !== 1) unvisitedNeighbors.push([row - 1, col]);
   if (row < maze.length - 1 && maze[row+1][col] !== 1) unvisitedNeighbors.push([row + 1, col]);
   if (col > 0  && maze[row][col - 1] !== 1 ) unvisitedNeighbors.push([row, col - 1]);
   if (col < maze[0].length - 1 && maze[row][col + 1] !== 1 ) unvisitedNeighbors.push([row, col + 1]);

   return unvisitedNeighbors;
}

function getshortestPath(visitedNodesInOrder, curr, startIndex) {
   let shortestPath = [];
   let row = curr.row;
   let col = curr.col;
   let previousNode = curr.previousNode;

   while(!(row === startIndex.row && col === startIndex.col)) {
      // console.log(curr.row, curr.col, curr.previousNode);
      // console.log('started');
      shortestPath.unshift({ row: row, col: col });

      let currNode = visitedNodesInOrder.filter((node) => {
         if(node.row === previousNode.row && node.col === previousNode.col) {
            return node;
         }
      }
      )[0];

      row = currNode.row;
      col = currNode.col;
      previousNode = currNode.previousNode;
   }

   shortestPath.unshift({ row: startIndex.row, col: startIndex.col });

   return shortestPath;
}
