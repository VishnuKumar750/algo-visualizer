import { useEffect, useState } from 'react'
import { BiReset } from 'react-icons/bi';
import { FaPlay, FaPlus } from 'react-icons/fa';
import MazeAlgorithmLogic from '../utility/mazeAlgorithmLogic';

function create2DArray( rows, cols) {
  let arr = [];
  for(let i = 0; i < rows; i++) {
    arr.push([]);
    for(let j = 0; j < cols; j++) {
      arr[i].push(false);
    }
  }
  return arr;
}

const MazeAlgorithm = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [options, setOptions] = useState(0);

  const [ maxRow, setMaxRow ] = useState(16);
  const [ maxCol, setMaxCol ] = useState(10);

  const [grid, setGrid] = useState([]);

  function generateMaze() {
    const generator = new MazeAlgorithmLogic(maxRow, maxCol);
    const maze = generator.generateMaze();
    setGrid(maze)
  }

  useEffect(() => {
    const handleResize = () => {
      if(window.innerWidth < 768) {
        setMaxCol(20);
      } else {
        setMaxCol(35);
      }
  
      setGrid(create2DArray(maxRow, maxCol));
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  },[maxCol, maxRow])
   

   const runAlgo = () => {
    console.log('run algo');


    setIsRunning(true);
   }

   const resetArray = () => {
    console.log('reset array');
    }

  
    const handleCellClick = (row, col) => {
      const newGrid = [...grid];
      newGrid[row][col] = !newGrid[row][col];
      setGrid(newGrid);
    };

    console.log(grid);

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

      <div onClick={generateMaze}>
        <FaPlus className="text-[#404258] text-xl" />
      </div>

      {isRunning ? 
      <div className="bg-red-500 rounded-full w-10 h-10 flex items-center cursor-progress justify-center">
         <FaPlay className="text-white" />
         </div> 
         : 
      <div className='bg-green-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center'
      onClick={runAlgo}
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
         <div className="bg-sky-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center mx-8" onClick={resetArray}>
            <BiReset className="text-xl text-white" />
         </div>

      }
      </div>
      
    </div>


      {/* create a matrix using table */}
      <table className='my-4 w-full'>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cell ? "bg-black" : ""}
                style={{
                  border: "1px solid gray",
                  width: "25px",
                  height: "25px",
                }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>


    </div>
  )
}

export default MazeAlgorithm