import React from 'react';

export default function Blur({ blurRef, canvasObj, updateAbilities }) {
    const changeBlur = value => {
        const newValue = parseInt(value) + 1;
        canvasObj.blur(newValue, newValue);
        blurRef.current.value = newValue;
        updateAbilities();
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Blur
                </div>
                <input className="blur" type="text" readOnly ref={blurRef} defaultValue={1} />
                <img className="blur-add" src="assets/images/add.png" alt="blur-add" onClick={() => {
                    changeBlur(blurRef.current.value)
                }} />
            </div>
        </div>
    )
}
