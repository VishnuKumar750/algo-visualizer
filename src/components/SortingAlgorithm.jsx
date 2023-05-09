import { FaPlay } from 'react-icons/fa'
import { BiReset } from 'react-icons/bi'
import { useEffect, useState } from 'react';
import './sortingAlgorithm.css'
import SortingAlgorithmLogic from '../utility/sorting/sortingAlgorithmLogic';


function GenerateRandom() {
   const random = Math.floor(Math.random() * 15) + 1;
   return random;
}

function GenerateArray(size) {
   if(size === 0) return;

   const array = [];
   for (let i = 0; i < size; i++) {
      array.push({ height: GenerateRandom(), color: '#3C6255' });
   }
   return array;
}

const SortingAlgorithm = () => {
   const [isRunning, setIsRunning] = useState(false);
   const [array, setArray] = useState([]);

   const [options, setOptions] = useState(0);
   const [maxValue, setMaxValue] = useState(1);
   const [value, setValue] = useState(0);
   const handleChange = (e) => {
      setValue(e.target.value);
   }

   const sortingVisualizer = new SortingAlgorithmLogic(value,array, setArray, setIsRunning);

   // console.log(options);

   const runAlgo = () => {
      console.log(Number(options));

      switch (Number(options)) {
         case 0:
            console.log('bubble sort');
            sortingVisualizer.bubbleSort()
            break;
         case 1:
            console.log('selection sort');
            sortingVisualizer.selectionSort()
            break;
         case 2:
            sortingVisualizer.insertionSort()
            break;
         case 3:
            console.log('merge sort');
            sortingVisualizer.mergeSort()
            break;
         case 4:
            console.log('quick sort');
            sortingVisualizer.quickSort()
            break;
         case 5:
            console.log('heap sort');
            sortingVisualizer.heapSort()
            break;
         case 6:
            console.log('radix sort');
            sortingVisualizer.shellSort()
            break;
         default:
            sortingVisualizer.bubbleSort()
            break;
      }
   }

   useEffect(() => {
      function handleResize() {
         if(window.innerWidth > 320 && window.innerWidth < 768) {
            if(value > 30) {
               setValue(30);
            }
            setMaxValue(30);
         } else if(window.innerWidth < 768) {
            if(value > 70) {
               setValue(70);
            }
            setMaxValue(70);
         } else if(window.innerWidth < 1024) {
            if(value > 80) {
               setValue(80);
            }
            setMaxValue(80);
         } else if(window.innerWidth < 1280) {
            if(value > 100) {
               setValue(100);
            }
            setMaxValue(100);
         }
         else if(window.innerWidth < 1536) {
            if(value > 113) {
               setValue(113);
            }
            setMaxValue(113);
         }
      }

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      }
   },[value])

   useEffect(() => {
      if(value === 0) return;
      const array = GenerateArray(value);
      setArray(array);
   }, [value])


   const resetArray = () => {
      setArray([]);
      setValue(0);
      setIsRunning(false);
   }

   return (
    <div className=" h-full w-full max-8xl mx-auto py-6">
      <div className="flex flex-row justify-start items-center">
      <select className="px-2 text-md font-medium outline-none py-2 border-[#404258] 
      bg-transparent  text-[#404258] border-b-2
      " value={options} onChange={(e) => setOptions(e.target.value)} >
         <option value={0} className='text-black'>Bubble Sort</option>
         <option value={1} className='text-black'>Selection Sort</option>
         <option value={2} className='text-black'>Insertion Sort</option>
         <option value={3} className='text-black'>Merge Sort</option>
         <option value={4} className='text-black'>Quick Sort</option>
         <option value={5} className='text-black'>Heap Sort</option>
         <option value={6} className='text-black'>Shell Sort</option>
         
      </select>

      <div className="flex flex-row justify-start items-center mx-4 md:mx-12">
      {isRunning ? 
      <div className="bg-red-500 rounded-full w-10 h-10 flex items-center cursor-progress justify-center shadow-md">
         <FaPlay className="text-white" />
         </div> 
         : 
      <div className='bg-green-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center shadow-md'
      onClick={runAlgo}
      >
      <FaPlay className="text-white" />
      </div>
      } 


      {
         isRunning ?
         <div className="bg-slate-500 rounded-full w-10 h-10 flex items-center cursor-progress justify-center mx-8 shadow-md">
            <BiReset className="text-xl text-white" />
         </div>
         :
         <div className="bg-sky-500 rounded-full w-10 h-10 flex items-center cursor-pointer justify-center mx-8 shadow-md" onClick={resetArray}>
            <BiReset className="text-xl text-white" />
         </div>

      }

      </div>
      </div>

      {/* create histogram for visualization */}
      <div className="h-[50vh] my-4  bg-white shadow-lg ">
         <div className="h-full flex  ">
           {
               array.map((item, index) => {
                  return (
                     <div key={index} className={`w-2 mr-1  transition-all duration-700 ease-in-out`}
                     style={{height: `${item?.height * 6}%`, backgroundColor: `${item?.color}` }}
                     ></div>
                  )
               })
           }
         </div>
      </div>

      {/* progress skew */}
      {isRunning ? 
      <div className="relative pt-12">
      <input
         type="range"
         min={0}
         max={maxValue}
         value={value}
         disabled
         onChange={handleChange}
         className="absolute w-full h-full opacity-0 cursor-progress"
      />
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
         <div
         className="h-full bg-green-500 rounded-full"
         style={{ width: `${(value) / (maxValue)  * 100}%` }}
         ></div>
      </div>
         <div className="absolute top-0 left-0 w-full text-center text-[#404258]">
         <div className="text-lg font-bold text-[#E7F6F2]">{value}</div>
      </div>
      </div>
         :
      <div className="relative pt-12 ">
      <input
        type="range"
        min={0}
        max={maxValue}
        value={value}
        onChange={handleChange}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
      <div className="h-2 bg-gray-200  rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(value) / (maxValue)  * 100}%` }}
        ></div>
      </div>
      <div className="absolute top-0 left-0 w-full text-center text-[#404258]">
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
      }

    </div>
  )
}

export default SortingAlgorithm