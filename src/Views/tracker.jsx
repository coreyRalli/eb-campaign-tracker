import { useContext } from "react";
import DayHeader from "../components/DayHeader";
import Rangers from "../components/Rangers";
import Events from "../components/Events";
import Missions from "../components/Missions";
import Rewards from "../components/Rewards";
import Options from "../components/Options";

import db from '../database/db';
import { useLiveQuery } from "dexie-react-hooks";
import { AppContext } from "../App";

const Tracker = () => {
    const { campaignId } = useContext(AppContext);

    const campaign = useLiveQuery(async () => {
        const campaign = await db.campaigns.where('id').equals(campaignId).first();

        const note = await db.notes.where('[campaignId+day]').equals([campaignId, campaign.day]).first();

        return {
            ...campaign,
            note
        }
    }, [campaignId])

    if (!campaign)
        return null;

    return (
        <>
            <DayHeader />

            <main className="tracker-content">
                <Rangers />

                <Events />  

                <Missions campaign={campaign} />

                <Rewards />

                <Options campaign={campaign} />

                <p>
                    A digital campaign tracker for Earthborne Rangers I quickly cobbled together. It's recomended you save your campaign regularly just in case your browser deletes local storage or if you want to swap between multiple campaigns (I might add a campaign select page later).
                    Works best in a Chromium-based browser.
                </p>

                <p>I am in no way connected with Earthborne Games, I just think the game is neat.</p>
                <p>- <a href="https://github.com/coreyRalli">Corey Ralli</a></p>
            </main>
        </>
    )
}

export default Tracker;