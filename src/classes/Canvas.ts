import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, BLACK_PIXEL } from '../constants/Constants';
import pixel from '../interfaces/pixel';
import properties from '../interfaces/properties';

export default class Canvas {
    properties: properties;
    imageData: ImageData | null;
    next: Canvas | null;
    pixels: pixel[];

    constructor(_context: CanvasRenderingContext2D | null, _width: number, _height: number) {
        this.properties = {
            brightnessLevel: 0,
            blurLevel: 1,
            checkersSpacing: 0,
            isInverted: false,
            isFlipped: {
                H: false,
                V: false
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
            borderLength: 0,
            cropped: {
                splitX: 1,
                splitY: 1,
                sectionX: 0,
                sectionY: 0
            },
            duplicated: {
                splitX: 1,
                splitY: 1,
                sectionX: 0,
                sectionY: 0
            },
            grayscaled: false,
            pixel: BLACK_PIXEL
        }

        this.imageData = _context === null ? null : _context.getImageData(0, 0, _width, _height);
        this.next = null;
        this.pixels = [];
    }

    updateDisplay = (context: any): void => {
        this.parsePixelsToData();
        context.putImageData(this.imageData, 0, 0);
    }

    parsePixelsToData = (): void => {
        if (this.imageData === null) {
            return;
        }

        const pixelsLength: number = this.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                this.imageData.data[i * TYPE_COUNT + j] = Math.max(Math.min(this.pixels[i][TYPES[j]], WHITE_COLOUR), BLACK_COLOUR);
            }
            this.imageData.data[(i + 1) * TYPE_COUNT] = WHITE_COLOUR;
        }
    }
}