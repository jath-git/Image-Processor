import React from 'react';

export default function Mirror({ canvasObj, updateAbilities, mirrorRef }) {
    const changeMirror = (value) => {
        canvasObj.mirror(value);
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
