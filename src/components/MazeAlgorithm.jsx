import { useEffect, useState } from 'react'
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
  useEffect(() => { 
    // Intializing the board
    const board = getInitialGrid(rows, cols, startIndex, finishIndex)
    setArray(board);
  },[rows, cols,])



  // creating walls
  // drag and drop feature for both character and walls
  // handle image drag start
  const handleDragStart = (event, node) => {
    console.log(node);
    const { isStart, isFinish, isWall } = node
    const name = isStart ? 'start' : isFinish ? 'finish' : isWall ? 'wall' : 'node';
    const data = JSON.stringify({isStart, isFinish, isWall, name});

    event.dataTransfer.setData('application/json', data);
    event.dataTransfer.effectAllowed = 'move';
    
    { (isStart || isFinish) ? setDragStart(true) : setDragStart(false)}
  }
  // handle cell drag over
  const handleDragOver = (event, row, col, node) => {
    event.preventDefault();
    try {
    const { isStart, isFinish } = node;
    if (isStart || isFinish) {
      return;
    }

  if(dragStart) return;

  const Arr = [...array];

  // console.log(row,col);

  // console.log(newArr);
    // set the wall to true
  if(!Arr[row][col].isWall) {
    Arr[row][col].isWall = true;
    document.getElementById(`node-${row}-${col}`).classList.add('wall');
  } else {
    Arr[row][col].isWall = false;
    document.getElementById(`node-${row}-${col}`).classList.remove('wall');
  }

  
  setArray(Arr);
    } catch (error) {
      console.log(error.message);
    }
  }
  // handle character drop
  const handleDrop = (event, row, col) => {
    event.preventDefault();
    setDragStart(false);
    const node = event.dataTransfer.getData('application/json');
    const { isStart, isFinish } = JSON.parse(node);

    // console.log(isStart, isFinish, isWall);

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
    
  }
  const handleClick = (e, row, col, node) => {
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

  }

  // useEffect(() => { console.log('array');}, [array]);
  
  // reset the board
  const handleReset = () => {
    console.log('reset');

    const board = [...array];

    for(let i = 0; i < board.length; i++) {
      for(let j = 0; j < board[i].length; j++) {
         const node = board[i][j];
         document.getElementById(`node-${node.row}-${node.col}`).classList.remove('wall');
          document.getElementById(`node-${node.row}-${node.col}`).classList.remove('node-visited');
          document.getElementById(`node-${node.row}-${node.col}`).classList.remove('node-shortest-path');
      }
    }

    const newArr = board.map((rowArr, rowIndex) => {
      return rowArr.map((node, colIndex) => {
        let isNodeStart = false;
        let isNodeFinish = false;

        if (rowIndex === startIndex.row && colIndex === startIndex.col) {
          isNodeStart = true;
        } else if (rowIndex === finishIndex.row && colIndex === finishIndex.col) {
          isNodeFinish = true;
        }

        return {
          ...node,
          isStart: isNodeStart,
          isFinish: isNodeFinish,
          isVisited: false,
          distance: Infinity,
          isWall: false,
          previousNode: null,
        };
      });
    });

    

    setArray(newArr);
    setTimeout(() => {
    
    }, 2000);
    // window.location.reload();

  }
  
// handle Run Button
  const handleRun = () => {
    setIsRunning(true);
    // console.log(board);
    if(options === '0') {
      console.log('BFS');
      visualizeBfs();
    } else if(options === '1') {
      console.log('DFS');
      visualizeDfs();
    } else if(options === '2') {
      console.log('Dijakstra');
      visualizeDijkstra();
    } else if(options === '3') {
      console.log('A* Search');
      visualizeAStarSearch()
    } else {
      console.log('Quick Sort');

    }
}


