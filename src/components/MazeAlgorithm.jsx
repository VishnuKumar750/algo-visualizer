import { useCallback, useEffect, useMemo, useState } from 'react'
import { BiReset } from 'react-icons/bi';
import { FaPlay } from 'react-icons/fa';

import './MazeAlgorithm.css';
import {  dijkstra, getNodesInShortestPathOrder } from '../utility/mazeAlgorithmLogic';
import { dfs } from '../utility/dfsAlgorithm';
import { astarSearch } from '../utility/AStar';
import { generateRecursiveDivision } from '../utility/Maze/randomMaze';
import { generateRecursiveBacktracking } from '../utility/Maze/RecursiveBacktracking';
import { generateEllers } from '../utility/Maze/Ellers';
import { generatePrims } from '../utility/Maze/RandomPrims';
import { RecursiveDivisonHorizontal } from '../utility/Maze/RecursiveDivisionH';
import { bfs } from '../utility/PathFindingAlgo/BFS';
import { generatePath } from '../utility/PathFindingAlgo/RandomAlgo';

const Algorithms = [
  { name: 'Path Finding Algo', value: -1},
  { name: 'Dijkstra', value: 0 },
  { name: 'A* Search', value: 1 },
  { name: 'Depth First Search', value: 2 },
  { name: 'Breadth First Search', value: 3 },
  { name: 'Random Algo', value: 4 },
]



