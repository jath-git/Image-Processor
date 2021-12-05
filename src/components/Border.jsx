import React from 'react';
import { setPreviousInput, makeWholeNumber, getValidNumber, setAllBorders } from '../utilities/default';

export default function Border({ canvasObj, pixel, borderRef, updateAbilities, borderLength }) {
    const changeBorder = borders => {
        const number = getValidNumber(borderLength.current.value, 1, Math.max(canvasObj.width, canvasObj.height));
        if (number !== null) {
            canvasObj.addBorders(number, pixel, [borders]);
            borders === 'A' ?
                setAllBorders(borderRef, true) :
                borderRef[borders].current.checked = true;
            updateAbilities();
        } else {
            borderRef[borders].current.checked = false;
        }
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Border
                </div>
                <input type="text" placeholder="Enter Thickness of Pixels" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={borderLength} onKeyDown={e => {
                    if (e.code === 'Enter') {
                        changeBorder('A');
                    }
                }} onChange={e => {
                    const value = e.target.value;
                    e.target.value = makeWholeNumber(value);

                    setAllBorders(borderRef, false);
                }} />
                <div className="checklist">
                    <input type="radio" ref={borderRef.T} onChange={() => {
                        changeBorder('T');
                    }} />
                    <div className="text right">
                        Top
                    </div>
                </div>
                <div className="checklist">
                    <input type="radio" ref={borderRef.B} onChange={() => {
                        changeBorder('B');
                    }} />
                    <div className="text right">
                        Bottom
                    </div>
                </div>
                <div className="checklist">
                    <input type="radio" ref={borderRef.L} onChange={() => {
                        changeBorder('L');
                    }
                    } />
                    <div className="text right">
                        Left
                    </div>
                </div>
                <div className="checklist">
                    <input type="radio" ref={borderRef.R} onChange={() => {
                        changeBorder('R');
                    }
                    } />
                    <div className="text right">
                        Right
                    </div>
                </div>
            </div>
        </div>
    )
}
