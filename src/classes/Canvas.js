import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT } from '../Constants.js';

export default class Canvas {
    imageData;
    pixels;
    next;
    properties;

    constructor(context, width, height, reference) {
        this.properties = {
            brightnessLevel: '',
            blurLevel: 1,
            checkersSpacing: '',
            isInverted: false,
            isFlipped: {
                horizontal: false,
                vertical: false
            },
            addedBorders: {
                T: false,
                B: false,
                L: false,
                R: false
            },
            mirror: {
                T: false,
                B: false,
                L: false,
                R: false
            },
            borderLength: '',
            cropped: {
                splitX: '',
                splitY: '',
                sectionX: '',
                sectionY: ''
            },
            duplicated: {
                splitX: '',
                splitY: '',
                sectionX: '',
                sectionY: ''
            },
            grayscaled: false
        }
        if (reference) {
            this.copyProperties(reference.properties);
        }
        this.imageData = context.getImageData(0, 0, width, height);
        this.pixels = reference ? this.parseReferenceToPixels(reference.pixels) : this.parseDataToPixels();
        this.next = null;
    }

    updateDisplay = (context) => {
        this.parsePixelsToData();
        context.putImageData(this.imageData, 0, 0);
    }

    copyProperties = prevProperties => {
        this.properties = this.recurseProperties(prevProperties);
    }

    recurseProperties = obj => {
        let retval = {};
        for (let i in obj) {
            typeof (obj[i]) === 'object' ? retval[i] = this.recurseProperties(obj[i]) : retval[i] = obj[i];
        }
        return retval;
    }

    parseReferenceToPixels = prevPixels => {
        const prevPixelsLength = prevPixels.length;
        let tempPixels = [];

        for (let i = 0; i < prevPixelsLength; ++i) {
            tempPixels.push({
                red: prevPixels[i].red,
                green: prevPixels[i].green,
                blue: prevPixels[i].blue,
                alpha: WHITE_COLOUR
            });
        }

        return tempPixels;
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