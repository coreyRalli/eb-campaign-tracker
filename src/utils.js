export const handleExportFile = async (id) => {
    const campaign = localStorage.getItem(id);

    const blob = new Blob([campaign], { type: "plain/text" });

    const handle = await showSaveFilePicker({
        suggestedName: `${id}`,
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