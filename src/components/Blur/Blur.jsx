import React, { useState, useEffect } from 'react'
import './Blur.scss';

export default function Blur({ canvasObj }) {
    let [blurLevel, setBlurLevel] = useState(1);

    useEffect(() => {
        canvasObj.reset();
        canvasObj.blur(blurLevel, blurLevel);
        canvasObj.updateDisplay();
    }, [blurLevel]);

    if (!canvasObj) {
        return (null);
    }

    return (
        <div id="blur">
            <div id="arrow-container"><img src="assets/images/arrow.png" alt="arrow" /></div>
            <div id="modify"><input type="range" min="1" max="9" id="slider" value={blurLevel} />
                <input id="blur-level" type="text" defaultValue={blurLevel} value={blurLevel} onChange={e => {
                    const newBlur = e.target.value.substring(1);
                    if (newBlur.length === 1 && newBlur >= '1' && newBlur <= '9') {
                        setBlurLevel(parseInt(newBlur));
                    }
                }} />
            </div>
            <div id="title">Blur</div>
        </div>
    )
}