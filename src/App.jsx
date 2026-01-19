import { useState } from "react";
import Tracker from "./Views/tracker";
import db from "./database/db";
import { CAMPAIGNS, defaultCampaign, generateDefaultNotes } from "./data";

function App() {
  const [campaignId, setCampaignId] = useState(-1);

  useState(() => {
    // Create a default campaign if none exists
    const loadCampaign = async () => {
      const campaigns = await db.campaigns.toArray();

      if (campaigns.length > 0) {
        setCampaignId(campaigns[0].id);
        return;
      }

      const newCampaign = await db.campaigns.add(defaultCampaign);

      // Create Notes
      await db.notes.bulkAdd(generateDefaultNotes(CAMPAIGNS[0]).map(n => ({ ...n, campaignId: newCampaign })));

      // TODO: Add logic for importing localstate to db

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
