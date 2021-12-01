import { WHITE_COLOUR } from '../Constants';
import properties from '../interfaces/properties';
import pixel from '../interfaces/pixel';
import Canvas from './Canvas';

export default class ModifiedCanvas extends Canvas {
    constructor(_context: CanvasRenderingContext2D, _width: number, _height: number, _reference: Canvas) {
        super(_context, _width, _height);
        this.copyProperties(_reference.properties);
        this.pixels = this.parseReferenceToPixels(_reference.pixels);
    }

    copyProperties = (prevProperties: properties): void => {
        this.properties = this.recurseProperties(prevProperties);
    }

    recurseProperties = (obj: any): any => {
        let retval: any = {};
        for (let i in obj) {
            retval[i] = typeof (obj[i]) === 'object' ? this.recurseProperties(obj[i]) : obj[i];
        }
        return retval;
    }

    parseReferenceToPixels = (prevPixels: pixel[]) => {
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
}