import { useReducer, useEffect, useRef } from "react";
import { CAMPAIGNS, generateDefaultNotes} from "../data";
import reducer, { initialState } from "../reducer/reducer";
import { HYDRATE } from '../reducer/actions';
import DayHeader from "../components/DayHeader";
import Rangers from "../components/Rangers";
import Events from "../components/Events";
import Missions from "../components/Missions";
import Rewards from "../components/Rewards";
import Options from "../components/Options";

const Tracker = ({ id }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

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

    return (
        <>
            <DayHeader 
                state={state} 
                dispatch={dispatch}/>

            <main className="tracker-content">
                <Rangers 
                    state={state} 
                    dispatch={dispatch}/>

                <Events 
                    state={state} 
                    dispatch={dispatch}/>

                <Missions 
                    state={state} 
                    dispatch={dispatch}/>

                <Rewards 
                    state={state} 
                    dispatch={dispatch} />

                <Options 
                    state={state}
                    dispatch={dispatch}/>

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