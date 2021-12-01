import { WHITE_COLOUR, TYPES, TYPE_COUNT, WHITE_PIXEL } from '../Constants.js';
import ModifiedCanvas from './ModifiedCanvas.js';
import OriginalCanvas from './OriginalCanvas.js';

export default class CanvasList {
    constructor(inputImage, canvas) {
        this.width = inputImage.width;
        this.height = inputImage.height;
        this.context = canvas.getContext('2d');
        this.context.drawImage(inputImage, 0, 0);
        this.original = new OriginalCanvas(this.context, this.width, this.height);
        this.recent = this.original;
        this.canUndo = false;
        this.canReset = false;
        this.image = inputImage;
        this.updateDisplay();
    }

    updateDisplay = () => {
        this.recent.updateDisplay(this.context);
    }

    makeNewRecent = reference => {
        return new ModifiedCanvas(this.context, this.width, this.height, reference);
    }

    setNewRecent = newRecent => {
        newRecent.next = this.recent;
        this.recent = newRecent;
        this.canUndo = true;
        this.canReset = true;
    }

    grayscale = () => {
        const pixelsLength = this.width * this.height;
        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.grayscaled = true;

        for (let i = 0; i < pixelsLength; ++i) {
            const gray = 0.299 * newRecent.pixels[i].red + 0.587 * newRecent.pixels[i].green + 0.114 * newRecent.pixels[i].blue;
            newRecent.pixels[i].red = gray;
            newRecent.pixels[i].green = gray;
            newRecent.pixels[i].blue = gray;
        }
        this.setNewRecent(newRecent);
    }

    checkers = (pixel, skip) => {
        if (skip < 1) {
            return;
        }
        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.checkersSpacing = skip;
        newRecent.properties.pixel = pixel;

        for (let i = 0; i < this.height; i += skip) {
            for (let j = i % 2 || skip / 2 > this.width - 1 ? 0 : Math.floor(skip / 2); j < this.width; j += skip) {
                newRecent.pixels[i * this.width + j] = pixel;
            }
        }

        this.setNewRecent(newRecent);
    }

    lines = (pixel, intensity, skip, direction) => {
        if (skip < 1 || direction.length === 0) {
            return;
        }

        const simpleDirection = direction[0].toUpperCase();
        if (!(simpleDirection === 'V' || simpleDirection === 'U' || simpleDirection === 'D' || simpleDirection === 'H' || simpleDirection === 'L' || simpleDirection === 'R')) {
            return;
        }

        const newRecent = this.makeNewRecent(this.recent);
        let intensityCounter = intensity;

        if (simpleDirection === 'V' || simpleDirection === 'U' || simpleDirection === 'D') {
            for (let i = 0; i < this.width; i += intensityCounter === 0 ? skip : 1) {
                for (let j = 0; j < this.height; ++j) {
                    newRecent.pixels[j * this.width + i] = pixel;
                }

                intensityCounter === 0 ? intensityCounter = intensity : --intensityCounter;
            }
        } else {
            for (let i = 0; i < this.height; i += intensityCounter === 0 ? skip : 1) {
                for (let j = 0; j < this.width; ++j) {
                    newRecent.pixels[i * this.width + j] = pixel;
                }

                intensityCounter === 0 ? intensityCounter = intensity : --intensityCounter;
            }
        }
        this.setNewRecent(newRecent);
    }

    brightness = (newBrightnessLevel) => {
        const level = newBrightnessLevel - this.recent.properties.brightnessLevel;
        if (level > 0) {
            this.contrast(20, level, newBrightnessLevel);
        } else if (level < 0) {
            this.contrast(-20, - level, newBrightnessLevel);
        }
    }

