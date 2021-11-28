import { BLACK_COLOUR, WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL } from '../Constants.js';

export default class Canvas {
    width;
    height;
    context;
    imageData;
    pixels;
    originalPixels;

    constructor(inputImage, canvas) {
        this.width = inputImage.width;
        this.height = inputImage.height;
        this.context = canvas.getContext('2d');
        this.context.drawImage(inputImage, 0, 0);
        this.initializePixels();
        this.blur(5, 5);
        this.reset();
        this.updateDisplay();
    }

    initializePixels = () => {
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.pixels = this.parseDataToPixels();
        this.originalPixels = this.parseDataToPixels();
    }

    updateDisplay = () => {
        this.parsePixelsToData();
        this.context.putImageData(this.imageData, 0, 0);
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

    checkers = (pixel, skip) => {
        if (skip < 1) {
            return;
        }

        for (let i = 0; i < this.height; i += skip) {
            for (let j = i % 2 || skip / 2 > this.width - 1 ? 0 : Math.floor(skip / 2); j < this.width; j += skip) {
                this.pixels[i * this.width + j] = pixel;
            }
        }
    }

    lines = (pixel, intensity, skip, direction) => {
        if (skip < 1) {
            return;
        }

        let intensityCounter = intensity;
        switch (direction[0].toUpperCase()) {
            case 'V': case 'U': case 'D':
                for (let i = 0; i < this.width; i += intensityCounter === 0 ? skip : 1) {
                    for (let j = 0; j < this.height; ++j) {
                        this.pixels[j * this.width + i] = pixel;
                    }

                    if (intensityCounter === 0) {
                        intensityCounter = intensity;
                    } else {
                        --intensityCounter;
                    }
                }
                break;
            case 'H': case 'L': case 'R':
                for (let i = 0; i < this.height; i += intensityCounter === 0 ? skip : 1) {
                    for (let j = 0; j < this.width; ++j) {
                        this.pixels[i * this.width + j] = pixel;
                    }

                    if (intensityCounter === 0) {
                        intensityCounter = intensity;
                    } else {
                        --intensityCounter;
                    }
                }
                break;
            default:
                return;

        }
    }

    contrast = (style, level) => {
        let increment = 0;
        let limit = 0;

        switch (style[0].toUpperCase()) {
            case 'B':
                increment = 20;
                limit = WHITE_COLOUR;
                break;
            case 'D':
                increment = -20;
                limit = BLACK_COLOUR;
                break;
            default:
                return;
        }

        const pixelsLength = this.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                for (let k = 0; k < level; ++k) {
                    const currColour = this.pixels[i][TYPES[j]];
                    this.pixels[i][TYPES[j]] = currColour + increment > BLACK_COLOUR && currColour + increment < WHITE_COLOUR ? currColour + increment : limit;
                }
            }
        }
    }

    invert = () => {
        const pixelsLength = this.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                this.pixels[i][TYPES[j]] = 255 - this.pixels[i][TYPES[j]];
            }
        }
    }

    flip = (direction) => {
        switch (direction[0].toUpperCase()) {
            case 'H': case 'X':
                for (let i = 0; i < Math.floor(this.width / 2); ++i) {
                    for (let j = 0; j < this.height; ++j) {
                        const tempPixel = this.pixels[j * this.width + i];
                        this.pixels[j * this.width + i] = this.pixels[j * this.width + this.width - 1 - i];
                        this.pixels[j * this.width + this.width - 1 - i] = tempPixel;
                    }
                }
                break;
            case 'V': case 'Y':
                for (let i = 0; i < Math.floor(this.height / 2); ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        const tempPixel = this.pixels[i * this.width + j];
                        this.pixels[i * this.width + j] = this.pixels[(this.height - 1 - i) * this.width + j];
                        this.pixels[(this.height - 1 - i) * this.width + j] = tempPixel;
                    }
                }
                break;
            default:
                return;
        }
    }

    cropTopLeft = () => {
        const widthMidpoint = Math.floor(this.width / 2);
        const heightMidpoint = Math.floor(this.height / 2);
        const remainingWidth = this.width % widthMidpoint;
        const remainingHeight = this.height % heightMidpoint;

        for (let i = heightMidpoint - 1; i >= 0; --i) {
            for (let j = widthMidpoint - 1; j >= 0; --j) {
                const currPixel = this.pixels[i * this.width + j];
                const mapX = this.width - 1 - 2 * (widthMidpoint - 1 - j);
                const mapY = this.height - 1 - 2 * (heightMidpoint - 1 - i);

                for (let k = 0; k < 2; ++k) {
                    for (let l = 0; l < 2; ++l) {
                        this.pixels[(mapY - k) * this.width + mapX - l] = currPixel;
                    }
                }
            }
        }

        if (remainingWidth !== 0) {
            this.cleanBorders(remainingWidth, 'L', WHITE_PIXEL);
        }

        if (remainingHeight !== 0) {
            this.cleanBorders(remainingHeight, 'T', WHITE_PIXEL);
        }
    }

    crop = (splitX, splitY, sectionX, sectionY) => {
        if (splitX === 2 && splitY === 2 && sectionX === 0 && sectionY === 0) {
            this.cropTopLeft();
            return;
        }

        const widthMidpoint = Math.floor(this.width / splitX);
        const heightMidpoint = Math.floor(this.height / splitY);
        const remainingWidth = this.width % splitX;
        const remainingHeight = this.height % splitY;

        let sectionPixels = [];
        for (let i = sectionY * heightMidpoint; i < (sectionY + 1) * heightMidpoint; ++i) {
            for (let j = sectionX * widthMidpoint; j < (sectionX + 1) * widthMidpoint; ++j) {
                sectionPixels.push(this.pixels[i * this.width + j]);
            }
        }

        for (let i = 0; i < heightMidpoint; ++i) {
            for (let j = 0; j < widthMidpoint; ++j) {
                const currPixel = sectionPixels[i * widthMidpoint + j];

                for (let k = 0; k < splitY; ++k) {
                    for (let l = 0; l < splitX; ++l) {
                        this.pixels[(k + i * splitY) * this.width + l + j * splitX] = currPixel;
                    }
                }
            }
        }

        if (remainingWidth !== 0) {
            this.cleanBorders(remainingWidth, 'R', WHITE_PIXEL);
        }

        if (remainingHeight !== 0) {
            this.cleanBorders(remainingHeight, 'B', WHITE_PIXEL);
        }
    }


    duplicate = (splitX, splitY, sectionX, sectionY) => {
        const widthMidpoint = Math.floor(this.width / splitX);
        const heightMidpoint = Math.floor(this.height / splitY);
        const remainingWidth = this.width % splitX;
        const remainingHeight = this.height % splitY;

        for (let i = 0; i < heightMidpoint; ++i) {
            for (let j = 0; j < widthMidpoint; ++j) {
                const currPixel = this.pixels[(i + sectionY * heightMidpoint) * this.width + j + sectionX * widthMidpoint];

                for (let k = 0; k < this.height - remainingHeight; k += heightMidpoint) {
                    for (let l = 0; l < this.width - remainingWidth; l += widthMidpoint) {
                        if (k !== sectionY * heightMidpoint || l !== sectionX * widthMidpoint) {
                            this.pixels[(i + k) * this.width + j + l] = currPixel;
                        }
                    }
                }
            }
        }

        if (remainingWidth !== 0) {
            this.cleanBorders(remainingWidth, 'R', WHITE_PIXEL);
        }

        if (remainingHeight !== 0) {
            this.cleanBorders(remainingHeight, 'B', WHITE_PIXEL);
        }
    }

    addBorders = (length, pixel, borders) => {
        let addToBorder = {
            'T': false,
            'B': false,
            'L': false,
            'R': false
        }

        for (let i = 0; i < borders.length; ++i) {
            const currBorder = borders[i].toUpperCase();
            if (currBorder === 'A') {
                for (let j in addToBorder) {
                    addToBorder[j] = true;
                }
                break;
            }

            if (currBorder in addToBorder) {
                addToBorder[currBorder] = true;
            }
        }

        for (let i in addToBorder) {
            if (addToBorder[i]) {
                this.cleanBorders(length, i, pixel);
            }
        }
    }

    cleanBorders = (remaining, direction, pixel) => {
        switch (direction[0].toUpperCase()) {
            case 'T':
                for (let i = 0; i < remaining; ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        this.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            case 'B':
                for (let i = this.height - remaining; i < this.height; ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        this.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            case 'L':
                for (let i = 0; i < this.height; ++i) {
                    for (let j = 0; j < remaining; ++j) {
                        this.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            case 'R':
                for (let i = 0; i < this.height; ++i) {
                    for (let j = this.width - remaining; j < this.width; ++j) {
                        this.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            default:
                return;
        }
    }

    mirror = direction => {
        switch (direction[0].toUpperCase()) {
            case 'T':
                for (let i = 0; i < Math.floor(this.height / 2); ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        this.pixels[(this.height - 1 - i) * this.width + j] = this.pixels[i * this.width + j];
                    }
                }
                break;
            case 'B':
                for (let i = 0; i < Math.floor(this.height / 2); ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        this.pixels[i * this.width + j] = this.pixels[(this.height - 1 - i) * this.width + j];
                    }
                }
                break;
            case 'L':
                for (let i = 0; i < Math.floor(this.width / 2); ++i) {
                    for (let j = 0; j < this.height; ++j) {
                        this.pixels[j * this.width + this.width - 1 - i] = this.pixels[j * this.width + i];
                    }
                }
                break;
            case 'R':
                for (let i = 0; i < Math.floor(this.width / 2); ++i) {
                    for (let j = 0; j < this.height; ++j) {
                        this.pixels[j * this.width + i] = this.pixels[j * this.width + this.width - 1 - i];
                    }
                }
                break;
            default:
                return;
        }
    }

    blur = (levelX, levelY) => {
        for (let i = 0; i < this.height; i += levelY) {
            for (let j = 0; j < this.width; j += levelX) {
                let sum = {
                    red: 0,
                    green: 0,
                    blue: 0
                };
                let count = 0;

                for (let k = i; k < i + levelY; ++k) {
                    for (let l = j; l < j + levelX; ++l) {
                        if (k >= 0 && k < this.height && l >= 0 && l < this.width) {
                            ++count;
                            for (let m = 0; m < TYPE_COUNT - 1; ++m) {
                                sum[TYPES[m]] += this.pixels[k * this.width + l][TYPES[m]];
                            }
                        }
                    }
                }

                const average = {
                    red: sum.red / count,
                    green: sum.green / count,
                    blue: sum.blue / count,
                    alpha: WHITE_COLOUR
                }

                for (let k = i; k < i + levelY; ++k) {
                    for (let l = j; l < j + levelX; ++l) {
                        if (k >= 0 && k < this.height && l >= 0 && l < this.width) {
                            this.pixels[k * this.width + l] = average;
                        }
                    }
                }
            }
        }
    }

    // TODO: verify that space complexity O(1)
    reset = () => {
        const pixelsLength = this.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            this.pixels[i] = this.originalPixels[i];
        }
    }
}