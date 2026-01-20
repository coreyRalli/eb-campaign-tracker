import React, { useState } from "react";
import Tracker from "./Views/tracker";
import { createOrFetchInitalData, importFromLocalStorage } from "./database/db";

export const AppContext = React.createContext({ campaignId: -1 });

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
    <AppContext.Provider value={{campaignId, setCampaignId}}>
      {
        (campaignId !== -1) &&
        <Tracker />
      }
    </AppContext.Provider>
  )
}

export default App
