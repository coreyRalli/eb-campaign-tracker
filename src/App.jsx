import { useState } from "react";
import Tracker from "./Views/tracker";
import db, { createOrFetchInitalData, importFromLocalStorage } from "./database/db";
import { CAMPAIGNS, defaultCampaign, generateDefaultNotes } from "./data";

function App() {
  const [campaignId, setCampaignId] = useState(-1);

  useState(() => {
    // Create a default campaign if none exists
    const loadCampaign = async () => {
      const localState = localStorage.getItem("campaign-state");
      if (localState) {
        const id = await importFromLocalStorage(localState);
        setCampaignId(id);
        return;
      }

      const newCampaign = await createOrFetchInitalData();

      setCampaignId(newCampaign);
    }

    loadCampaign()
      .catch(ex => console.log(ex));
  }, [])

  return (
    <>
      {
        (campaignId !== -1) &&
        <Tracker id={campaignId} />
      }
    </>
  )
}

export default App
