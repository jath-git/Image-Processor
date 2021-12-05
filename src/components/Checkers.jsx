import React from 'react';
import { setPreviousInput, getValidNumber, makeNaturalNumber } from '../utilities/default';

export default function Checkers({ canvasObj, pixel, updateAbilities, setCheckersChanged, checkersRef, checkersChanged }) {
    const changeCheckers = () => {
        if (!checkersChanged) {
            const number = getValidNumber(checkersRef.current.value, 1, Math.max(canvasObj.width, canvasObj.height));

            if (number !== null) {
                canvasObj.checkers(pixel, number);
                updateAbilities();
            }
            setCheckersChanged(true);
        }
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Checkers
                </div>
                <input type="text" placeholder="Enter Spacing of Pixels" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={checkersRef} onKeyDown={e => {
                    if (e.code === 'Enter') {
                        changeCheckers();
                    }
                }} onChange={e => {
                    e.target.value = makeNaturalNumber(e.target.value);
                    setCheckersChanged(!canvasObj || getValidNumber(e.target.value, 1, Math.max(canvasObj.width, canvasObj.height)) === null || parseInt(e.target.value) === canvasObj.recent.properties.checkersSpacing);
                }} />
                <button className={checkersChanged ? "submit checkers inactive" : "submit checkers active"} onClick={() => {
                    changeCheckers();
                }}>Confirm
                </button>
            </div>
        </div>
    )
}
