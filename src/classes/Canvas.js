import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL } from '../Constants.js';

export default class Canvas {
    imageData;
    pixels;
    next;

    constructor(context, width, height) {
        this.imageData = context.getImageData(0, 0, width, height);
        this.pixels = this.parseDataToPixels();
        this.next = null;
    }

    updateDisplay = (context) => {
        this.parsePixelsToData();
        context.putImageData(this.imageData, 0, 0);
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
            })
        }

        return tempPixels;
    }

    parsePixelsToData = () => {
        const pixelsLength = this.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                this.imageData.data[i * TYPE_COUNT + j] = this.pixels[i][TYPES[j]];
            }
            this.imageData.data[(i + 1) * TYPE_COUNT] = WHITE_COLOUR;
        }
    } 
}