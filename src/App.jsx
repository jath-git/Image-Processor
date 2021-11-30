import './App.scss';
// import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL, BLACK_PIXEL } from './Constants.js';
import CanvasList from './classes/CanvasList';
// import Blur from './components/Blur/Blur'
import { useState, useRef, useEffect, useMemo } from 'react/cjs/react.development';
import { BLACK_PIXEL } from './Constants';
import { setPreviousInput, getValidNumber, makeInteger, makeWholeNumber, makeNaturalNumber } from './utilities/default';
// import { RED_PIXEL } from './Constants';

function App() {
  let [canvasObj, setCanvasObj] = useState(null);
  let [imageLoaded, setImageLoaded] = useState(false);
  let [canUndo, setCanUndo] = useState(false);
  let [canReset, setCanReset] = useState(false);
  let [invertChecked, setInvertChecked] = useState(false);
  let [hFlipChecked, setHFlipChecked] = useState(false);
  let [vFlipChecked, setVFlipChecked] = useState(false);
  let [imageIndex] = useState(0);
  let [commandPressed, setCommandPressed] = useState(false);
  let [controlPressed, setControlPressed] = useState(false);
  let [brightnessChanged, setBrightnessChanged] = useState(true);
  let [checkersChanged, setCheckersChanged] = useState(true);
  let [cropChanged, setCropChanged] = useState(true);
  let [duplicateChanged, setDuplicateChanged] = useState(true);
  let [brightnessLevel, setBrightnessLevel] = useState(0);
  let [consistentUpdate, setConsistentUpdate] = useState(true);
  let [tBorderChecked, setTBorderChecked] = useState(false);
  let [bBorderChecked, setBBorderChecked] = useState(false);
  let [lBorderChecked, setLBorderChecked] = useState(false);
  let [rBorderChecked, setRBorderChecked] = useState(false);
  let [grayScaled, setGrayScaled] = useState(false);
  // let [tMirrorChecked, setTMirrorChecked] = useState(false);
  // let [bMirrorChecked, setBMirrorChecked] = useState(false);
  // let [lMirrorChecked, setLMirrorChecked] = useState(false);
  // let [rMirrorChecked, setRMirrorChecked] = useState(false);
  let borderLength = useRef(null);
  let checkersSpacing = useRef(null);
  let canvas = useRef(null);
  let brightness = useRef(null);
  let cropSplitX = useRef(null);
  let cropSplitY = useRef(null);
  let cropSectionX = useRef(null);
  let cropSectionY = useRef(null);
  let duplicateSplitX = useRef(null);
  let duplicateSplitY = useRef(null);
  let duplicateSectionX = useRef(null);
  let duplicateSectionY = useRef(null);
  let blurLevel = useRef(null);
  let tMirror = useRef(null);
  let bMirror = useRef(null);
  let lMirror = useRef(null);
  let rMirror = useRef(null);

  const images = useMemo(() => [], []);
  images[imageIndex] = new Image();
  images[imageIndex].src = 'assets/images/landscape.jpg'

  useEffect(() => {
    if (!imageLoaded) {
      canvas.current.width = parseInt(images[imageIndex].width);
      canvas.current.height = parseInt(images[imageIndex].height);
      setCanvasObj(new CanvasList(images[imageIndex], canvas.current));
      setImageLoaded(true);
    }
  }, [images, imageLoaded, imageIndex]);

  const updateAbilities = () => {
    if (consistentUpdate) {
      canvasObj.updateDisplay();
    }
    setCanUndo(canvasObj.canUndo);
    setCanReset(canvasObj.canReset);
  }

  const updateElements = () => {
    updateAbilities();
    brightness.current.value = canvasObj.recent.properties.brightnessLevel;
    borderLength.current.value = canvasObj.recent.properties.borderLength;
    checkersSpacing.current.value = canvasObj.recent.properties.checkersSpacing;
    cropSplitX.current.value = canvasObj.recent.properties.cropped.splitX;
    cropSplitY.current.value = canvasObj.recent.properties.cropped.splitY;
    cropSectionX.current.value = canvasObj.recent.properties.cropped.sectionX;
    cropSectionY.current.value = canvasObj.recent.properties.cropped.sectionY;
    duplicateSplitX.current.value = canvasObj.recent.properties.duplicated.splitX;
    duplicateSplitY.current.value = canvasObj.recent.properties.duplicated.splitY;
    duplicateSectionX.current.value = canvasObj.recent.properties.duplicated.sectionX;
    duplicateSectionY.current.value = canvasObj.recent.properties.duplicated.sectionY;
    blurLevel.current.value = canvasObj.recent.properties.blurLevel;
    tMirror.current.checked = canvasObj.recent.properties.mirror.T;
    bMirror.current.checked = canvasObj.recent.properties.mirror.B;
    lMirror.current.checked = canvasObj.recent.properties.mirror.L;
    rMirror.current.checked = canvasObj.recent.properties.mirror.R;

    setInvertChecked(canvasObj.recent.properties.isInverted);
    setHFlipChecked(canvasObj.recent.properties.isFlipped.horizontal);
    setVFlipChecked(canvasObj.recent.properties.isFlipped.vertical);
    setTBorderChecked(canvasObj.recent.properties.addedBorders.T);
    setBBorderChecked(canvasObj.recent.properties.addedBorders.B);
    setLBorderChecked(canvasObj.recent.properties.addedBorders.L);
    setRBorderChecked(canvasObj.recent.properties.addedBorders.R);
    setGrayScaled(canvasObj.recent.properties.grayscaled)
  }

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

  const download = link => {
    const element = document.createElement('a');
    element.href = canvas.current.toDataURL()
    element.download = link ? link : 'processed.jpg';
    element.click();
  }

  const changeBrightness = () => {
    const value = brightness.current.value;
    const number = getValidNumber(value, -25, 25);
    if (value === '') {
      return;
    }

    if (number !== null && canvasObj.recent.properties.brightnessLevel !== number) {
      canvasObj.brightness(number);
      setBrightnessLevel(number);
      updateAbilities();
      setBrightnessChanged(true);
    }
  }

  const changeBorder = (borders, setTrue) => {
    const value = borderLength.current.value;
    const number = getValidNumber(value, 1, Math.max(canvasObj.width, canvasObj.height));
    if (value === '') {
      return;
    }

    if (number !== null) {
      canvasObj.addBorders(number, BLACK_PIXEL, borders);
      updateAbilities();
      setTrue(true);
    }
  }

  const changeMirror = (border, setTrue) => {
    canvasObj.mirror(border);
    updateAbilities();
  }

  const setAllBorders = bool => {
    setTBorderChecked(bool);
    setBBorderChecked(bool);
    setLBorderChecked(bool);
    setRBorderChecked(bool);
  }

  const addCheckers = () => {
    const value = checkersSpacing.current.value;
    const number = getValidNumber(value, 1, Math.max(canvasObj.width, canvasObj.height));
    if (value === '') {
      return;
    }

    if (number !== null) {
      canvasObj.checkers(BLACK_PIXEL, number);
      updateAbilities();
      setCheckersChanged(true);
    }
  }

  const crop = () => {
    if (cropChanged) {
      return;
    }

    const parsedInput = {
      splitX: parseInt(cropSplitX.current.value),
      splitY: parseInt(cropSplitY.current.value),
      sectionX: parseInt(cropSectionX.current.value),
      sectionY: parseInt(cropSectionY.current.value),
    }
    canvasObj.crop(parsedInput.splitX, parsedInput.splitY, parsedInput.sectionX, parsedInput.sectionY);
    updateAbilities();
    setCropChanged(true);
  }

  const checkAllCrop = () => {
    const parsedInput = {
      splitX: getValidNumber(cropSplitX.current.value, 1, 20),
      splitY: getValidNumber(cropSplitY.current.value, 1, 20),
      sectionX: 0,
      sectionY: 0
    }

    parsedInput.sectionX = getValidNumber(cropSectionX.current.value, 0, parsedInput.splitX - 1);
    parsedInput.sectionY = getValidNumber(cropSectionY.current.value, 0, parsedInput.splitY - 1);

    return parsedInput.splitX === null || parsedInput.splitY === null || parsedInput.sectionX === null || parsedInput.sectionY === null;
  }

  const duplicate = () => {
    if (duplicateChanged) {
      return;
    }

    const parsedInput = {
      splitX: parseInt(duplicateSplitX.current.value),
      splitY: parseInt(duplicateSplitY.current.value),
      sectionX: parseInt(duplicateSectionX.current.value),
      sectionY: parseInt(duplicateSectionY.current.value),
    }
    canvasObj.duplicate(parsedInput.splitX, parsedInput.splitY, parsedInput.sectionX, parsedInput.sectionY);
    updateAbilities();
    setCropChanged(true);
  }

  const checkAllDuplicate = () => {
    const parsedInput = {
      splitX: getValidNumber(duplicateSplitX.current.value, 1, 20),
      splitY: getValidNumber(duplicateSplitY.current.value, 1, 20),
      sectionX: 0,
      sectionY: 0
    }

    parsedInput.sectionX = getValidNumber(duplicateSectionX.current.value, 0, parsedInput.splitX - 1);
    parsedInput.sectionY = getValidNumber(duplicateSectionY.current.value, 0, parsedInput.splitY - 1);

    return parsedInput.splitX === null || parsedInput.splitY === null || parsedInput.sectionX === null || parsedInput.sectionY === null;
  }

  window.onkeydown = e => {
    if (!canvasObj) {
      return;
    }

    const keyPressed = e.key;
    if (keyPressed === 'Meta') {
      setCommandPressed(true);
    } else if (keyPressed === 'Control') {
      setControlPressed(true);
    } else if (controlPressed || commandPressed) {
      if (keyPressed === 'z') {
        undo();
      } else if (keyPressed === 'b') {
        reset();
      } else if (keyPressed === 'd') {
        download();
      } else if (keyPressed === 'u') {
        canvasObj.updateDisplay();
      }
    }
  }

  window.onkeyup = (e) => {
    switch (e.key) {
      case 'Meta':
        setCommandPressed(false);
        break;
      case 'Control':
        setControlPressed(false);
        break;
      default:
        return;
    }
  }

  return (
    <div id="app">
      <div id="header">
        <button id="download" onClick={() => {
          download();
        }}>Download</button>
        <button id="update" onClick={() => {
          canvasObj.updateDisplay();
        }}>Update</button>
      </div>
      <div id="menu">
        <button className={canReset ? 'reset active' : 'reset inactive'} onClick={() => {
          reset();
        }
        }>Reset</button>
        <button className={canUndo ? 'undo active' : 'undo inactive'} onClick={() => {
          undo();
        }
        }>Undo</button>
        {canvasObj ?
          <div id="options-container">
            <input type="checkbox" checked={consistentUpdate} onChange={() => {
              const oppositeUpdate = !consistentUpdate;
              if (oppositeUpdate) {
                canvasObj.updateDisplay();
              }
              setConsistentUpdate(oppositeUpdate);
            }} />
            <div className="option">
              <div className="title">
                Brightness
              </div>
              <input type="text" placeholder="Enter Value from -15 to 15" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={brightness} onKeyDown={e => {
                if (e.code === 'Enter') {
                  changeBrightness();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeInteger(value);

                setBrightnessChanged(value === '' || parseInt(value) === brightnessLevel);
              }} />
              <button className={brightnessChanged ? "submit brightness inactive" : "submit brightness active"} onClick={() => {
                changeBrightness();
                setBrightnessChanged(brightnessLevel === canvasObj.recent.properties.brightnessLevel);
              }}>Confirm
              </button>
            </div>
            <div className="option">
              <div className="title">
                Blur
              </div>
              <input type="text" readOnly ref={blurLevel} defaultValue={1} />
              <img className="blur-add" src="assets/images/add.png" alt="blur-add" onClick={() => {
                const newBlurLevel = parseInt(blurLevel.current.value) + 1;
                blurLevel.current.value = newBlurLevel;
                canvasObj.blur(newBlurLevel, newBlurLevel);
                updateAbilities();
              }} />
            </div>
            <div className="option">
              <div className="title">
                Invert
              </div>
              <input type="checkbox" checked={invertChecked} onChange={() => {
                canvasObj.invert();
                updateAbilities();
                setInvertChecked(!invertChecked);
              }} />
            </div>
            <div className="option">
              <div className="title">
                Flip
              </div>
              <input type="checkbox" checked={hFlipChecked} onChange={() => {
                canvasObj.flip('H');
                updateAbilities();
                setHFlipChecked(!hFlipChecked);
              }} />
              <input type="checkbox" checked={vFlipChecked} onChange={() => {
                canvasObj.flip('V');
                updateAbilities();
                setVFlipChecked(!vFlipChecked);
              }} />
            </div>
            <div className="option">
              <div className="title">
                Border
              </div>
              <input type="text" placeholder="Enter Thickness of Pixels" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={borderLength} onKeyDown={e => {
                if (e.code === 'Enter') {
                  changeBorder(['A'], setAllBorders);
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeWholeNumber(value);

                setAllBorders(false);
              }} />
              <input type="radio" checked={tBorderChecked} onChange={() => {
                changeBorder(['T'], setTBorderChecked);
              }
              } />
              <input type="radio" checked={bBorderChecked} onChange={() => {
                changeBorder(['B'], setBBorderChecked);
              }
              } />
              <input type="radio" checked={lBorderChecked} onChange={() => {
                changeBorder(['L'], setLBorderChecked);
              }
              } />
              <input type="radio" checked={rBorderChecked} onChange={() => {
                changeBorder(['R'], setRBorderChecked);
              }
              } />
            </div>
            <div className="option">
              <div className="title">
                Mirror
              </div>
              <input type="radio" ref={tMirror} onChange={() => {
                changeMirror('T');
              }
              } />
              <input type="radio" ref={bMirror} onChange={() => {
                changeMirror('B');
              }
              } />
              <input type="radio" ref={lMirror} onChange={() => {
                changeMirror('L');
              }
              } />
              <input type="radio" ref={rMirror} onChange={() => {
                changeMirror('R');
              }
              } />
            </div>
            <div className="option">
              <div className="title">
                Grayscale
              </div>
              <input type="radio" checked={grayScaled} onChange={() => {
                if (!grayScaled) {
                  setGrayScaled(true);
                  canvasObj.grayscale();
                  updateAbilities();
                }
              }
              } />
            </div>
            <div className="option">
              <div className="title">
                Checkers
              </div>
              <input type="text" placeholder="Enter Spacing of Pixels" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={checkersSpacing} onKeyDown={e => {
                if (e.code === 'Enter') {
                  addCheckers();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeNaturalNumber(value);

                setCheckersChanged(e.target.value === '');
              }} />
              <button className={checkersChanged ? "submit checkers inactive" : "submit checkers active"} onClick={() => {
                addCheckers();
              }}>Confirm
              </button>
            </div>
            <div className="option">
              <div className="title">
                Crop
              </div>
              <input type="text" placeholder="Enter Horizontal Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropSplitX} onKeyDown={e => {
                if (e.code === 'Enter') {
                  crop();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeNaturalNumber(value);

                setCropChanged(checkAllCrop);
              }} />
              <input type="text" placeholder="Enter Vertical Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropSplitY} onKeyDown={e => {
                if (e.code === 'Enter') {
                  crop();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeNaturalNumber(value);

                setCropChanged(checkAllCrop);
              }} />
              <input type="text" placeholder="Enter Horizontal Index" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropSectionX} onKeyDown={e => {
                if (e.code === 'Enter') {
                  crop();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeWholeNumber(value);

                setCropChanged(checkAllCrop);
              }} />
              <input type="text" placeholder="Enter Vertical Section" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropSectionY} onKeyDown={e => {
                if (e.code === 'Enter') {
                  crop();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeWholeNumber(value);

                setCropChanged(checkAllCrop);
              }} />
              <button className={cropChanged ? "submit crop inactive" : "submit crop active"} onClick={() => {
                crop();
              }}>Confirm
              </button>
            </div>
            <div className="option">
              <div className="title">
                Duplicate
              </div>
              <input type="text" placeholder="Enter Horizontal Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateSplitX} onKeyDown={e => {
                if (e.code === 'Enter') {
                  duplicate();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeNaturalNumber(value);

                setDuplicateChanged(checkAllDuplicate);
              }} />
              <input type="text" placeholder="Enter Vertical Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateSplitY} onKeyDown={e => {
                if (e.code === 'Enter') {
                  duplicate();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeNaturalNumber(value);

                setDuplicateChanged(checkAllDuplicate);
              }} />
              <input type="text" placeholder="Enter Horizontal Section" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateSectionX} onKeyDown={e => {
                if (e.code === 'Enter') {
                  duplicate();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeWholeNumber(value);

                setDuplicateChanged(checkAllDuplicate);
              }} />
              <input type="text" placeholder="Enter Vertical Section" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateSectionY} onKeyDown={e => {
                if (e.code === 'Enter') {
                  duplicate();
                }
              }} onChange={e => {
                const value = e.target.value;
                e.target.value = makeWholeNumber(value);

                setDuplicateChanged(checkAllDuplicate);
              }} />
              <button className={duplicateChanged ? "submit crop inactive" : "submit crop active"} onClick={() => {
                crop();
              }}>Confirm
              </button>
            </div>
          </div> : null}
      </div>
      <div id="canvas-container">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div >
  );
}

export default App;
