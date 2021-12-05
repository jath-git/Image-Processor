import pixel from '../interfaces/pixel';

const BLACK_COLOUR: number = 0;
const WHITE_COLOUR: number = 255;
const TYPES: string[] = ['red', 'green', 'blue', 'alpha'];
const TYPE_COUNT: number = 4;
const WHITE_PIXEL: pixel = {
    red: WHITE_COLOUR,
    green: WHITE_COLOUR,
    blue: WHITE_COLOUR,
    alpha: WHITE_COLOUR
}
const BLACK_PIXEL: pixel = {
    red: BLACK_COLOUR,
    green: BLACK_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const RED_PIXEL: pixel = {
    red: WHITE_COLOUR,
    green: BLACK_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const BLUE_PIXEL: pixel = {
    red: BLACK_COLOUR,
    green: BLACK_COLOUR,
    blue: WHITE_COLOUR,
    alpha: WHITE_COLOUR
}
const GREEN_PIXEL: pixel = {
    red: BLACK_COLOUR,
    green: WHITE_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const ORANGE_PIXEL: pixel = {
    red: WHITE_COLOUR,
    green: WHITE_COLOUR * 11 / 17,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const PURPLE_PIXEL: pixel = {
    red: WHITE_COLOUR / 2,
    green: BLACK_COLOUR,
    blue: WHITE_COLOUR / 2,
    alpha: WHITE_COLOUR
}
const YELLOW_PIXEL: pixel = {
    red: WHITE_COLOUR,
    green: WHITE_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}

const COLOURS_LIST: string[] = ['black', 'blue', 'red', 'white', 'green', 'purple', 'orange', 'yellow'];
const SECTIONS_LIST: string[] = ['splitX', 'splitY', 'sectionX', 'sectionY'];
const DIRECTIONS_LIST: string[] = ['T', 'B', 'L', 'R'];
const ORIENTATIONS_LIST: string[] = ['H', 'V'];

const TIME_DURATION = 1000;

export { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL, BLACK_PIXEL, BLUE_PIXEL, RED_PIXEL, GREEN_PIXEL, PURPLE_PIXEL, ORANGE_PIXEL, YELLOW_PIXEL, COLOURS_LIST, DIRECTIONS_LIST, SECTIONS_LIST, ORIENTATIONS_LIST, TIME_DURATION }