import { WHITE_COLOUR } from '../Constants.js';
import Canvas from './Canvas';

export default class ModifiedCanvas extends Canvas {
    constructor(_context, _width, _height, _reference) {
        super(_context, _width, _height);
        this.copyProperties(_reference.properties);
        this.pixels = this.parseReferenceToPixels(_reference.pixels);
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
}