import { useEffect, useState } from 'react'
import { BiReset } from 'react-icons/bi';
import { FaPlay, FaPlus } from 'react-icons/fa';

import './MazeAlgorithm.css';
import { aStar, bfs, dfs, dijkstra, getNodesInShortestPathOrder } from '../utility/mazeAlgorithmLogic';

const MazeAlgorithm = () => {
  const [ rows, setRows ] = useState(15); 
  const [cols, setCols] = useState(15);
  const [array, setArray] = useState([]);
  const [options , setOptions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [ dragStart , setDragStart ] = useState(false);
 
  const [ startIndex, setStartIndex ] = useState({
    row: 5,
    col: 5,
  });

  const [ finishIndex, setFinishIndex ] = useState({
    row: 5,
    col: 12,
  });

  useEffect(() => {
    function HandleResize () {
      if(window.innerWidth < 768) {
        setCols(10);
        setRows(15);
        setStartIndex({row: 5, col: 2});
        setFinishIndex({row: 5, col: 8})
      } else if(window.innerWidth > 768 && window.innerWidth < 1023) {
        setCols(15);
        setRows(10);
        setStartIndex({row: 5, col: 2 });
        setFinishIndex({row: 5, col: 12})
      } else if(window.innerWidth > 1024) {
        setCols(25);
        setFinishIndex({row: 5, col: 20})
      } else {
        setCols(25);
        setFinishIndex({row: 5, col: 20})
      }
    }
    HandleResize();
    window.addEventListener('resize', HandleResize);

    return () => {
      window.removeEventListener('resize', HandleResize);
    }
  }, [])

  useEffect(() => { 
    // Intializing the board
    const board = getInitialGrid(rows, cols, startIndex, finishIndex)
    
    setArray(board);
  },[rows, cols])

 
  // handle image drag start
  const handleDragStart = (event, node) => {
    console.log(node);
    const { isStart, isFinish, isWall } = node
    const name = isStart ? 'start' : isFinish ? 'finish' : isWall ? 'wall' : 'node';
    const data = JSON.stringify({isStart, isFinish, isWall, name});


    event.dataTransfer.setData('application/json', data);
    
    { (isStart || isFinish) ? setDragStart(true) : setDragStart(false)}
  }

  // handle cell drag over
  const handleDragOver = (event, row, col, node) => {
    event.preventDefault();
    try {
    const { isStart, isFinish, isWall } = node;
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
    document.getElementById(`node-${row}-${col}`).className = 'wall';
  } else {
    Arr[row][col].isWall = false;
    document.getElementById(`node-${row}-${col}`).classList.remove('wall');
  }

  
  setArray(Arr);
    } catch (error) {
      console.log(error.message);
    }
  }


  useEffect(() => { }, [array]);

  // handle character drop
  const handleDrop = (event, row, col) => {
    event.preventDefault();
    setDragStart(false);
    const node = event.dataTransfer.getData('application/json');
    const { isStart, isFinish, isWall } = JSON.parse(node);

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


  const handleReset = () => {
    console.log('reset');
    for(let i = 0; i < array.length; i++) {
      for(let j = 0; j < array[i].length; j++) {
        const node = array[i][j];
        const ele = document.getElementById(`node-${node.row}-${node.col}`);
        ele.classList.remove('node-visited', 'node-shortest-path', "wall");
      }
    }
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
    document.getElementById(`node-${row}-${col}`).className = 'wall';
  } else {
    Arr[row][col].isWall = false;
    document.getElementById(`node-${row}-${col}`).classList.remove('wall');
  }


  setArray(Arr);

  }
  
  // handle Run Button
  const handleRun = () => {
    // console.log(board);
    if(options === '0') {
      console.log('BFS');
      VisualizeBfs();
    } else if(options === '1') {
      console.log('DFS');
      visualizeDfs();
    } else if(options === '2') {
      console.log('Dijakstra');
      visualizeDijkstra();
    } else if(options === '3') {
      console.log('A* Search');
      VisaulizeAStar();
    } else {
      console.log('Quick Sort');

    }
}

function animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node-shortest-path';
    }, 50 * i);
  }
}


function visualizeDijkstra() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];
  const visitedNodes = dijkstra(array, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
}

function visualizeDfs() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];
  const visitedNodes = dfs(array, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
}

function VisualizeBfs() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];
  const visitedNodes = bfs(array, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
}

function VisaulizeAStar() {
  const startNode = array[startIndex.row][startIndex.col];
  const finishNode = array[finishIndex.row][finishIndex.col];
  const visitedNodes = aStar(array, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  animateAlgorithm(visitedNodes, nodesInShortestPathOrder);
}

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
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node-visited';
    }, 20 * i);
  }
}

  return (
    <div className=" h-full w-full">
    <div className="flex flex-row justify-start items-center">
            <select className="px-2 text-md font-medium outline-none py-2 border-[#404258]
      bg-transparent  text-[#404258] border-b-2
      " value={options} onChange={(e) => setOptions(e.target.value)} >
         <option value={0} className='text-black'>BFS</option>
         <option value={1} className='text-black'>DFS</option>
         <option value={2} className='text-black'>Dijakstra</option>
         <option value={3} className='text-black'>A* Search</option>
         <option value={4} className='text-black'>Quick </option>
         <option value={5} className='text-black'>Heap Sort</option>
         <option value={6} className='text-black'>Shell Sort</option>
         
      </select>

      <div className="flex flex-row justify-start items-center mx-12">

      {isRunning ?
      <div className="bg-red-500 rounded-full w-10 h-10 flex items-center cursor-progress justify-center mr-6">
          <FaPlus className="text-white" />

      </div>
        : 
      <div  className='mr-6'>
        <FaPlus className="text-[#404258] text-xl" />
      </div>
          }

      {isRunning ? 
      <div className="bg-red-500 rounded-full w-10 h-10 flex items-center cursor-progress justify-center">
         <FaPlay className="text-white" />
         </div> 
         : 
      <div className='bg-green-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center'
      onClick={handleRun}
      >
      <FaPlay className="text-white" />
      </div>
      } 
      {
         isRunning ?
         <div className="bg-slate-500 rounded-full w-10 h-10 flex items-center cursor-progress justify-center mx-8">
            <BiReset className="text-xl text-white" />
         </div>
         :
         <div className="bg-sky-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center mx-8" 
          onClick={handleReset}
         >
            <BiReset className="text-xl text-white" />
         </div>

      }
      </div>
      
    </div>


      {/* create a matrix using table */}
      <table className='w-full my-4'>
      <tbody >
        {array.map((row, rowIndex) => (
          <tr key={rowIndex} >
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall } = node;
              return (
                  <td key={nodeIdx} 
                    id={`node-${row}-${col}`}
                    className={''}
                    style={{ width: '25px', height: '25px', border: '1px solid gray', 
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

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

export default MazeAlgorithm