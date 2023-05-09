import { useEffect, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa"

const videos = [
  {
    src: '/video1.mp4',
  },
  {
    src: '/video2.mp4',
  }
]

const Demo = ( { demo, setDemo }  ) => {
  const [ value, setValue ] = useState(0);
  const [ sources, setSources ] = useState({
    src: null,
  });

  const [ fade, setFade ] = useState(false);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setFade(false);
      setSources({
        src: videos[value].src,
        })
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [sources.src, value]);

  const handleNext = () => {
    let count = value + 1;
    count = count % videos.length;
    setValue(count);
    console.log('source', sources);
  }

  const handlePrev = () => {
    let count = value - 1;
    if(count < 0) {
      count = videos.length - 1;
    }
    setValue(count);
  }


  return (
    <div className="w-full h-screen fixed top-0 z-[999] bg-gray-800 bg-opacity-30 flex items-center justify-center py-2"
     onClick={() => setDemo(!demo)}>
      <div className="w-[80%] h-[25em] sm:h-[30em] bg-white " onClick={(e) => e.stopPropagation(false)}>
        <div className="mx-8 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#212A3E] text-center">Welcome to Algo Visualizer</h1>
          <div>
            <div className="w-full h-[15em] md:h-[20em] md:mt-4 ">
              <video className={`w-full h-full ${fade ? 'fade' : 'fade-in'} `}
               key={sources.src}
                muted
                controls
                controlsList={"nodownload"}
              >
                <source src={sources.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>


            </div>
            <div className="text-center mt-4">
              <FaArrowCircleLeft className="inline-block text-2xl text-[#212A3E] w-8 h-8 mx-8 cursor-pointer" 
              onClick={handlePrev}
              />
              <FaArrowCircleRight className="inline-block text-2xl text-[#212A3E] w-8 h-8 mx-8 cursor-pointer"
              onClick={handleNext}
              />

            </div>
          </div>
        
        </div>

      </div>

    </div>
  )
}

export default Demo