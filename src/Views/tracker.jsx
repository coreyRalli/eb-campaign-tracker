import { useReducer, useEffect, useRef } from "react";
import { CAMPAIGNS, generateDefaultNotes } from "../data";
import reducer, { initialState } from "../reducer/reducer";
import { HYDRATE } from '../reducer/actions';
import DayHeader from "../components/DayHeader";
import Rangers from "../components/Rangers";
import Events from "../components/Events";
import Missions from "../components/Missions";
import Rewards from "../components/Rewards";
import Options from "../components/Options";

import db from '../database/db';
import { useLiveQuery } from "dexie-react-hooks";

const Tracker = ({ id }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const campaign = useLiveQuery(async () => {
        const campaign = await db.campaigns.where('id').equals(id).first();

        const note = await db.notes.where('[campaignId+day]').equals([id, campaign.day]).first();

        return {
            ...campaign,
            note
        }
    }, [])

    useEffect(() => {
        const campaignState = localStorage.getItem("campaign-state");
        if (campaignState) {
            const data = JSON.parse(campaignState);

            // Updates while developing, remove at some point
            if (!data.notes)
                data.notes = generateDefaultNotes();

            if (!data.campaign)
                data.campaign = CAMPAIGNS[0];

            if (data.missions.length > 0 && (typeof data.missions[0].complete === "undefined"))
                data.missions = data.missions.map((m) => ({ ...m, complete: false }));

            dispatch(HYDRATE(data));
        }
    }, [])

    useEffect(() => {
        if (state !== initialState)
            localStorage.setItem("campaign-state", JSON.stringify(state));
    }, [state]);

    if (!campaign)
        return null;

    return (
        <>
            <DayHeader 
                campaign={campaign} 
                id={id} />

            <main className="tracker-content">
                <Rangers id={id} />

                <Events id={id} />

                <Missions
                    campaign={campaign}
                    state={state}
                    dispatch={dispatch} />

                <Rewards id={id} />

                <Options
                    id={id}
                    state={state}
                    dispatch={dispatch} />

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