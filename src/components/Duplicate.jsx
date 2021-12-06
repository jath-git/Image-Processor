import React from 'react';
import { setPreviousInput, makeNaturalNumber, makeWholeNumber, checkAllSections, changeSections } from '../utilities/default';

export default function Duplicate({ canvasObj, duplicateRef, setDuplicateChanged, duplicateChanged, updateAbilities }) {
    const changeDuplicate = () => {
        if (!duplicateChanged && changeSections(canvasObj, 'duplicate', duplicateRef)) {
            updateAbilities();
        }
    }

    return (
        <div>
            <div className="option">
                <div className="title">
                    Duplicate
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Horizontal Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateRef.splitX} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeDuplicate();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeNaturalNumber(value);

                        setDuplicateChanged(checkAllSections(canvasObj, duplicateRef, 'duplicated'));
                    }} />
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Vertical Split" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateRef.splitY} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeDuplicate();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeNaturalNumber(value);

                        setDuplicateChanged(checkAllSections(canvasObj, duplicateRef, 'duplicated'));
                    }} />
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Horizontal Section" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateRef.sectionX} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeDuplicate();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeWholeNumber(value);

                        setDuplicateChanged(checkAllSections(canvasObj, duplicateRef, 'duplicated'));
                    }} />
                </div>
                <div className="checklist">
                    <input className="fit" type="text" placeholder="Enter Vertical Section" onPaste={setPreviousInput} onDrop={setPreviousInput} ref={duplicateRef.sectionY} onKeyDown={e => {
                        if (e.code === 'Enter') {
                            changeDuplicate();
                        }
                    }} onChange={e => {
                        const value = e.target.value;
                        e.target.value = makeWholeNumber(value);

                        setDuplicateChanged(checkAllSections(canvasObj, duplicateRef, 'duplicated'));
                    }} />
                </div>
                <button className={duplicateChanged ? "submit inactive" : "submit active"} onClick={() => {
                    changeDuplicate();
                }}>Confirm
                </button>
            </div>
        </div>
    )
}
