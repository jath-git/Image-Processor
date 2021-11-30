import React, { useState } from 'react'

export default function Invert({ canvasObj, setUpdate, undoClicked }) {
    let [invertChecked, setInvertChecked] = useState(canvasObj.recent.properties.isInverted);

    
    
    return (
        <div className="option">
            <div className="title">
                Invert
            </div>
            <input type="checkbox" checked={invertChecked} onChange={() => {
                canvasObj.invert();
                setUpdate(true);
                setInvertChecked(!invertChecked);
            }} />
        </div>
    )
}
