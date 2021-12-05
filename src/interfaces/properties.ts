import pixel from './pixel'

export default interface properties {
    brightnessLevel: number,
    blurLevel: number,
    checkersSpacing: number,
    isInverted: boolean,
    isFlipped: {
        [key: string]: boolean,
        // H: boolean,
        // V: boolean
    },
    addedBorders: {
        [key: string]: boolean,
        // T: boolean,
        // B: boolean,
        // L: boolean,
        // R: boolean
    },
    mirror: {
        [key: string]: boolean,
        // T: boolean,
        // B: boolean,
        // L: boolean,
        // R: boolean
    },
    borderLength: number,
    cropped: {
        [key: string]: number,
        // splitX: number,
        // splitY: number,
        // sectionX: number,
        // sectionY: number
    },
    duplicated: {
        [key: string]: number,
        // splitX: number,
        // splitY: number,
        // sectionX: number,
        // sectionY: number
    },
    grayscaled: boolean,
    pixel: pixel
}