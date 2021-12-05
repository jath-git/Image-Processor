import React from 'react';

export default function Flip({ canvasObj, updateAbilities, flipRef }) {
    const changeFlip = (value) => {
        canvasObj.flip(value);
        updateAbilities();
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Flip
                </div>
                <div className="checklist">
                    <input className="flip" type="checkbox" ref={flipRef.H} onChange={() => {
                        changeFlip('H');
                    }} />
                    <div className="text">
                        Horizontal
                    </div>
                </div>
                <div className="checklist">
                    <input className="flip" type="checkbox" ref={flipRef.V} onChange={() => {
                        changeFlip('V');
                    }} />
                    <div className="text">
                        Vertical
                    </div>
                </div>
            </div>
        </div>
    )
}
