import { useRef } from "react";
import { HYDRATE } from "../reducer/actions";

const Options = ({ state, dispatch }) => {
    const importBtnRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            const text = reader.result;
            const obj = JSON.parse(text);

            dispatch(HYDRATE(obj));
        })

        if (file) {
            reader.readAsText(file);
        }
    }

    const handleImportClick = () => {
        importBtnRef.current.click();
    }

    const handleExportFile = async () => {
        const campaign = localStorage.getItem("campaign-state");

        const blob = new Blob([campaign], { type: "plain/text" });

        const handle = await showSaveFilePicker({
            suggestedName: `earthborne-rangers-campaign`,
            types: [
                {
                    description: "Exported Earthborne Rangers Campaign",
                    accept: {
                        "text/plain": [".txt"],
                        "application/json": [".json"]
                    }
                }
            ]
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
    }

    return (
        <section className="section options">
            <h2>Options</h2>

            <button
                onClick={handleExportFile}
                className="textless-btn fake-textless-btn">
                SAVE CAMPAIGN
            </button>

            <button
                onClick={handleImportClick}
                className="textless-btn fake-textless-btn">
                IMPORT CAMPAIGN
            </button>

            <div className="import-campaign-container">
                <label
                    className="textless-btn"
                    htmlFor="import-campaign">IMPORT CAMPAIGN</label>
                <input
                    ref={importBtnRef}
                    onChange={handleFileChange}
                    id="import-campaign"
                    accept=".txt, .json"
                    type="file" />
            </div>
        </section>
    )
}

export default Options;