// Visualize the algorithm
function visualizeAStarSearch() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  clearPathFinding();
  setTimeout(() => {
    
  }, 2000);

  const { visitedNodesInOrder, shortestPath } = astarSearch(array, startNode, finishNode);
  animateAlgorithm(visitedNodesInOrder, shortestPath);
}
function visualizeDijkstra() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  // console.log(array);
  clearPathFinding();
  setTimeout(() => {
    
  }, 2000);

  // console.log('aftercleaning', array);

  // // starting visiting Nodes
  const visitedNodes = dijkstra(array, startNode, finishNode);
  // console.log(visitedNodes);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
}
function visualizeDfs() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  clearPathFinding();
  setTimeout(() => {

  }, 2000);
  
  const visitedNodes = dfs(array, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

  animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
}
function clearPathFinding() {
  const newArr = [...array];
  
  // clear all the visited nodes and shortest path
  for(let i = 0; i < newArr.length; i++) {
    for(let j = 0; j < newArr[0].length; j++) {
        const node = newArr[i][j];
        const { row, col } = node;
        document.getElementById(`node-${row}-${col}`).classList.remove('node-visited');
        document.getElementById(`node-${row}-${col}`).classList.remove('node-shortest-path');
        
    }
  }

  const clearedArr = newArr.map((row) => {
    return row.map((node) => {
      if(!node.isWall) {
        return {
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        }
      }
      return node;
    })
  })

  setArray(clearedArr);
}
function visualizeBfs() {
  console.log('visualizeBfs');
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  clearPathFinding();
  setTimeout(() => {
    
  }, 2000);

  const visitedNodes = bfs(array, startNode, finishNode);
  // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

  const { path, walls } = visitedNodes;
  // console.log(walls);
  animateAlgorithm(walls, path);
}


// animate the algorithm
function animateAlgorithm(visitedNodes, nodesInShortestPathOrder) {
  for (let i = 0; i <= visitedNodes.length; i++) {
    if (i === visitedNodes.length) {
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 20 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodes[i];
      // console.log('node' , node);
      document.getElementById(`node-${node.row}-${node.col}`).className='node-visited';
  }, 20 * i);
  }
}
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
  
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generateRecursiveDivision(array, rows, cols, startNode, finishNode);

  // console.log('generatedMaze', generatedMaze);
  setArray(array);
  animateMaze(generatedMaze);
}

function visualizeRecursiveBacktracking() {
  resetWalls();

  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generateRecursiveBacktracking(array, startNode, finishNode);
  
  setArray(array);
  animateMaze(generatedMaze);
}

function visualizeRandomPrims() {
  const newArr = resetWalls();

  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generatePrims(array, rows, cols, startNode, finishNode);

  // console.log(generatedMaze);
  setArray(array);
  animateMaze(generatedMaze);
}

function visualizeEller() {
  resetWalls();

  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];

  const generatedMaze = generateEllers(array, startNode, finishNode);

  // console.log(generatedMaze);
  setArray(array);
  animateMaze(generatedMaze);
}

function visualizeRecusiveDivisonHorizontal() {
  resetWalls();

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
  // console.log('Maze Creating');
  // console.log(options);
  console.log(MazeOptions);
  switch(MazeOptions) {
    case "0": 
     console.log('Random Maze');
      visualizeRecursiveDivison();
      setMazeOptions(-1);
     break;
    case "1":
      console.log('Recursive Division');
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
  const copyArray = [...array];

  // clear All the walls in the board
  for(let i = 0; i < copyArray.length; i++) {
    for(let j = 0; j < copyArray[i].length; j++) {
      const {row, col } = copyArray[i][j];
        document.getElementById(`node-${row}-${col}`).classList.remove('wall');
        document.getElementById(`node-${row}-${col}`).classList.remove('node-visited');
        document.getElementById(`node-${row}-${col}`).classList.remove('node-shortest-path');
    }
  }

  const newArr = copyArray.map((row) => {
    return row.map((node) => {
      return {
        ...node,
        isWall: false,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      }
    })
  })

  setTimeout(() => {
    console.log('reset Walls');
  }, 2000);

  setArray(newArr);
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


useEffect(() => { console.log(isRunning);}, [isRunning]);

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
        <option value={-1} className='text-black'>Path Find Algorithm</option>
         <option value={0} className='text-black'>BFS</option>
         <option value={1} className='text-black'>DFS</option>
         <option value={2} className='text-black'>Dijakstra</option>
         <option value={3} className='text-black'>A* Search</option>
         <option value={4} className='text-black'>Quick </option>
         <option value={5} className='text-black'>Heap Sort</option>
         <option value={6} className='text-black'>Shell Sort</option>
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
      <table className='w-full my-4'>
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
                    onDragStart={(e) => handleDragStart(e, node)}
                    onDragOver={(e) => handleDragOver(e, row, col, node)}
                    onDrop={(e) => handleDrop(e, row, col)} 
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