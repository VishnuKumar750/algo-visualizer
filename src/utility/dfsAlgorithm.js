export function dfs(grid, startNode, finishNode) {
  // reset the grid to its original state
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[0].length; j++) {
        grid[i][j].isVisited = false;
        grid[i][j].previousNode = null;
        grid[i][j].distance = Infinity;
      }
    }

  
  const visitedNodesInOrder = [];
   const stack = [startNode];
   while (stack.length !== 0) {
     const currentNode = stack.pop();
     if (currentNode.isVisited) continue;

     currentNode.isVisited = true;
     visitedNodesInOrder.push(currentNode);
     if (currentNode === finishNode) return visitedNodesInOrder;
     const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
     for (const neighbor of unvisitedNeighbors) {
       neighbor.previousNode = currentNode;
       stack.push(neighbor);
     }
   }
   
   return visitedNodesInOrder;
 }
 
 function getUnvisitedNeighbors(node, grid) {
   const neighbors = [];
   const { row, col } = node;
   if (row > 0) neighbors.push(grid[row - 1][col]);
   if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
   if (col > 0) neighbors.push(grid[row][col - 1]);
   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
   return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
 }
 
export function getShortestPath(finishNode) {
   const shortestPath = [];
   let currentNode = finishNode;
   while (currentNode !== null) {
     shortestPath.unshift(currentNode);
     currentNode = currentNode.previousNode;
   }
   return shortestPath;
 }
 