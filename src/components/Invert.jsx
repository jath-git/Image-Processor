import React from 'react';

export default function Invert({ canvasObj, invertRef, updateAbilities }) {
    const changeInvert = () => {
        canvasObj.invert();
        updateAbilities();
    }

    return (
        <div>
            <div className="option">
                <div className="checklist" onClick={() => {
                    changeInvert();
                }}>
                    <input className="invert" type="checkbox" ref={invertRef} />
                    <div className="text" onClick={() => {
                        invertRef.current.checked = !invertRef.current.checked;
                    }}>
                        Invert
                    </div>
                </div>
            </div>
        </div>
    )
}
