import { BLACK_PIXEL, WHITE_PIXEL, YELLOW_PIXEL, GREEN_PIXEL, BLUE_PIXEL, PURPLE_PIXEL, ORANGE_PIXEL, RED_PIXEL } from '../constants/Constants';
import pixel from '../interfaces/pixel';
import CanvasList from '../classes/CanvasList';

const setPreviousInput = (e: Event): void => {
  e.preventDefault();
}

const getValidNumber = (str: any, min: number, max: number): number | null => {
  if (str.length === 0 || str === "-" || (isNaN(str) && isNaN(str.substring(1)) && str.length > 1) || (isNaN(str[0]) && str[0] !== "-")) {
    return null;
  }

  const number = str[0] === "-" ? - parseInt(str.substring(1)) : parseInt(str);
  if (number <= max && number >= min) {
    return number;
  }
  return null;
}

const makeInteger = (value: string): string => {
  const makeIntegerWrapper = (value: string): string => {
    for (let i = 0; i < value.length; ++i) {
      if (!((value[i] >= '0' && value[i] <= '9') || value[i] === '-') || (value[i] === '-' && i !== 0) || (value[i] === '0' && value.length !== 1 && (i === 0 || (i === 1 && value[0] === '-')))) {
        return value.substring(0, i) + value.substring(i + 1);
      }
    }

    return value;
  }

  return makeIntegerWrapper(makeIntegerWrapper(value));
}

const makeNaturalNumber = (value: string): string => {
  for (let i = 0; i < value.length; ++i) {
    if (!(value[i] >= '0' && value[i] <= '9') || (value[i] === '0' && i === 0)) {
      return value.substring(0, i) + value.substring(i + 1);
    }
  }

  return value;
}

const makeWholeNumber = (value: string): string => {
  const makeWholeNumberWrapper = (value: string): string => {
    for (let i = 0; i < value.length; ++i) {
      if (!(value[i] >= '0' && value[i] <= '9') || (value[i] === '0' && value.length !== 1 && i === 0)) {
        return value.substring(0, i) + value.substring(i + 1);
      }
    }

    return value;
  }

  return makeWholeNumberWrapper(makeWholeNumberWrapper(value));
}

const parsePixelToColour = (pixel: pixel): string => {
  switch (pixel) {
    case BLACK_PIXEL:
      return 'black';
    case WHITE_PIXEL:
      return 'white';
    case YELLOW_PIXEL:
      return 'yellow';
    case BLUE_PIXEL:
      return 'blue';
    case GREEN_PIXEL:
      return 'green';
    case RED_PIXEL:
      return 'red';
    case ORANGE_PIXEL:
      return 'orange';
    case PURPLE_PIXEL:
      return 'purple';
    default:
      return 'black';
  };
}

const parseColourToPixel = (colour: string): pixel => {
  switch (colour) {
    case 'black':
      return BLACK_PIXEL;
    case 'blue':
      return BLUE_PIXEL;
    case 'red':
      return RED_PIXEL;
    case 'white':
      return WHITE_PIXEL;
    case 'green':
      return GREEN_PIXEL;
    case 'yellow':
      return YELLOW_PIXEL;
    case 'orange':
      return ORANGE_PIXEL;
    case 'purple':
      return PURPLE_PIXEL;
    default:
      return BLACK_PIXEL;
  }
}

const compareColours = (observable: any, canvasObj: CanvasList) => {
  return parseColourToPixel(observable.current.style.backgroundColour) === canvasObj.recent.properties.pixel;
}

const setAllBorders = (borderRef: any, value: boolean) => {
  for (let i in borderRef) {
    borderRef[i].current.checked = value;
  }
}

const checkAllSections = (canvasObj: CanvasList, observable: any, property: string): boolean => {
  const parsedInput: {
    splitX: number | null,
    splitY: number | null,
    sectionX: number | null,
    sectionY: number | null
  } = {
    splitX: getValidNumber(observable.splitX.current.value, 1, 20),
    splitY: getValidNumber(observable.splitY.current.value, 1, 20),
    sectionX: 0,
    sectionY: 0
  }

  if (parsedInput.splitX === null || parsedInput.splitY === null) {
    return true;
  }

  parsedInput.sectionX = getValidNumber(observable.sectionX.current.value, 0, parsedInput.splitX - 1);
  parsedInput.sectionY = getValidNumber(observable.sectionY.current.value, 0, parsedInput.splitY - 1);

  return (property !== 'cropped' && property !== 'duplicated') || parsedInput.splitX === null || parsedInput.splitY === null || parsedInput.sectionX === null || parsedInput.sectionY === null ||
    (parsedInput.splitX === 1 && parsedInput.splitY === 1 && parsedInput.sectionX === 0 && parsedInput.sectionY === 0);
}

const changeSections = (canvasObj: CanvasList, functionName: string, observable: any): boolean => {
  const parsedInput = {
    splitX: parseInt(observable.splitX.current.value),
    splitY: parseInt(observable.splitY.current.value),
    sectionX: parseInt(observable.sectionX.current.value),
    sectionY: parseInt(observable.sectionY.current.value),
  }

  if (functionName !== 'crop' && functionName !== 'duplicate') {
    return false;
  }

  canvasObj[functionName](parsedInput.splitX, parsedInput.splitY, parsedInput.sectionX, parsedInput.sectionY);
  return true;
}

export { setPreviousInput, getValidNumber, makeInteger, makeWholeNumber, makeNaturalNumber, parsePixelToColour, parseColourToPixel, compareColours, setAllBorders, checkAllSections, changeSections };