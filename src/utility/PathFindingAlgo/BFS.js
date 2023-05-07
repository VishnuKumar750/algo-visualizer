export function bfs(grid, startIndex, finishIndex) {
   let walls = [];
   let queue = [];
   let path = [];
   let found = false;

   queue.push(startIndex);
   grid[startIndex.row][startIndex.col].isVisited = true;
   

   while(queue.length > 0) {
      let current = queue.shift();
      let {row, col} = current;
      walls.push({row, col});
      // console.log(current);

      if(row === finishIndex.row && col === finishIndex.col) {
         found = true;
         break;
      }

      let neighbors = getNeighbors(grid, current);
      for(let i=0; i<neighbors.length; i++) {
         let neighbor = neighbors[i];
         if(!grid[neighbor.row][neighbor.col].isVisited) {
            queue.push(neighbor);
            grid[neighbor.row][neighbor.col].isVisited = true;
            grid[neighbor.row][neighbor.col].previousNode = current;
         }
      }
   }

   // console.log(visited);

   if(found) {
      let current = finishIndex;
      while(current !== null) {
         path.push(current);
         current = grid[current.row][current.col].previousNode;
      }
      path.reverse();
   }


   // console.log(walls);

   return {path, walls};
   // return [];
}

function getNeighbors(grid, current) {
   let neighbors = [];
   let {row, col} = current;

   if(row > 0) {
      if(!grid[row - 1][col].isWall) {
         neighbors.push({row: row - 1, col: col});
      }
   }

   if(row < grid.length - 1) {
      if(!grid[row + 1][col].isWall) {
         neighbors.push({row: row + 1, col: col});
      }
   }

   if(col > 0) {
      if(!grid[row][col - 1].isWall) {
         neighbors.push({row: row, col: col - 1});
      }
   }

   if(col < grid[0].length - 1) {
      if(!grid[row][col + 1].isWall) {
         neighbors.push({row: row, col: col + 1});
      }
   }

   return neighbors;
}