import { BLACK_PIXEL, WHITE_PIXEL, YELLOW_PIXEL, GREEN_PIXEL, BLUE_PIXEL, PURPLE_PIXEL, ORANGE_PIXEL, RED_PIXEL } from '../Constants';
import pixel from '../interfaces/pixel';

const setPreviousInput = (e: any): void => {
  e.preventDefault();
}

const getValidNumber = (str: any, min: number, max: number): number | null => {
  if (str.length === 0 || str === "-" || (isNaN(str) && isNaN(str.subtring(1) && str.length > 1)) || (isNaN(str[0]) && str[0] !== "-")) {
    return null;
  }

  const number = str[0] === "-" ? - parseInt(str.substring(1)) : parseInt(str);
  if (number <= max && number >= min) {
    return number;
  }
  return null;
}


const makeInteger = (value: string): string => {
  for (let i = 0; i < value.length; ++i) {
    if (!((value[i] >= '0' && value[i] <= '9') || value[i] === '-') || (value[i] === '-' && i !== 0) || (value[i] === '0' && value.length !== 1 && (i === 0 || (i === 1 && value[0] === '-')))) {
      return value.substring(0, i) + value.substring(i + 1);
    }
  }

  return value;
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
  for (let i = 0; i < value.length; ++i) {
    if (!(value[i] >= '0' && value[i] <= '9') || (value[i] === '0' && value.length !== 1 && i === 0)) {
      return value.substring(0, i) + value.substring(i + 1);
    }
  }

  return value;
}

const getColour = (pixel: pixel): string => {
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

export { setPreviousInput, getValidNumber, makeInteger, makeWholeNumber, makeNaturalNumber, getColour };