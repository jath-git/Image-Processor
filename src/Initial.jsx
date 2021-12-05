import { useRef, useState } from 'react';
import App from './App';
import { TYPE_COUNT, TYPES, COLOURS_LIST, DIRECTIONS_LIST, SECTIONS_LIST, ORIENTATIONS_LIST, BLACK_PIXEL } from './constants/Constants';
import { parseColourToPixel, parsePixelToColour, checkAllSections } from './utilities/default';

export default function Initial() {
    let [canvasObj, setCanvasObj] = useState(null);
    let [canUndo, setCanUndo] = useState(false);
    let [canReset, setCanReset] = useState(false);
    let [consistentUpdate, setConsistentUpdate] = useState(true);
    let [pixel, setPixel] = useState(BLACK_PIXEL);

    let accumulators = {
        canvas: useRef(null),
        imageLoaded: useRef(false),
        canvasObj,
        setCanvasObj,
        canUndo,
        setCanUndo,
        canReset,
        setCanReset,
        consistentUpdate,
        setConsistentUpdate,
        pixel,
        setPixel
    }

    let [commandPressed, setCommandPressed] = useState(false);
    let [controlPressed, setControlPressed] = useState(false);
    let [brightnessChanged, setBrightnessChanged] = useState(true);
    let [checkersChanged, setCheckersChanged] = useState(true);
    let [cropChanged, setCropChanged] = useState(true);
    let [duplicateChanged, setDuplicateChanged] = useState(true);

    const modifiers = {
        command: {
            get: commandPressed,
            set: setCommandPressed
        },
        control: {
            get: controlPressed,
            set: setControlPressed
        },
        brightness: {
            get: brightnessChanged,
            set: setBrightnessChanged
        },
        checkers: {
            get: checkersChanged,
            set: setCheckersChanged
        },
        crop: {
            get: cropChanged,
            set: setCropChanged
        },
        duplicate: {
            get: duplicateChanged,
            set: setDuplicateChanged
        }
    }

    const observables = {
        checkersRef: useRef(null),
        brightnessRef: useRef(null),
        blurRef: useRef(null),
        colour: useRef(null),
        grayRef: useRef(null),
        invertRef: useRef(null),

        flipRef: {
            H: useRef(null),
            V: useRef(null)
        },
        borderRef: {
            borderLength: useRef(null),
            T: useRef(null),
            B: useRef(null),
            L: useRef(null),
            R: useRef(null),
        },
        colourRef: {
            black: useRef(null),
            blue: useRef(null),
            red: useRef(null),
            yellow: useRef(null),
            green: useRef(null),
            orange: useRef(null),
            purple: useRef(null),
            white: useRef(null),
        },
        cropRef: {
            splitX: useRef(null),
            splitY: useRef(null),
            sectionX: useRef(null),
            sectionY: useRef(null)
        },
        duplicateRef: {
            splitX: useRef(null),
            splitY: useRef(null),
            sectionX: useRef(null),
            sectionY: useRef(null)
        },
        mirrorRef: {
            T: useRef(null),
            B: useRef(null),
            L: useRef(null),
            R: useRef(null),
        }
    }

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
        observables.brightnessRef.current.value = properties.brightnessLevel === 0 ? '' : properties.brightnessLevel;
        observables.borderRef.borderLength.current.value = properties.borderLength === 0 ? '' : properties.borderLength;
        observables.checkersRef.current.value = properties.checkersSpacing === 0 ? '' : properties.checkersSpacing;
        observables.blurRef.current.value = properties.blurLevel;

        if (canvasObj.recent.next === null) {
            for (let i = 0; i < SECTIONS_LIST.length; ++i) {
                observables.cropRef[SECTIONS_LIST[i]].current.value = '';
                observables.duplicateRef[SECTIONS_LIST[i]].current.value = '';
            }
        } else {
            for (let i = 0; i < SECTIONS_LIST.length; ++i) {
                observables.cropRef[SECTIONS_LIST[i]].current.value = properties.cropped[SECTIONS_LIST[i]];
                observables.duplicateRef[SECTIONS_LIST[i]].current.value = properties.duplicated[SECTIONS_LIST[i]];
            }
        }

        for (let i = 0; i < DIRECTIONS_LIST.length; ++i) {
            observables.mirrorRef[DIRECTIONS_LIST[i]].current.checked = properties.mirror[DIRECTIONS_LIST[i]];
        }

        observables.colour.current.style.backgroundColor = parsePixelToColour(properties.pixel);

        observables.invertRef.current.checked = properties.isInverted;

        for (let i = 0; i < ORIENTATIONS_LIST.length; ++i) {
            observables.flipRef[ORIENTATIONS_LIST[i]].current.checked = properties.isFlipped[ORIENTATIONS_LIST[i]];
        }

        for (let i = 0; i < DIRECTIONS_LIST.length; ++i) {
            observables.borderRef[DIRECTIONS_LIST[i]].current.checked = properties.addedBorders[DIRECTIONS_LIST[i]];
        }

        observables.grayRef.current.checked = properties.grayscaled;
        setPixel(properties.pixel);

        for (let i = 0; i < COLOURS_LIST.length; ++i) {
            const translatePixel = parseColourToPixel(COLOURS_LIST[i]);
            let setFalse = false;

            for (let j = 0; j < TYPE_COUNT; ++j) {
                if (properties.pixel[TYPES[j]] !== translatePixel[TYPES[j]]) {
                    observables.colourRef[COLOURS_LIST[i]].current.checked = false;
                    setFalse = true;
                }
            }

            if (!setFalse) {
                observables.colourRef[COLOURS_LIST[i]].current.checked = true;
            }
        }

        modifiers.crop.set(checkAllSections(canvasObj, observables.cropRef, 'cropped'));
        modifiers.duplicate.set(checkAllSections(canvasObj, observables.duplicateRef, 'duplicated'));

        modifiers.checkers.set(true);
        modifiers.brightness.set(true);
    }

    return (
        <App modifiers={modifiers} observables={observables} accumulators={accumulators} updateAbilities={updateAbilities} updateElements={updateElements} />
    )
}