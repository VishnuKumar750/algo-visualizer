
import { useState } from 'react';
import SortingAlgorithm from './components/SortingAlgorithm';
import MazeAlgorithm from './components/MazeAlgorithm';
import reactIcon from './assets/react.svg'
import './App.css'


function App() {
  const [ chooseAlgo, setChooseAlgo ] = useState(false);
  
  const handleChooseAlgo = (e) => {
    if(e.target.value === 'Sorting Algorithm') {
      setChooseAlgo(false);
    } else {
      setChooseAlgo(true);
    }
  }
  
  return (
    <>
      <div className='px-4 md:px-8 py-4 shadow-md flex items-center justify-start '>
        <img src={reactIcon} className='w-6 h-6  cursor-pointer spinner' />
      <h1 className='text-xl font-bold mx-2  font-serif text-[#404258]'>Algo Visualizer</h1>

      <select className='outline-none mx-4 px-2  font-medium  bg-transparent  border-b-2 border-[#404258] text-[#404258]' 
      onChange={handleChooseAlgo}
      >
        <option className='text-black'>Sorting Algorithm</option>
        <option className='text-black'>Maze Algorithm</option>
      </select>
      </div>

      <div className='px-1 md:px-6'>
      <div className='px-5 h-[70vh]'>
      {
        !chooseAlgo ? 
        <MazeAlgorithm /> :
        <SortingAlgorithm />
      }
      </div>
      </div>
    </>
  )
}

export default App
