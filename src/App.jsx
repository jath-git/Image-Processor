import './App.scss';
import CanvasList from './classes/CanvasList';
import { useState, useRef, useEffect, useMemo } from 'react';
import { BLACK_PIXEL, RED_PIXEL, WHITE_PIXEL, BLUE_PIXEL, GREEN_PIXEL, YELLOW_PIXEL, PURPLE_PIXEL, ORANGE_PIXEL } from './Constants';
import { setPreviousInput, getValidNumber, makeInteger, makeWholeNumber, makeNaturalNumber } from './utilities/default';

function App() {
  let imageLoaded = useRef(false);
  let [canvasObj, setCanvasObj] = useState(null);
  let [canUndo, setCanUndo] = useState(false);
  let [canReset, setCanReset] = useState(false);
  let [invertChecked, setInvertChecked] = useState(false);
  let [hFlipChecked, setHFlipChecked] = useState(false);
  let [vFlipChecked, setVFlipChecked] = useState(false);
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
  let [pixel, setPixel] = useState(BLACK_PIXEL);
  let [blackChecked, setBlackChecked] = useState(true);
  let [blueChecked, setBlueChecked] = useState(false);
  let [purpleChecked, setPurpleChecked] = useState(false);
  let [orangeChecked, setOrangeChecked] = useState(false);
  let [yellowChecked, setYellowChecked] = useState(false);
  let [greenChecked, setGreenChecked] = useState(false);
  let [redChecked, setRedChecked] = useState(false);
  let [whiteChecked, setWhiteChecked] = useState(false);
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

  const image = useMemo(() => new Image(), []);
  image.src = 'assets/images/landscape.jpg';

  useEffect(() => {
    if (!imageLoaded.current) {
      imageLoaded.current = true;
      setTimeout(() => {
        canvas.current.width = parseInt(image.width);
        canvas.current.height = parseInt(image.height);
        setCanvasObj(new CanvasList(image, canvas.current));
      }, 1000);
    }
  });

  const updateAbilities = () => {
    if (consistentUpdate) {
      canvasObj.updateDisplay();
    }
    setCanUndo(canvasObj.canUndo);
    setCanReset(canvasObj.canReset);
  }

  const updateElements = () => {
    updateAbilities();
    const properties = canvasObj.recent.properties;
    brightness.current.value = properties.brightnessLevel;
    borderLength.current.value = properties.borderLength;
    checkersSpacing.current.value = properties.checkersSpacing;
    cropSplitX.current.value = properties.cropped.splitX;
    cropSplitY.current.value = properties.cropped.splitY;
    cropSectionX.current.value = properties.cropped.sectionX;
    cropSectionY.current.value = properties.cropped.sectionY;
    duplicateSplitX.current.value = properties.duplicated.splitX;
    duplicateSplitY.current.value = properties.duplicated.splitY;
    duplicateSectionX.current.value = properties.duplicated.sectionX;
    duplicateSectionY.current.value = properties.duplicated.sectionY;
    blurLevel.current.value = properties.blurLevel;
    tMirror.current.checked = properties.mirror.T;
    bMirror.current.checked = properties.mirror.B;
    lMirror.current.checked = properties.mirror.L;
    rMirror.current.checked = properties.mirror.R;

    setInvertChecked(properties.isInverted);
    setHFlipChecked(properties.isFlipped.horizontal);
    setVFlipChecked(properties.isFlipped.vertical);
    setTBorderChecked(false);
    setBBorderChecked(false);
    setLBorderChecked(false);
    setRBorderChecked(false);
    setGrayScaled(properties.grayscaled);
    setPixel(properties.pixel);
    setBlackChecked(properties.pixel === BLACK_PIXEL);
    setBlueChecked(properties.pixel === BLUE_PIXEL);
    setGreenChecked(properties.pixel === GREEN_PIXEL);
    setPurpleChecked(properties.pixel === PURPLE_PIXEL);
    setYellowChecked(properties.pixel === YELLOW_PIXEL);
    setOrangeChecked(properties.pixel === ORANGE_PIXEL);
    setRedChecked(properties.pixel === RED_PIXEL);
    setWhiteChecked(properties.pixel === WHITE_PIXEL);
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
      canvasObj.addBorders(number, pixel, borders);
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
    if (checkersChanged) {
      return;
    }
    const value = checkersSpacing.current.value;
    const number = getValidNumber(value, 1, Math.max(canvasObj.width, canvasObj.height));

    if (number !== null) {
      canvasObj.checkers(pixel, number);
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

    return parsedInput.splitX === null || parsedInput.splitY === null || parsedInput.sectionX === null || parsedInput.sectionY === null ||
      (parsedInput.splitX === canvasObj.recent.properties.cropped.splitX && parsedInput.splitY === canvasObj.recent.properties.cropped.splitY && parsedInput.sectionX === canvasObj.recent.properties.cropped.sectionX && parsedInput.sectionY === canvasObj.recent.properties.cropped.sectionY);
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
    setDuplicateChanged(true);
  }

  const checkAllDuplicate = () => {
    const parsedInput = {
      splitX: getValidNumber(duplicateSplitX.current.value, 1, 20),
      splitY: getValidNumber(duplicateSplitY.current.value, 1, 20),
      sectionX: 0,
      sectionY: 0
    }

    parsedInput.sectionX = getValidNumber(duplicateSectionX.current.value, 0, parsedInput.splitX - 1);
    parsedInput.sectionY = getValidNumber(duplicateSectionY.current.value, 0, parsedInput.splitY - 1)

    return parsedInput.splitX === null || parsedInput.splitY === null || parsedInput.sectionX === null || parsedInput.sectionY === null ||
      (parsedInput.splitX === canvasObj.recent.properties.duplicated.splitX && parsedInput.splitY === canvasObj.recent.properties.duplicated.splitY && parsedInput.sectionX === canvasObj.recent.properties.duplicated.sectionX && parsedInput.sectionY === canvasObj.recent.properties.duplicated.sectionY);
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

  const setColour = colour => {
    if (colour.length < 3) {
      return;
    }

    let newPixel = BLACK_PIXEL;
    switch (colour.substring(0, 3).toUpperCase()) {
      case 'BLA':
        newPixel = BLACK_PIXEL;
        break;
      case 'BLU':
        newPixel = BLUE_PIXEL;
        break;
      case 'RED':
        newPixel = RED_PIXEL;
        break;
      case 'WHI':
        newPixel = WHITE_PIXEL;
        break;
      case 'GRE':
        newPixel = GREEN_PIXEL;
        break;
      case 'YEL':
        newPixel = YELLOW_PIXEL;
        break;
      case 'ORA':
        newPixel = ORANGE_PIXEL;
        break;
      case 'PUR':
        newPixel = PURPLE_PIXEL;
        break;
      default:
        return;
    }
    if (pixel === newPixel) {
      return;
    }
    setPixel(newPixel);
    if (checkersSpacing.current.value !== '') {
      setCheckersChanged(false);
    }

    const colours = ['BLA', 'BLU', 'RED', 'WHI', 'GRE', 'PUR', 'ORA', 'YEL'];
    const setters = [setBlackChecked, setBlueChecked, setRedChecked, setWhiteChecked, setGreenChecked, setPurpleChecked, setOrangeChecked, setYellowChecked];
    const indexOfColour = colours.indexOf(colour);
    for (let i = 0; i < colours.length; ++i) {
      if (indexOfColour !== i) {
        setters[i](false);
      }
    }
    setters[indexOfColour](true);
  }

  return (
    <div id="app">
      <div id="header">
        <button className={consistentUpdate ? "none" : "update"} onClick={() => {
          canvasObj.updateDisplay();
        }}>Update
        </button>
        <button className="download" onClick={() => {
          download();
        }}>Download
        </button>
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
                Colour
              </div>
              <input type="radio" checked={blackChecked} onChange={() => {
                setColour('BLA');
              }} />
              <input type="radio" checked={blueChecked} onChange={() => {
                setColour('BLU');
              }} />
              <input type="radio" checked={redChecked} onChange={() => {
                setColour('RED');
              }} />
              <input type="radio" checked={whiteChecked} onChange={() => {
                setColour('WHI');
              }} />
              <input type="radio" checked={yellowChecked} onChange={() => {
                setColour('YEL');
              }} />
              <input type="radio" checked={greenChecked} onChange={() => {
                setColour('GRE');
              }} />
              <input type="radio" checked={purpleChecked} onChange={() => {
                setColour('PUR');
              }} />
              <input type="radio" checked={orangeChecked} onChange={() => {
                setColour('ORA');
              }} />
            </div>
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
