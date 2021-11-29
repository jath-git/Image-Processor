import './App.scss';
// import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL, BLACK_PIXEL } from './Constants.js';
import CanvasList from './classes/CanvasList';
// import Blur from './components/Blur/Blur'
import { useState, useRef, useEffect } from 'react/cjs/react.development';

function App() {
  let [canvasObj, setCanvasObj] = useState(null);
  let [windowLoaded, setWindowLoaded] = useState(false);
  let canvas = useRef(null);

  const image = new Image();  
  image.src = 'assets/images/landscape.jpg'

  useEffect(() => {
    if (!windowLoaded) {
      canvas.current.width = parseInt(image.width);
      canvas.current.height = parseInt(image.height);
      setCanvasObj(new CanvasList(image, canvas.current));
      setWindowLoaded(true);
    }
  }, [image, windowLoaded]);

  useEffect(() => {
    if (canvasObj) {
      canvasObj.updateDisplay();
    }
  }, [canvasObj]);

  return (
    <div id="app">
      <div id="header">
        <button id="editOther">Edit Another</button>
        <button id="download" onClick={() => {
          const element = document.createElement('a');
          element.href = canvas.current.toDataURL()
          element.download = 'processed.jpg';
          element.click();
        }}>Download</button>
      </div>
      <div id="menu">
        <button id="reset" onClick={() => {
          canvasObj.reset();
          canvasObj.updateDisplay();
        }}>Reset</button>
        <button id="undo">Undo</button>
        {canvasObj ?
          <div id="options-container">
            {/* <div id="blur-container"><Blur canvasObj={canvasObj} /></div> */}
          </div> : null}
      </div>
      <div id="canvas-container">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div>
  );
}

export default App;
