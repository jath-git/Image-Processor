import pixel from './pixel'

export default interface properties {
    brightnessLevel: number | '',
    blurLevel: number,
    checkersSpacing: number | '',
    isInverted: boolean,
    isFlipped: {
        horizontal: boolean,
        vertical: boolean
    },
    addedBorders: {
        [key: string]: boolean,
        // 'T': boolean,
        // 'B': boolean,
        // 'L': boolean,
        // 'R': boolean
    },
    mirror: {
        [key: string]: boolean,
        // T: boolean,
        // B: boolean,
        // L: boolean,
        // R: boolean
    },
    borderLength: number | '',
    cropped: {
        splitX: number | '',
        splitY: number | '',
        sectionX: number | '',
        sectionY: number | ''
    },
    duplicated: {
        splitX: number | '',
        splitY: number | '',
        sectionX: number | '',
        sectionY: number | ''
    },
    grayscaled: boolean,
    pixel: pixel
}