const MazeAlgorithm = () => {
  const [ rows, setRows ] = useState(18); 
  const [cols, setCols] = useState(15);
  const [array, setArray] = useState([]);
  const [options , setOptions] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [ dragStart , setDragStart ] = useState(false);
  const [ MazeOptions, setMazeOptions ] = useState(-1);
  const [ startIndex, setStartIndex ] = useState({
    row: 8,
    col: 2,
  });
  const [ finishIndex, setFinishIndex ] = useState({
    row: 8,
    col: 17,
  });

  // set the state of rows and cols for responsive screens
  useEffect(() => {
    function HandleResize () {
      if(window.innerWidth < 768) {
        setCols(20);
        setRows(15);
        setStartIndex({row: 8, col: 2});
        setFinishIndex({row: 8, col: 17})
      } else if(window.innerWidth > 768 && window.innerWidth < 1023) {
        setCols(30);
        setRows(17);
        setStartIndex({row: 8, col: 2});
        setFinishIndex({row: 8, col: 27})
      } else if(window.innerWidth > 1024) {
        setCols(50);
        setRows(17);
        setStartIndex({row: 8, col: 12});
        setFinishIndex({row: 8, col: 37})
      } else {
        setCols(50);
        setRows(17);
        setStartIndex({row: 8, col: 12});
        setFinishIndex({row: 8, col: 37})
      }
    }
    HandleResize();
    window.addEventListener('resize', HandleResize);

    return () => {
      window.removeEventListener('resize', HandleResize);
    }
  }, [])

  // Intializing the board with rows and cols
  useMemo(() => { 
    // Intializing the board
    const board = getInitialGrid(rows, cols, startIndex, finishIndex)
    setArray(board);
  },[ rows, cols])


  // useEffect(() => { console.log('array', array)}, [array]);

  // Drag and drop Feature
  const handleClick = useCallback((e, row, col, node) => {
    e.preventDefault();
    // set the property of iswall to true
    const { isStart, isFinish, isWall } = node;

    if(isStart || isFinish) return;
    

  const Arr = [...array];

  // console.log(newArr);
    // set the wall to true
  if(!isWall) {
    Arr[row][col].isWall = true;
    document.getElementById(`node-${row}-${col}`).classList.add('wall');
  } else {
    Arr[row][col].isWall = false;
    document.getElementById(`node-${row}-${col}`).classList.remove('wall');
  }


  setArray(Arr);

  },[array])

  const [pos, setPos] = useState({row: 0, col: 0 });

  // handle mouse down
  const handleMouseDown = useCallback((e, node) => {
    e.preventDefault();
    if(e.button === 0) {
      // console.log(node);
    const { isStart, isFinish } = node
    if(isStart || isFinish) {
      setDragStart(true);
      setPos({row: node.row, col: node.col })

    } else {
      setDragStart(false);
    }
    }
  },[])

  // handle mouse move 
  const handleMouseMove = useCallback((e, row, col) => {
    e.preventDefault();
    if(e.buttons === 1) {
      try {
      // console.log(node);   
      if(dragStart)  {
        // console.log('drag start');
        // console.log('mouse move', row, col);
        setPos(prev => ({...prev, row, col}));

        const { isStart, isFinish } = array[pos.row][pos.col];

        if(array[row][col].isStart || array[row][col].isFinish) return;

      let newStartIndex = startIndex;
      let newFinishIndex = finishIndex;


    const newArr = array.map((rowArr, rowIndex) => {
      return rowArr.map((node, colIndex) => {
        let isNodeStart = false;
        let isNodeFinish = false;

      if (rowIndex === row && colIndex === col) {
        if (isStart) {
          isNodeStart = true;
          newStartIndex = { row: rowIndex, col: colIndex };
        } else if (isFinish) {
          isNodeFinish = true;
          newFinishIndex = { row: rowIndex, col: colIndex };
        }
      } else {
        isNodeStart = node.isStart;
        isNodeFinish = node.isFinish;
      }

      return {
        ...node,
        isStart: isNodeStart,
        isFinish: isNodeFinish,
      };
    });
  });

  if (isStart) {
    newArr[startIndex.row][startIndex.col].isStart = false;
  } else if (isFinish) {
    newArr[finishIndex.row][finishIndex.col].isFinish = false;
  }

  setArray(newArr);
  setStartIndex(newStartIndex);
  setFinishIndex(newFinishIndex);

      } else {
      const Arr = [...array];
      if(Arr[row][col].isStart || Arr[row][col].isFinish) return;
    
      if(!Arr[row][col].isWall) {
        Arr[row][col].isWall = true;
        document.getElementById(`node-${row}-${col}`).classList.remove('node-visited', 'node-shortest-path', 'node-backtrack');
        document.getElementById(`node-${row}-${col}`).classList.add('wall');

      } else {
        Arr[row][col].isWall = false;
        document.getElementById(`node-${row}-${col}`).classList.remove('wall');
      }
    
        setArray(Arr);
        }
      } catch (error) {
          console.log(error.message);
      }
      }
  },[array, dragStart, pos, startIndex, finishIndex])

  // handle mouse up
  const handleMouseUp = useCallback((e, row, col) => {
    e.preventDefault();
    if(e.button === 0) {
      // console.log('mouse up', row, col);
      const { isStart, isFinish } = array[pos.row][pos.col];
      // console.log('mouse move', row, col);
      if(array[row][col].isWall) return;
      if(isStart || isFinish) {

        if(array[row][col].isStart || array[row][col].isFinish) return;

      let newStartIndex = startIndex;
      let newFinishIndex = finishIndex;


    const newArr = array.map((rowArr, rowIndex) => {
      return rowArr.map((node, colIndex) => {
        let isNodeStart = false;
        let isNodeFinish = false;

      if (rowIndex === row && colIndex === col) {
        if (isStart) {
          isNodeStart = true;
          newStartIndex = { row: rowIndex, col: colIndex };
        } else if (isFinish) {
          isNodeFinish = true;
          newFinishIndex = { row: rowIndex, col: colIndex };
        }
      } else {
        isNodeStart = node.isStart;
        isNodeFinish = node.isFinish;
      }

      return {
        ...node,
        isStart: isNodeStart,
        isFinish: isNodeFinish,
      };
    });
  });

  if (isStart) {
    newArr[startIndex.row][startIndex.col].isStart = false;
  } else if (isFinish) {
    newArr[finishIndex.row][finishIndex.col].isFinish = false;
  }

  setArray(newArr);
  setStartIndex(newStartIndex);
  setFinishIndex(newFinishIndex);

  setDragStart(false);  
}
    }
  }, [array, pos, startIndex, finishIndex])

  // reset the board
  const handleReset = (e) => {
    e.preventDefault();
    resetWalls();
    clearPathFinding();
  }
  
// handle Run Button
  const handleRun = () => {
    setIsRunning(true);

    if(options !== "-1") {
        clearPathFinding();
    }

    // console.log('array', array);
    // console.log(board);
    // console.log(options);
    if(options === "3") {
      // console.log('BFS');
      visualizeBfs();
    } else if(options === "2") {
      // console.log('DFS');
      visualizeDfs();
    } else if(options === "0") {
      // console.log('Dijakstra');
      visualizeDijkstra();
    } else if(options === '1') {
      // console.log('A* Search');
      visualizeAStarSearch()
    } else if(options === '4') {
      visualizeRandomAlgo();
    }
    else {
      console.log('Quick Sort');

    }
  }

function visualizeRandomAlgo() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

    const maze = generatePath(array, startNode, finishNode);
    const { visitedNodesInOrder, shortestPath } = maze;

    animateAlgorithm(visitedNodesInOrder, shortestPath);

  // animateAlgorithm(visitedNodes, shortestPaths);
  setIsRunning(false);
}

