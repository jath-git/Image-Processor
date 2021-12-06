import React from 'react';
import { getOppositeDirection } from '../utilities/default';

export default function Mirror({ canvasObj, updateAbilities, mirrorRef }) {
    const changeMirror = (value) => {
        canvasObj.mirror(value);
        const oppositeValue = getOppositeDirection(value);
        canvasObj.recent.properties.mirror[oppositeValue] = true;
        mirrorRef[oppositeValue].current.checked = true;
        updateAbilities();
    }
    return (
        <div>
            <div className="option">
                <div className="title">
                    Mirror
                </div>
                <div className="checklist">
                    <input type="radio" ref={mirrorRef.T} onChange={() => {
                        changeMirror('T');
                    }} />
                    <div className="text right">
                        Top Half
                    </div>
                </div>
                <div className="checklist">
                    <input type="radio" ref={mirrorRef.B} onChange={() => {
                        changeMirror('B');
                    }
                    } />
                    <div className="text right">
                        Bottom Half
                    </div>
                </div>
                <div className="checklist">
                    <input type="radio" ref={mirrorRef.L} onChange={() => {
                        changeMirror('L');
                    }
                    } />
                    <div className="text right">
                        Left Half
                    </div>
                </div>
                <div className="checklist">
                    <input type="radio" ref={mirrorRef.R} onChange={() => {
                        changeMirror('R');
                    }
                    } />
                    <div className="text right">
                        Right Half
                    </div>
                </div>
            </div>
        </div>
    )
}
