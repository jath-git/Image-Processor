import React from 'react';
import { getValidNumber, setPreviousInput, makeInteger } from '../utilities/default';

export default function Brightness({ canvasObj, brightnessChanged, brightnessRef, setBrightnessChanged, updateAbilities }) {
    const changeBrightness = value => {
        if (!brightnessChanged) {
            canvasObj.brightness(parseInt(value));
            setBrightnessChanged(true);
            updateAbilities();
        }
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Brightness
                </div>
                <input type="text" placeholder="Enter Value from -25 to 25" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={brightnessRef} onKeyDown={e => {
                    if (e.code === 'Enter') {
                        changeBrightness(brightnessRef.current.value);
                    }
                }} onChange={e => {
                    e.target.value = makeInteger(e.target.value);
                    setBrightnessChanged(!canvasObj || getValidNumber(e.target.value, -25, 25) === null || parseInt(e.target.value) === canvasObj.recent.properties.brightnessLevel);
                }} />
                <button className={brightnessChanged ? "submit brightness inactive" : "submit brightness active"} onClick={() => {
                    changeBrightness(brightnessRef.current.value);
                }}>Confirm
                </button>
            </div>
        </div>
    )
}
