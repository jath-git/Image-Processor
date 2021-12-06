import { COLOURS_LIST, DIRECTIONS_LIST } from '../constants/Constants';
import { parseColourToPixel, parsePixelToColour } from '../utilities/default';

export default function Colour({ colour, colourRef, setCheckersChanged, pixel, checkersRef, setPixel }) {
    const changePixel = colourIndex => {
        const newColour = COLOURS_LIST[colourIndex];
        const newPixel = parseColourToPixel(newColour);

        if (pixel !== newPixel) {
            setPixel(newPixel);

            const indexOfColour = COLOURS_LIST.indexOf(newColour);
            colour.current.style.backgroundColor = parsePixelToColour(newPixel);

            for (let i = 0; i < COLOURS_LIST.length; ++i) {
                colourRef[COLOURS_LIST[i]].current.checked = false;
            }
            colourRef[COLOURS_LIST[Math.max(0, indexOfColour)]].current.checked = true;


            if (checkersRef.current.value !== '') {
                setCheckersChanged(false);
            }
        }
    }

    return (
        <div>
            <div className="option">
                <div className="colour" ref={colour}></div>
                <div className="text">Colour</div>
                <input type="radio" defaultChecked={true} ref={colourRef.black} onChange={() => {
                    changePixel(0);
                }} />
                <input type="radio" ref={colourRef.blue} onChange={() => {
                    changePixel(1);
                }} />
                <input type="radio" ref={colourRef.red} onChange={() => {
                    changePixel(2);
                }} />
                <input type="radio" ref={colourRef.white} onChange={() => {
                    changePixel(3);
                }} />
                <input type="radio" ref={colourRef.green} onChange={() => {
                    changePixel(4);
                }} />
                <input type="radio" ref={colourRef.purple} onChange={() => {
                    changePixel(5);
                }} />
                <input type="radio" ref={colourRef.orange} onChange={() => {
                    changePixel(6);
                }} />
                <input type="radio" ref={colourRef.yellow} onChange={() => {
                    changePixel(7);
                }} />
            </div>
        </div>
    )
}
