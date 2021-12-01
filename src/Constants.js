const BLACK_COLOUR = 0;
const WHITE_COLOUR = 255;
const TYPES = ['red', 'green', 'blue', 'alpha'];
const TYPE_COUNT = 4;
const WHITE_PIXEL = {
    red: WHITE_COLOUR,
    green: WHITE_COLOUR,
    blue: WHITE_COLOUR,
    alpha: WHITE_COLOUR
}
const BLACK_PIXEL = {
    red: BLACK_COLOUR,
    green: BLACK_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const RED_PIXEL = {
    red: WHITE_COLOUR,
    green: BLACK_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const BLUE_PIXEL = {
    red: BLACK_COLOUR,
    green: BLACK_COLOUR,
    blue: WHITE_COLOUR,
    alpha: WHITE_COLOUR
}
const GREEN_PIXEL = {
    red: BLACK_COLOUR,
    green: WHITE_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const ORANGE_PIXEL = {
    red: WHITE_COLOUR,
    green: WHITE_COLOUR * 11 / 17,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}
const PURPLE_PIXEL = {
    red: WHITE_COLOUR / 2,
    green: BLACK_COLOUR,
    blue: WHITE_COLOUR / 2,
    alpha: WHITE_COLOUR
}
const YELLOW_PIXEL = {
    red: WHITE_COLOUR,
    green: WHITE_COLOUR,
    blue: BLACK_COLOUR,
    alpha: WHITE_COLOUR
}

export { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL, BLACK_PIXEL, BLUE_PIXEL, RED_PIXEL, GREEN_PIXEL, PURPLE_PIXEL, ORANGE_PIXEL, YELLOW_PIXEL }