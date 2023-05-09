
import {  useState } from 'react';
import SortingAlgorithm from './components/SortingAlgorithm';
import MazeAlgorithm from './components/MazeAlgorithm';
import reactIcon from './assets/react.svg'
import './App.css'
import Demo from './components/Demo';


function App() {
  const [ chooseAlgo, setChooseAlgo ] = useState(false);
  const [ demo, setDemo ] = useState(true);

  const handleChooseAlgo = (e) => {
    if(e.target.value === 'Maze Algorithm') {
      setChooseAlgo(false);
    } else {
      setChooseAlgo(true);
    }
  }
  
  return (
    <div className={`relative  h-[48em] md:h-[40em]`}>
      <div className='px-4 md:px-8 py-1 shadow-md flex md:items-center justify-start mx-auto max-w-8xl w-full flex-col md:flex-row'>
      <div className='flex'>
      <img src={reactIcon} className='w-6 h-6 cursor-pointer spinner' />
      <h1 className={`text-xl font-bold mx-2  font-serif text-[#404258] `}>Algo Visualizer</h1>
      </div>

      <select className='outline-none mx-4 px-2  py-4 font-medium  bg-transparent  border-b-2 border-[#404258] text-[#404258]' 
      onChange={handleChooseAlgo}
      >
        <option className='text-black'>Maze Algorithm</option>
        <option className='text-black'>Sorting Algorithm</option>
      </select>
      
      </div>

      <div className='px-1 md:px-6'>
      <div className='px-5 h-[70vh]'>
      {
        chooseAlgo ? 
        <SortingAlgorithm />
        :
        <MazeAlgorithm /> 
      }
      </div>
      </div>

      { demo && <Demo demo={demo} setDemo={setDemo} />}
    </div>
  )
}

export default App