// Visualize the algorithm
function visualizeAStarSearch() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

    const { visitedNodesInOrder, shortestPath } = astarSearch(array, startNode, finishNode);
    animateAlgorithm(visitedNodesInOrder, shortestPath);    
}
function visualizeDijkstra() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

    const visitedNodes = dijkstra(array, startNode, finishNode);
    // console.log(visitedNodes);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
  
}
function visualizeDfs() {
  // console.log(startIndex, finishIndex);
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

    const { visitedNodesInOrder, shortestPath} = dfs(array, startNode, finishNode);
    animateAlgorithm(visitedNodesInOrder, shortestPath); 
}

function clearPathFinding() {
  const newArr = [...array];
  
  // console.log('cleared', newArr);
  // clear all the visited nodes and shortest path
  for(let i = 0; i < newArr.length; i++) {
    for(let j = 0; j < newArr[0].length; j++) {
        const node = newArr[i][j];
        const { row, col } = node;
        document.getElementById(`node-${row}-${col}`).classList.remove('node-visited');
        document.getElementById(`node-${row}-${col}`).classList.remove('node-shortest-path', 'node-backtrack');
    }
  }
}

function visualizeBfs() {
  try {
    // console.log('visualizeBfs');
    const startNode = array[startIndex.row][startIndex.col];
    const finishNode = array[finishIndex.row][finishIndex.col];
  
    const { visitedNodesInOrder, shortestPath} = bfs(array, startNode, finishNode);
      // console.log(walls);
      animateAlgorithm(visitedNodesInOrder, shortestPath);  
  } catch (error) {
    console.log(error);
  } finally {
    setIsRunning(false);
  } 
}

// animate the algorithm
const animateAlgorithm = (visitedNodes, nodesInShortestPathOrder) => {
  try {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
         if(node.backtrack) {
          document.getElementById(`node-${node.row}-${node.col}`).className='node-backtrack';
          }
          else {
            document.getElementById(`node-${node.row}-${node.col}`).className='node-visited';
          }
      }, 10 * i);
    }
  } catch (error) {
    console.log('some thing went wrong');
  } finally {
    setTimeout(() => {
      setIsRunning(false);
    }, 5000);
  }
};

function animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node-shortest-path';
    }, 50 * i);

    if(i === nodesInShortestPathOrder.length - 1) {
      setTimeout(() => {
        setIsRunning(false);
      }, 50 * i);
    }
  }
}

// Maze Section
function visualizeRecursiveDivison() {
  // reset the walls
  resetWalls();
  clearPathFinding();
  
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generateRecursiveDivision(array, rows, cols, startNode, finishNode);

  // console.log('generatedMaze', generatedMaze);
  setArray(array);
  setTimeout(() => {
    
  }, 2000);
  animateMaze(generatedMaze);
}

function visualizeRecursiveBacktracking() {
  resetWalls();
  clearPathFinding();


  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

    const { walls, grid } = generateRecursiveBacktracking(array, startNode, finishNode);

    setArray(grid);
    animateMaze(walls);
  

}

function visualizeRandomPrims() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generatePrims(array, rows, cols, startNode, finishNode);

  // console.log(generatedMaze);
  setArray(array);
  animateMaze(generatedMaze);
}

function visualizeEller() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generateEllers(array, startNode, finishNode);

  // console.log(generatedMaze);
  setArray(array);
  animateMaze(generatedMaze);
}

function visualizeRecusiveDivisonHorizontal() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = RecursiveDivisonHorizontal(array, array.length, array[0].length, startNode, finishNode);

  // console.log(generatedMaze);
  setArray(array);
  animateMaze(generatedMaze);
}

