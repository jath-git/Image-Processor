import React from 'react';
import { setPreviousInput, checkAllSections, makeWholeNumber, makeNaturalNumber, changeSections } from '../utilities/default';

export default function Crop({ canvasObj, cropRef, updateAbilities, setCropChanged, cropChanged }) {
    const changeCrop = () => {
        if (!cropChanged && changeSections(canvasObj, 'crop', cropRef)) {
            updateAbilities();
            setCropChanged(true);
        }
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Crop
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Horizontal Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropRef.splitX} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeCrop();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeNaturalNumber(value);

                        setCropChanged(checkAllSections(canvasObj, cropRef, 'cropped'));
                    }} />
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Vertical Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropRef.splitY} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeCrop();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeNaturalNumber(value);

                        setCropChanged(checkAllSections(canvasObj, cropRef, 'cropped'));
                    }} />
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Horizontal Index" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropRef.sectionX} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeCrop();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeWholeNumber(value);

                        setCropChanged(checkAllSections(canvasObj, cropRef, 'cropped'));
                    }} />
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Vertical Section" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={cropRef.sectionY} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeCrop();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeWholeNumber(value);

                        setCropChanged(checkAllSections(canvasObj, cropRef, 'cropped'));
                    }} />
                </div>
                <button className={cropChanged ? "submit inactive" : "submit active"} onClick={() => {
                    changeCrop();
                }}>Confirm
                </button>
            </div>
        </div>
    )
}
