export function astarSearch(grid, start, finish) {
   console.log('astarSearch', grid, start, finish);
   const visitedNodesInOrder = [];
   const unvisitedNodes = getAllNodes(grid);
   start.distance = 0;
   const shortestPath = [];
 
   while (unvisitedNodes.length !== 0) {
     sortNodesByDistance(unvisitedNodes);
     const closestNode = unvisitedNodes.shift();
 
     if (closestNode.isWall) continue;
     if (closestNode.distance === Infinity) return visitedNodesInOrder;
 
     closestNode.isVisited = true;
     visitedNodesInOrder.push(closestNode);
 
     if (closestNode === finish) {
       shortestPath.push(closestNode);
       let currentNode = closestNode;
       while (currentNode.previousNode) {
         shortestPath.unshift(currentNode.previousNode);
         currentNode = currentNode.previousNode;
       }
       break;
     }
 
     updateUnvisitedNeighbors(closestNode, grid, finish);
   }
   return { visitedNodesInOrder, shortestPath };
 }
 
 function getAllNodes(grid) {
   const nodes = [];
   for (let row of grid) {
     for (let node of row) {
       nodes.push(node);
     }
   }
   return nodes;
 }
 
 function sortNodesByDistance(unvisitedNodes) {
   unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
 }
 
 function updateUnvisitedNeighbors(node, grid, finish) {
   const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
   for (let neighbor of unvisitedNeighbors) {
     const tentativeDistance = node.distance + 1 + calculateDistance(neighbor, finish);
     if (tentativeDistance < neighbor.distance) {
       neighbor.distance = tentativeDistance;
       neighbor.previousNode = node;
     }
   }
 }
 
 function getUnvisitedNeighbors(node, grid) {
   const neighbors = [];
   const { col, row } = node;
   if (row > 0) neighbors.push(grid[row - 1][col]);
   if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
   if (col > 0) neighbors.push(grid[row][col - 1]);
   if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
   return neighbors.filter(neighbor => !neighbor.isVisited);
 }
 
 function calculateDistance(nodeA, nodeB) {
   const x1 = nodeA.col;
   const y1 = nodeA.row;
   const x2 = nodeB.col;
   const y2 = nodeB.row;
   const xDistance = Math.abs(x2 - x1);
   const yDistance = Math.abs(y2 - y1);
   return xDistance + yDistance;
 }
 