class MazeAlgorithmLogic {
   constructor(rows, cols, cellSize) {
      this.rows = rows;
      this.cols = cols;
      this.cellSize = cellSize;
      this.grid = this.generateMaze();
      this.stack = [];
      this.current = this.grid[0][0];
   }

   generateMaze() {
      const grid = [];

      for (let i = 0; i < this.rows; i++) {
         const row = [];

         for (let j = 0; j < this.cols; j++) {
            const cell = {
               visited: false,
               walls: {
                  top: true,
                  right: true,
                  bottom: true,
                  left: true
               },
               x: j,
               y: i
            };
            row.push(cell);
      }
         grid.push(row);
      }

      return grid;
   }

   getNeighbors(cell) {
      const { x, y } = cell;
      const neighbors = [];
      if (x > 0) neighbors.push({ cell: this.grid[x - 1][y], direction: "left" });
      if (y > 0) neighbors.push({ cell: this.grid[x][y - 1], direction: "top" });
      if (x < this.rows - 1)
        neighbors.push({ cell: this.grid[x + 1][y], direction: "right" });
      if (y < this.cols - 1)
        neighbors.push({ cell: this.grid[x][y + 1], direction: "bottom" });
      return neighbors.filter((neighbor) => !neighbor.cell.visited);
    }
  
    removeWall(current, neighbor) {
      const { x: cx, y: cy } = current;
      const { x: nx, y: ny } = neighbor;
      if (cx === nx) {
        if (cy < ny) {
          current.walls.bottom = false;
          neighbor.walls.top = false;
        } else {
          current.walls.top = false;
          neighbor.walls.bottom = false;
        }
      } else {
        if (cx < nx) {
          current.walls.right = false;
          neighbor.walls.left = false;
        } else {
          current.walls.left = false;
          neighbor.walls.right = false;
        }
      }
    }
  
    step() {
      this.current.visited = true;
      const neighbors = this.getNeighbors(this.current);
      if (neighbors.length > 0) {
        const neighborIndex = Math.floor(Math.random() * neighbors.length);
        const { cell: neighbor, direction } = neighbors[neighborIndex];
        this.removeWall(this.current, neighbor);
        this.stack.push(this.current);
        this.current = neighbor;
      } else if (this.stack.length > 0) {
        this.current = this.stack.pop();
      }
    }
  
    generate() {
      while (this.stack.length > 0 || !this.current.visited) {
        this.step();
      }
    }
}

export default MazeAlgorithmLogic;