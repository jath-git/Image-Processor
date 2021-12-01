import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT } from '../Constants.js';
import Canvas from './Canvas';

export default class OriginalCanvas extends Canvas {
    constructor(_context, _width, _height) {
        super(_context, _width, _height);
        this.pixels = this.parseDataToPixels();
    }

    parseDataToPixels = () => {
        const dataLength = this.imageData.data.length;
        let tempPixels = [];

        for (let i = 0; i < dataLength; i += TYPE_COUNT) {
            tempPixels.push({
                red: this.imageData.data[i],
                green: this.imageData.data[i + 1],
                blue: this.imageData.data[i + 2],
                alpha: this.imageData.data[i + 3],
            });
        }

        return tempPixels;
    }

    parsePixelsToData = () => {
        const pixelsLength = this.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                this.imageData.data[i * TYPE_COUNT + j] = Math.max(Math.min(this.pixels[i][TYPES[j]], WHITE_COLOUR), BLACK_COLOUR);
            }
            this.imageData.data[(i + 1) * TYPE_COUNT] = WHITE_COLOUR;
        }
    }
}