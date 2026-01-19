import { useState } from "react";
import Tracker from "./Views/tracker";
import db from "./database/db";

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

      const newCampaign = await db.campaigns.add({ day: 1 });
      setCampaignId(newCampaign.id);
    }

    loadCampaign()
      .catch(ex => console.log(ex));
  }, [])

  return (
    <>
      {campaignId !== -1} &&
      <Tracker id={campaignId}/>
    </>
  )
}

export default App
