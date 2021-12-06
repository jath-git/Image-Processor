import React from 'react';

export default function Grayscale({ grayRef, canvasObj, updateAbilities }) {
    const changeGrayscale = () => {
        if (grayRef.current.checked) {
            canvasObj.grayscale();
            grayRef.current.checked = true;
            updateAbilities();
        }
    }

    return (
        <div>
            <div className="option">
                <div className="checklist" onClick={() => {
                    changeGrayscale();
                }}>
                    <input className="grayscale" type="radio" ref={grayRef} />
                    <div className="text">
                        Grayscale
                    </div>
                </div>
            </div>
        </div>
    )
}
