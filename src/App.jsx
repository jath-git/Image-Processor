import './App.scss';
import CanvasList from './classes/CanvasList';
import { useEffect, useMemo } from 'react';
import { TIME_DURATION } from './constants/Constants';
import { Blur, Brightness, Invert, Grayscale, Border, Checkers, Flip, Mirror, Crop, Duplicate, Colour } from './components';

function App({ modifiers, observables, accumulators, updateAbilities, updateElements }) {
  const { canvas, imageLoaded, canvasObj, setCanvasObj, canUndo, setCanUndo, canReset, consistentUpdate, setConsistentUpdate, pixel, setPixel, inputFile } = accumulators;

  const image = useMemo(() => new Image(), []);
  image.src = 'assets/images/landscape.jpg';

  useEffect(() => {
    if (!imageLoaded.current) {
      imageLoaded.current = true;
      setTimeout(() => {
        canvas.current.width = parseInt(image.width);
        canvas.current.height = parseInt(image.height);
        setCanvasObj(new CanvasList(image, canvas.current));
      }, TIME_DURATION);
    }
  });

  const reset = () => {
    if (canReset) {
      canvasObj.reset();
      updateElements();
    }
  }

  const undo = () => {
    if (canUndo) {
      canvasObj.undo();
      updateElements();
    }
  }

  const download = (link) => {
    const element = document.createElement('a');
    element.href = canvas.current.toDataURL();
    element.download = link ? link : 'processed.jpg';
    element.click();
  }

  window.onkeydown = e => {
    if (canvasObj) {
      const keyPressed = e.key;
      if (keyPressed === 'Meta') {
        modifiers.command.set(true);
      } else if (keyPressed === 'Control') {
        modifiers.control.set(true);
      } else if (modifiers.control.get || modifiers.command.get) {
        if (keyPressed === 'z') {
          undo();
        } else if (keyPressed === 'b') {
          reset();
        } else if (keyPressed === 'd') {
          download();
        } else if (keyPressed === 'u') {
          canvasObj.updateDisplay();
        } else if (keyPressed === 'i') {
          inputFile.current.click();
        }
      }
    }
  }

  window.onkeyup = e => {
    switch (e.key) {
      case 'Meta':
        modifiers.command.set(false);
        break;
      case 'Control':
        modifiers.control.set(false);
        break;
      default:
        return;
    }
  }

  return (
    <div id="app">
      <div id="header">
        <input className="input" ref={inputFile} type="file" onChange={e => {
          const image = new Image();

          const reader = new FileReader();
          const file = e.target.files[0];

          reader.addEventListener('load', () => {
            if (file['type'].split('/')[0] === 'image')
              image.src = reader.result;
          })
          reader.readAsDataURL(file);
          setTimeout(() => {
            canvas.current.width = parseInt(image.width);
            canvas.current.height = parseInt(image.height);
            reset();
            setCanUndo(false);
            setCanvasObj(new CanvasList(image, canvas.current));
          }, TIME_DURATION);
        }} />
        <button className={consistentUpdate ? "none" : "update"} onClick={() => {
          canvasObj.updateDisplay();
        }}>Update (Ctrl + U)
        </button>
        <button className={canvasObj !== null ? 'download' : 'inactive'} onClick={() => {
          download();
        }}>Download (Ctrl + D)
        </button>
      </div>
      <div id="menu">
        <button className={canReset ? 'reset active' : 'reset inactive'} onClick={() => {
          reset();
        }
        }>Reset (Ctrl + B)</button>
        <button className={canUndo ? 'undo active' : 'undo inactive'} onClick={() => {
          undo();
        }
        }>Undo (Ctrl + Z)</button>
        {canvasObj ?
          <div id="options-container">
            <div className="option">
              <div className="checklist" onClick={() => {
                const oppositeUpdate = !consistentUpdate;
                if (oppositeUpdate) {
                  canvasObj.updateDisplay();
                }
                setConsistentUpdate(oppositeUpdate);
              }}>
                <input className="autoUpdate" type="checkbox" checked={consistentUpdate} onChange={() => { }} />
                <div className="text">Automatic Updating</div>
              </div>
            </div>
            <Brightness canvasObj={canvasObj} brightnessChanged={modifiers.brightness.get} brightnessRef={observables.brightnessRef} updateAbilities={updateAbilities} setBrightnessChanged={modifiers.brightness.set} />
            <Blur blurRef={observables.blurRef} canvasObj={canvasObj} updateAbilities={updateAbilities} />
            <Invert canvasObj={canvasObj} invertRef={observables.invertRef} brightnessRef={observables.brightnessRef} updateAbilities={updateAbilities} />
            <Grayscale grayRef={observables.grayRef} canvasObj={canvasObj} updateAbilities={updateAbilities} />
            <Colour colour={observables.colour} colourRef={observables.colourRef} setCheckersChanged={modifiers.checkers.set} pixel={pixel} borderRef={observables.borderRef} checkersRef={observables.checkersRef} setPixel={setPixel} />
            <Border canvasObj={canvasObj} pixel={pixel} borderRef={observables.borderRef} updateAbilities={updateAbilities} borderLength={observables.borderRef.borderLength} />
            <Checkers canvasObj={canvasObj} pixel={pixel} updateAbilities={updateAbilities} setCheckersChanged={modifiers.checkers.set} checkersRef={observables.checkersRef} checkersChanged={modifiers.checkers.get} />
            <Flip canvasObj={canvasObj} updateAbilities={updateAbilities} flipRef={observables.flipRef} />
            <Mirror canvasObj={canvasObj} updateAbilities={updateAbilities} mirrorRef={observables.mirrorRef} />
            <Crop canvasObj={canvasObj} cropRef={observables.cropRef} updateAbilities={updateAbilities} setCropChanged={modifiers.crop.set} cropChanged={modifiers.crop.get} />
            <Duplicate canvasObj={canvasObj} duplicateRef={observables.duplicateRef} setDuplicateChanged={modifiers.duplicate.set} duplicateChanged={modifiers.duplicate.get} updateAbilities={updateAbilities} />
          </div> : null}
      </div>
      <div id="canvas-container">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div >
  );
}

export default App;