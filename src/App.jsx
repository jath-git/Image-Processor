import './App.scss';
// import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL, BLACK_PIXEL } from './Constants.js';
import CanvasList from './classes/CanvasList';
// import Blur from './components/Blur/Blur'
import { useState, useRef, useEffect } from 'react/cjs/react.development';

function App() {
  let [canvasObj, setCanvasObj] = useState(null);
  let [windowLoaded, setWindowLoaded] = useState(false);
  let [canUndo, setCanUndo] = useState(false);
  let [canReset, setCanReset] = useState(false);
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
      setCanUndo(canvasObj.canUndo);
      setCanReset(canvasObj.canReset);
    }
  });

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
        <button className={canReset ? 'reset active' : 'reset inactive'} onClick={() => {
          canvasObj.reset();
          setCanReset(canvasObj.canReset);

        }
        }>Reset</button>
        <button className={canUndo ? 'undo active' : 'undo inactive'} onClick={() => {
          canvasObj.undo();
          setCanUndo(canvasObj.canUndo);
          setCanReset(canvasObj.canReset);
        }
        }>Undo</button>
        {canvasObj ?
          <div id="options-container">
            <div className="option">
              <div className="title">
                Brightness
              </div>
              <input type="range" min="-10" max="10" />
            </div>
            <div className="option">
              <div className="title">
                Invert
              </div>
              <input type="checkbox" onChange={() => {
                canvasObj.invert();
                setCanUndo(canvasObj.canUndo);
                setCanReset(canvasObj.canReset);
              }} />
            </div>
            <div className="option">
              <div className="title">
                Flip
              </div>
              <input type="checkbox" onChange={() => {
                canvasObj.flip('H');
                setCanUndo(canvasObj.canUndo);
                setCanReset(canvasObj.canReset);
              }} />
              <input type="checkbox" onChange={() => {
                canvasObj.flip('V');
                setCanUndo(canvasObj.canUndo);
                setCanReset(canvasObj.canReset);
              }}/>
            </div>
          </div> : null}
      </div>
      <div id="canvas-container">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div>
  );
}

export default App;
