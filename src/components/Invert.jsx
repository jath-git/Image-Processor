export default function Invert({ canvasObj, invertRef, brightnessRef, updateAbilities }) {
    const changeInvert = () => {
        canvasObj.invert();
        updateAbilities();

        if (canvasObj.recent.properties.brightnessLevel !== 0) {
            canvasObj.recent.properties.brightnessLevel *= -1;
            brightnessRef.current.value = canvasObj.recent.properties.brightnessLevel;
        }
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
