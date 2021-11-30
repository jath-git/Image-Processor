import React, { useState, useRef } from 'react'
import { setPreviousInput, getValidNumber } from '../../utilities/default';

export default function Brightness({ brightness, initialBrightnessLevel, setUpdate }) {
    let [brightnessChanged, setBrightnessChanged] = useState(false);
    let [brightnessLevel, setBrightnessLevel] = useState(0);
    let inputBrightnessLevel = useRef(null);

    const changeBrightness = () => {
        const value = inputBrightnessLevel.current.value;
        const number = getValidNumber(value, -25, 25);
        if (number === null || number === initialBrightnessLevel) {
            return;
        }

        brightness(number);
        setBrightnessLevel(number);
        setBrightnessChanged(true);
        setUpdate(true);
    }

    return (
        <div className="option">
            <div className="title">
                Brightness
            </div>
            <input type="text" placeholder="Enter Value from -25 to 25" defaultValue={initialBrightnessLevel} onPaste={setPreviousInput} onDrop={setPreviousInput} ref={inputBrightnessLevel} onKeyDown={e => {
                if (e.code === 'Enter') {
                    changeBrightness();
                }
            }} onChange={e => {
                const value = e.target.value;
                if (value === '') {
                    setBrightnessChanged(false);
                    return;
                }

                for (let i = 0; i < value.length; ++i) {
                    if (!((value[i] >= '0' && value[i] <= '9') || value[i] === '-') || (value[i] === '-' && i !== 0) || (value[i] === '0' && value.length !== 1 && (i === 0 || (i === 1 && value[0] === '-')))) {
                        e.target.value = value.substring(0, i) + value.substring(i + 1);
                        break;
                    }
                }

                setBrightnessChanged(parseInt(value) === brightnessLevel);
            }} />
            <button className={brightnessChanged ? "submit brightness inactive" : "submit brightness active"} onClick={changeBrightness}>Confirm
            </button>
        </div>
    )
}