const handleMaze  = (e) => {
  e.preventDefault();
  setIsRunning(true);

  if(MazeOptions !== -1) {
    resetWalls();
    clearPathFinding();
  }
  // console.log('Maze Creating');
  // console.log(options);
  
  switch(MazeOptions) {
    case "0": 
    //  console.log('');
      visualizeRecursiveDivison();
      setMazeOptions(-1);
     break;
    case "1":
      // console.log('Recursive Division');
      visualizeRecursiveBacktracking();
      setMazeOptions(-1);
      break;
    case "2":
      visualizeRandomPrims();
      setMazeOptions(-1);
      break;
    case "3":
      visualizeEller();
      setMazeOptions(-1);
      break;
    case "4":
      visualizeRecusiveDivisonHorizontal();
      setMazeOptions(-1);
      break;
    default: 
      break;
  }
}

function resetWalls() {
    // changing the value in array 
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < array[0].length; j++) {
        array[i][j].isWall = false;
      }
    }

    // changing the class in html
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < array[0].length; j++) {
        document.getElementById(`node-${i}-${j}`).classList.remove('wall');
      }
    }

}

function animateMaze(generatedMaze) {
  
  for(let i = 0; i < generatedMaze.length; i++) {
    setTimeout(() => {
      const node = generatedMaze[i];
      // console.log(node);
        document.getElementById(`node-${node.row}-${node.col}`).classList.add('wall');
    }, 12 * i);

    if(i === generatedMaze.length - 1) {
      setTimeout(() => {
        console.log('Maze Created');
        setIsRunning(false);
      }, 12 * i);
    } 
  }

}

// useEffect(() => { console.log(isRunning);}, [isRunning]);

const Nothing = () => {
  console.log('Nothing');
}

  return (
    <div className=" h-full w-full">
    <div className="flex flex-col md:flex-row justify-start items-center">
      
      <div>
      <select id="pathfind" className="px-2 text-md font-medium outline-none py-2 border-[#404258]
      bg-transparent  text-[#404258] border-b-2 text-center 
      " value={options} onChange={(e) => setOptions(e.target.value)}>
        {
          Algorithms.map((algo, index) => (
            <option value={algo.value} key={index} className='text-black'>{algo.name}</option>
          ))
        }
       </select>

      <select className="px-2 text-md font-medium outline-none py-2 border-[#404258] mx-4
      bg-transparent  text-[#404258] border-b-2  text-center
      "
      value={MazeOptions}
      onChange={(e) => setMazeOptions(e.target.value)}
      onClick={handleMaze}
      >
        <option value={-1} className='text-black '>Generate Mazes</option>
        <option value={0}  
     className='text-black'>Recursive Division</option>
        <option value={1} className='text-black'>Recursive Backtracking</option>
        <option value={2} className='text-black'>Randomized Pattern</option>
        <option value={3} className='text-black'>Ellers Algorithm</option>
        <option value={4} className='text-black'>Recurive Divison(Horizontal)</option>
      </select>
      </div>

      <div className="flex flex-row justify-start items-center mt-4 mb-4 mx-8">
      <div className='bg-green-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center'
      onClick={isRunning ? Nothing : handleRun}
      >
      <FaPlay className="text-white" />
      </div>
         <div className="bg-sky-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center mx-8" 
          onClick={isRunning ? Nothing : handleReset }
         >
            <BiReset className="text-xl text-white" />
          </div>
      </div>
      
    </div>


      {/* create a matrix using table */}
      <table className='w-full my-4'
      >
      <tbody >
        {array.map((row, rowIndex) => (
          <tr key={rowIndex} >
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart } = node;
              return (
                  <td key={nodeIdx} 
                    id={`node-${row}-${col}`}
                    className={''}
                    style={{  
                    width: '24px',
                    height: '24px',
                    border: '1px solid gray',
                    backgroundImage: isStart ? 'url(/thor.svg)' : isFinish ? 'url(/killer.svg)' : '', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'  }}
                    
                    onClick={(e) => handleClick(e, row, col, node)}
                    draggable={true}
                    onMouseDown={(e) => handleMouseDown(e, node)}
                    onMouseMove={(e) => handleMouseMove(e, row, col)}
                    onMouseUp={(e) => handleMouseUp(e, row, col)}
                  >
                  </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>


    </div>
  )
}

const getInitialGrid = (rows, cols, start, finish) => {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push(createNode(col, row, start, finish));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, start, finish) => {
  return {
    col,
    row,
    isStart: row === start.row && col === start.col,
    isFinish: row === finish.row && col === finish.col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

export default MazeAlgorithm