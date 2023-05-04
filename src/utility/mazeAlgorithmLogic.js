// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
   // console.log("dijkstra", grid, startNode, finishNode);
   const visitedNodesInOrder = [];
   startNode.distance = 0;
   const unvisitedNodes = getAllNodes(grid);
   while (unvisitedNodes.length > 0) {
     sortNodesByDistance(unvisitedNodes);
     const closestNode = unvisitedNodes.shift();
     // If we encounter a wall, we skip it.
     if (closestNode.isWall) continue;
     // If the closest node is at a distance of infinity,
     // we must be trapped and should therefore stop.
     if (closestNode.distance === Infinity) return visitedNodesInOrder;
     closestNode.isVisited = true;
     visitedNodesInOrder.push(closestNode);
     if (closestNode === finishNode) return visitedNodesInOrder;
     updateUnvisitedNeighbors(closestNode, grid);
   }
 }

export function dfs(grid, startNode, finishNode) {
   const visitedNodesInOrder = [];
   const unvisitedNodes = getAllNodes(grid);
   const stack = [];
   stack.push(startNode);
   while (stack.length > 0) {
      const currentNode = stack.pop();
      if (currentNode.isWall) continue;
      if (currentNode.isVisited) continue;
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) return visitedNodesInOrder;
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
         neighbor.previousNode = currentNode;
         stack.push(neighbor);
      }
   }
   return visitedNodesInOrder;
}

export function bfs(grid, startNode, finishNode) {
   const visitedNodesInOrder = [];
   const unvisitedNodes = getAllNodes(grid);
   const queue = [];
   queue.push(startNode);
   while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode.isWall) continue;
      if (currentNode.isVisited) continue;
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      if (currentNode === finishNode) return visitedNodesInOrder;
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
         neighbor.previousNode = currentNode;
         queue.push(neighbor);
      }
   }
   return visitedNodesInOrder;
}

export function aStar(grid, startNode, finishNode) {
   const visitedNodesInOrder = [];
   const unvisitedNodes = getAllNodes(grid);
   startNode.distance = 0;
   while (unvisitedNodes.length > 0) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighborsAStar(closestNode, finishNode, grid);
   }
   return visitedNodesInOrder;
}

function updateUnvisitedNeighborsAStar(node, finishNode, grid) {
   const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
   for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
      neighbor.heuristic = manhattanDistance(neighbor, finishNode);
   }
}

function manhattanDistance(node, finishNode) {
   const x = Math.abs(node.col - finishNode.col);
   const y = Math.abs(node.row - finishNode.row);
   return x + y;
}


 
 function sortNodesByDistance(unvisitedNodes) {
   unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
 }
 
 function updateUnvisitedNeighbors(node, grid) {
   const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
   for (const neighbor of unvisitedNeighbors) {
     neighbor.distance = node.distance + 1;
     neighbor.previousNode = node;
   }
 }
 
 function getUnvisitedNeighbors(node, grid) {
   const neighbors = [];
   const {col, row} = node;
   if (row > 0) neighbors.push(grid[row - 1][col]);
   if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
   if (col > 0) neighbors.push(grid[row][col - 1]);
   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
   return neighbors.filter(neighbor => !neighbor.isVisited);
 }
 
 function getAllNodes(grid) {
   const nodes = [];
   for (const row of grid) {
     for (const node of row) {
       nodes.push(node);
     }
   }
   return nodes;
 }
 
 // Backtracks from the finishNode to find the shortest path.
 // Only works when called *after* the dijkstra method above.
 export function getNodesInShortestPathOrder(finishNode) {
   const nodesInShortestPathOrder = [];
   let currentNode = finishNode;
   while (currentNode !== null) {
     nodesInShortestPathOrder.unshift(currentNode);
     currentNode = currentNode.previousNode;
   }
   return nodesInShortestPathOrder;
 }
 