    contrast = (increment, level, newBrightnessLevel) => {
        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.brightnessLevel = newBrightnessLevel;

        const pixelsLength = newRecent.pixels.length;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                for (let k = 0; k < level; ++k) {
                    const currColour = newRecent.pixels[i][TYPES[j]];
                    // newRecent.pixels[i][TYPES[j]] = currColour + increment > BLACK_COLOUR && currColour + increment < WHITE_COLOUR ? currColour + increment : limit;
                    newRecent.pixels[i][TYPES[j]] = currColour + increment;
                }
            }
        }

        this.setNewRecent(newRecent);
    }

    invert = () => {
        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.isInverted = !newRecent.properties.isInverted;
        const pixelsLength = this.height * this.width;
        for (let i = 0; i < pixelsLength; ++i) {
            for (let j = 0; j < TYPE_COUNT - 1; ++j) {
                if (!newRecent.pixels[i]) {
                    i = pixelsLength;
                }
                newRecent.pixels[i][TYPES[j]] = 255 - newRecent.pixels[i][TYPES[j]];
            }
        }
        this.setNewRecent(newRecent);
    }

    flip = (direction) => {
        if (direction.length === 0) {
            return;
        }

        const simpleDirection = direction[0].toUpperCase();
        if (!(simpleDirection === 'H' || simpleDirection === 'X' || simpleDirection === 'V' || simpleDirection === 'Y')) {
            return;
        }

        const newRecent = this.makeNewRecent(this.recent);
        if (simpleDirection === 'H' || simpleDirection === 'X') {
            newRecent.properties.isFlipped.horizontal = !newRecent.properties.isFlipped.horizontal;
            for (let i = 0; i < Math.floor(this.width / 2); ++i) {
                for (let j = 0; j < this.height; ++j) {
                    const tempPixel = newRecent.pixels[j * this.width + i];
                    newRecent.pixels[j * this.width + i] = newRecent.pixels[j * this.width + this.width - 1 - i];
                    newRecent.pixels[j * this.width + this.width - 1 - i] = tempPixel;
                }
            }
        } else {
            newRecent.properties.isFlipped.vertical = !newRecent.properties.isFlipped.vertical;
            for (let i = 0; i < Math.floor(this.height / 2); ++i) {
                for (let j = 0; j < this.width; ++j) {
                    const tempPixel = newRecent.pixels[i * this.width + j];
                    newRecent.pixels[i * this.width + j] = newRecent.pixels[(this.height - 1 - i) * this.width + j];
                    newRecent.pixels[(this.height - 1 - i) * this.width + j] = tempPixel;
                }
            }
        }
        this.setNewRecent(newRecent);
    }

    cropTopLeft = () => {
        const widthMidpoint = Math.floor(this.width / 2);
        const heightMidpoint = Math.floor(this.height / 2);
        const remainingWidth = this.width % widthMidpoint;
        const remainingHeight = this.height % heightMidpoint;

        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.cropped.splitX = 2;
        newRecent.properties.cropped.splitY = 2;
        newRecent.properties.cropped.sectionX = 0;
        newRecent.properties.cropped.sectionY = 0;
        for (let i = heightMidpoint - 1; i >= 0; --i) {
            for (let j = widthMidpoint - 1; j >= 0; --j) {
                const currPixel = newRecent.pixels[i * this.width + j];
                const mapX = this.width - 1 - 2 * (widthMidpoint - 1 - j);
                const mapY = this.height - 1 - 2 * (heightMidpoint - 1 - i);

                for (let k = 0; k < 2; ++k) {
                    for (let l = 0; l < 2; ++l) {
                        newRecent.pixels[(mapY - k) * this.width + mapX - l] = currPixel;
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
        this.setNewRecent(newRecent);
    }

    crop = (splitX, splitY, sectionX, sectionY) => {
        if (splitX < 1 || splitY < 1 || sectionX >= splitX || sectionY >= splitY) {
            return;
        }

        if (splitX === 2 && splitY === 2 && sectionX === 0 && sectionY === 0) {
            this.cropTopLeft();
            return;
        }

        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.cropped.splitX = splitX;
        newRecent.properties.cropped.splitY = splitY;
        newRecent.properties.cropped.sectionX = sectionX;
        newRecent.properties.cropped.sectionY = sectionY;
        const widthMidpoint = Math.floor(this.width / splitX);
        const heightMidpoint = Math.floor(this.height / splitY);
        const remainingWidth = this.width % splitX;
        const remainingHeight = this.height % splitY;

        let sectionPixels = [];
        for (let i = sectionY * heightMidpoint; i < (sectionY + 1) * heightMidpoint; ++i) {
            for (let j = sectionX * widthMidpoint; j < (sectionX + 1) * widthMidpoint; ++j) {
                sectionPixels.push(newRecent.pixels[i * this.width + j]);
            }
        }

        for (let i = 0; i < heightMidpoint; ++i) {
            for (let j = 0; j < widthMidpoint; ++j) {
                const currPixel = sectionPixels[i * widthMidpoint + j];

                for (let k = 0; k < splitY; ++k) {
                    for (let l = 0; l < splitX; ++l) {
                        newRecent.pixels[(k + i * splitY) * this.width + l + j * splitX] = currPixel;
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
        this.setNewRecent(newRecent);
    }


    duplicate = (splitX, splitY, sectionX, sectionY) => {
        if (splitX < 1 || splitY < 1 || sectionX >= splitX || sectionY >= splitY) {
            return;
        }

        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.duplicated.splitX = splitX;
        newRecent.properties.duplicated.splitY = splitY;
        newRecent.properties.duplicated.sectionX = sectionX;
        newRecent.properties.duplicated.sectionY = sectionY;
        const widthMidpoint = Math.floor(this.width / splitX);
        const heightMidpoint = Math.floor(this.height / splitY);
        const remainingWidth = this.width % splitX;
        const remainingHeight = this.height % splitY;

        for (let i = 0; i < heightMidpoint; ++i) {
            for (let j = 0; j < widthMidpoint; ++j) {
                const currPixel = newRecent.pixels[(i + sectionY * heightMidpoint) * this.width + j + sectionX * widthMidpoint];

                for (let k = 0; k < this.height - remainingHeight; k += heightMidpoint) {
                    for (let l = 0; l < this.width - remainingWidth; l += widthMidpoint) {
                        if (k !== sectionY * heightMidpoint || l !== sectionX * widthMidpoint) {
                            newRecent.pixels[(i + k) * this.width + j + l] = currPixel;
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
        this.setNewRecent(newRecent);
    }

    addBorders = (length, pixel, borders) => {
        if (length < 1 || borders.length === 0) {
            return;
        }

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
                this.cleanBorders(length, i, pixel, true);
            }
        }
    }

    cleanBorders = (remaining, direction, pixel, external) => {
        if (direction.length === 0) {
            return;
        }

        const simpleDirection = direction[0].toUpperCase();
        if (!(simpleDirection === 'T' || simpleDirection === 'B' || simpleDirection === 'L' || simpleDirection === 'R')) {
            return;
        }

        let newRecent = this.recent;
        if (external) {
            newRecent = this.makeNewRecent(this.recent);
            newRecent.properties.addedBorders[direction] = true;
            newRecent.properties.borderLength = remaining;
            newRecent.properties.pixel = pixel;
        }

        switch (simpleDirection) {
            case 'T':
                for (let i = 0; i < remaining; ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        newRecent.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            case 'B':
                for (let i = this.height - remaining; i < this.height; ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        newRecent.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            case 'L':
                for (let i = 0; i < this.height; ++i) {
                    for (let j = 0; j < remaining; ++j) {
                        newRecent.pixels[i * this.width + j] = pixel;
                    }
                }
                break;
            default:
                for (let i = 0; i < this.height; ++i) {
                    for (let j = this.width - remaining; j < this.width; ++j) {
                        newRecent.pixels[i * this.width + j] = pixel;
                    }
                }
        }

        if (external) {
            this.setNewRecent(newRecent);
        }
    }

    mirror = direction => {
        const simpleDirection = direction[0].toUpperCase();
        if (!(simpleDirection === 'T' || simpleDirection === 'B' || simpleDirection === 'L' || simpleDirection === 'R')) {
            return;
        }

        const newRecent = this.makeNewRecent(this.recent);
        newRecent.properties.mirror[direction] = true;
        switch (simpleDirection) {
            case 'T':
                for (let i = 0; i < Math.floor(this.height / 2); ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        newRecent.pixels[(this.height - 1 - i) * this.width + j] = newRecent.pixels[i * this.width + j];
                    }
                }
                break;
            case 'B':
                for (let i = 0; i < Math.floor(this.height / 2); ++i) {
                    for (let j = 0; j < this.width; ++j) {
                        newRecent.pixels[i * this.width + j] = newRecent.pixels[(this.height - 1 - i) * this.width + j];
                    }
                }
                break;
            case 'L':
                for (let i = 0; i < Math.floor(this.width / 2); ++i) {
                    for (let j = 0; j < this.height; ++j) {
                        newRecent.pixels[j * this.width + this.width - 1 - i] = newRecent.pixels[j * this.width + i];
                    }
                }
                break;
            default:
                for (let i = 0; i < Math.floor(this.width / 2); ++i) {
                    for (let j = 0; j < this.height; ++j) {
                        newRecent.pixels[j * this.width + i] = newRecent.pixels[j * this.width + this.width - 1 - i];
                    }
                }
        }
        this.setNewRecent(newRecent);
    }

    blur = (levelX, levelY) => {
        if (levelX < 1 || levelY < 1) {
            return;
        }

        const newRecent = this.makeNewRecent(this.recent);
        ++newRecent.properties.blurLevel;
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
                                sum[TYPES[m]] += newRecent.pixels[k * this.width + l][TYPES[m]];
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
                            newRecent.pixels[k * this.width + l] = average;
                        }
                    }
                }
            }
        }

        this.setNewRecent(newRecent);
    }

    reset = () => {
        if (this.canReset) {
            const newRecent = this.makeNewRecent(this.original);
            newRecent.next = this.recent;
            this.recent = newRecent;
            this.canReset = false;
            this.updateDisplay();
        }
    }

    undo = () => {
        if (this.canUndo) {
            this.recent = this.recent.next;
            this.canUndo = this.recent.next !== null;
            this.canReset = this.canUndo;
        }
    }
}