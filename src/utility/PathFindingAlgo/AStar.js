function heuristic(row1, col1, row2, col2) {
  // Manhattan distance heuristic
  return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

export function astarSearch(grid, source, destination) {
  const rows = grid.length;
  const cols = grid[0].length;

  const matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix.push([]);
    for (let j = 0; j < cols; j++) {
      matrix[i].push(grid[i][j].isWall ? 1 : 0);
    }
  }

  let visitedNodesInOrder = [];
  let shortestPath = [];

  const distances = Array(rows).fill().map(() => Array(cols).fill(Infinity));
  distances[source.row][source.col] = 0;
  visitedNodesInOrder.push({ row: source.row, col: source.col });

  const visited = Array(rows).fill().map(() => Array(cols).fill(false));
  const prev = Array(rows).fill().map(() => Array(cols).fill(null));

  const getNeighbors = (row, col) => {
    const neighbors = [];
    if (row > 0 && matrix[row - 1][col] === 0) {
      neighbors.push([row - 1, col]);
    }
    if (row < rows - 1 && matrix[row + 1][col] === 0) {
      neighbors.push([row + 1, col]);
    }
    if (col > 0 && matrix[row][col - 1] === 0) {
      neighbors.push([row, col - 1]);
    }
    if (col < cols - 1 && matrix[row][col + 1] === 0) {
      neighbors.push([row, col + 1]);
    }
    return neighbors;
  };

  const getDistance = (row1, col1, row2, col2) => {
    if (row1 === row2 && col1 === col2) {
      return 0;
    }
    return 1;
  };

  let flag = true

  while (flag) {
    let currentRow = null;
    let currentCol = null;
    let currentDistance = Infinity;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!visited[row][col] && distances[row][col] + heuristic(row, col, destination.row, destination.col) < currentDistance) {
          currentRow = row;
          currentCol = col;
          currentDistance = distances[row][col] + heuristic(row, col, destination.row, destination.col);
        }
      }
    }

    if (currentDistance === Infinity) {
      // No reachable path found
      flag = false;
      return { visitedNodesInOrder, shortestPath };
    }

    if (currentRow === destination.row && currentCol === destination.col) {
      // Shortest path found
      const path = [];
      let row = destination.row;
      let col = destination.col;
      while (prev[row][col]) {
        path.push({ row, col });
        [row, col] = prev[row][col];
      }
      path.push({ row, col });
      path.reverse();
      shortestPath = path;

      flag = false;
      return { visitedNodesInOrder, shortestPath };
    }

    visited[currentRow][currentCol] = true;
    visitedNodesInOrder.push({ row: currentRow, col: currentCol });

    const neighbors = getNeighbors(currentRow, currentCol);
    for (const [neighborRow, neighborCol] of neighbors) {
      const distance = distances[currentRow][currentCol] + getDistance(currentRow, currentCol, neighborRow, neighborCol);
      if (distance < distances[neighborRow][neighborCol]) {
        distances[neighborRow][neighborCol] = distance;
        prev[neighborRow][neighborCol] = [currentRow, currentCol];
      }
    }
  }
}
