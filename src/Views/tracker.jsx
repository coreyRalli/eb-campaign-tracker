import { useReducer, useState, useEffect } from "react";
import { CAMPAIGNS, generateArcologyWeather, generateDefaultNotes, generateWeather, LOCATIONS, LOCATIONS_LOTA, PATHS, PATHS_LOTA } from "../data";
import reducer, { initialState } from "../reducer/reducer";
import { INCREMENT_DAY, DECREMENT_DAY, CHANGE_LOCATION, CHANGE_TERRIAN, REMOVE_EVENT, ADD_EVENT, ADD_REWARDS, REMOVE_REWARDS, ADD_MISSION, REMOVE_MISSION, DECREMENT_MISSION_PROGRESS, INCREMENT_MISSION_PROGRESS, REMOVE_RANGER, ADD_RANGER, HYDRATE, UPDATE_EVENT, UPDATE_MISSION, UPDATE_REWARDS, UPDATE_NOTE, UPDATE_CAMPAIGN } from '../reducer/actions';
import Select from "../components/Select";
import ItemInput from "../components/iteminput";
import LineItem from "../components/LineItem";

const Tracker = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [newEventText, setNewEventText] = useState("");
    const [newRewardText, setNewRewardText] = useState("");
    const [newMissionText, setNewMissionText] = useState("");
    const [newRangerText, setNewRangerText] = useState("");

    const [eventsEditOn, setEventsEditOn] = useState(false);
    const [missionsEditOn, setMissionsEditOn] = useState(false);
    const [rewardsEditOn, setRewardsEditOn] = useState(false);

    const [progressChecked, setProgressChecked] = useState(true);

    const [showRangerEdit, setShowRangerEdit] = useState(false);
    const [showCampaignEdit, setShowCampaignEdit] = useState(false);
    const [tempCampaign, setTempCampaign] = useState(CAMPAIGNS[0]);

    useEffect(() => {
        const campaignState = localStorage.getItem("campaign-state");
        if (campaignState) {
            const data = JSON.parse(campaignState);

            if (!data.notes)
                data.notes = generateDefaultNotes();

            if (!data.campaign)
                data.campaign = CAMPAIGNS[0];

            dispatch({ type: 'hydrate', payload: { data } });
        }
    }, [])

    useEffect(() => {
        if (state !== initialState)
            localStorage.setItem("campaign-state", JSON.stringify(state));
    }, [state]);

    const onNewEventSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_EVENT(newEventText));
        setNewEventText("");
    }

    const onNewRangerSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_RANGER(newRangerText));
        setNewRangerText("");
    }

    const onNewRewardSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_REWARDS(newRewardText));
        setNewRewardText("");
    }

    const onNewMissionSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_MISSION(newMissionText, progressChecked ? 0 : -1));
        setNewMissionText("");
    }

    const handleSetNewCampaignClick = () => {
        dispatch(UPDATE_CAMPAIGN(tempCampaign));
        setShowCampaignEdit(false);
    }

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

    const maxDayDisabled = () => {
        if (state.campaign === CAMPAIGNS[0])
            return (state.day >= 45);
        
        return (state.day >= 30);
    }

    return (
        <>
            <div className="header">
                <h1>Campaign Tracker </h1>

                {
                    (showCampaignEdit) ?
                        <>
                            <Select
                                label={"Campaign Type"}
                                options={CAMPAIGNS}
                                value={tempCampaign}
                                id={"campaign-select"}
                                onChange={(value) => setTempCampaign(value)}
                                excludeEmptyOption />
                            <button
                                onClick={handleSetNewCampaignClick}
                                className="textless-btn">
                                FINISH
                            </button>
                        </> :
                        <p>
                            {state.campaign}
                            <button
                                onClick={() => setShowCampaignEdit(true)}
                                className="textless-btn">
                                CHANGE
                            </button>
                        </p>
                }

                <p>DAY</p>
                <div className="day-selector-container">
                    <button
                        onClick={() => dispatch(DECREMENT_DAY())}
                        disabled={state.day <= 1}>
                        <span className="material-symbols-outlined">arrow_left</span>
                    </button>
                    <p>{state.day}</p>
                    <button
                        onClick={() => dispatch(INCREMENT_DAY())}
                        disabled={maxDayDisabled()}>
                        <span className="material-symbols-outlined">arrow_right</span>
                    </button>
                </div>
                <div className="weather-report">
                    <p>{(state.campaign === CAMPAIGNS[1]) ? "(Valley)" : ""} {generateWeather(state.day, state.campaign)}</p>

                    {
                        (state.campaign === CAMPAIGNS[1]) &&
                        <p>(Arcology) {generateArcologyWeather(state.day)}</p>
                    }
                </div>

                <Select
                    options={(state.campaign === CAMPAIGNS[1]) ? LOCATIONS_LOTA : LOCATIONS}
                    value={state.location}
                    id={"location-select"}
                    onChange={(value) => dispatch(CHANGE_LOCATION(value))}
                    label={"Location"}
                    initOptionText={"Select a location"} />

                <Select
                    options={(state.campaign === CAMPAIGNS[1]) ? PATHS_LOTA : PATHS}
                    value={state.terrain}
                    id={"terrain-select"}
                    onChange={(value) => dispatch(CHANGE_TERRIAN(value))}
                    label={"Path Terrain"}
                    initOptionText={"Select a terrain"} />

                <div className="daily-notes-container">
                    <label htmlFor="daily-note">Daily Note</label>
                    <input
                        value={state.notes[state.day - 1].note}
                        onChange={({ target }) => dispatch(UPDATE_NOTE(target.value))}
                        id="daily-note"
                        type="text"
                        placeholder={"Campaign Guide, Ranger Report Modifiers Etc."} />
                </div>
            </div>

            <div className="tracker-content">
                <div className="section">
                    <div>
                        <h2>Rangers</h2>
                    </div>

                    {
                        !showRangerEdit ?
                            <p>
                                {(state.rangers.length > 0) ? state.rangers.map(r => r.name).join(", ") : "No Rangers Added"}
                                <button
                                    onClick={(e) => setShowRangerEdit(true)}
                                    className="textless-btn">
                                    EDIT
                                </button>
                            </p> :
                            <>
                                <ItemInput
                                    id={"new-ranger"}
                                    text={newRangerText}
                                    placeholder={"eg. Bob"}
                                    onSubmit={onNewRangerSubmit}
                                    onChange={(value) => setNewRangerText(value)} />

                                <ul className="list">
                                    {
                                        state.rangers.map(ranger =>
                                            <LineItem
                                                text={ranger.name}
                                                key={ranger.id}
                                                onDelete={() => dispatch(REMOVE_RANGER(ranger.id))} />)
                                    }
                                </ul>

                                <button className="textless-btn" onClick={(e) => setShowRangerEdit(false)}>
                                    FINISH
                                </button>
                            </>
                    }
                </div>

                <div className="section">
                    <div>
                        <h2>Notable Events</h2>
                    </div>

                    <ItemInput
                        id={"new-notable-event"}
                        text={newEventText}
                        placeholder={"eg. Impressed Calypsa"}
                        onSubmit={onNewEventSubmit}
                        onChange={(value) => setNewEventText(value)} />

                    <div>
                        {
                            (state.events.length > 0) &&
                            <button
                                className="textless-btn item-edit-btn"
                                onClick={() => setEventsEditOn(prev => !prev)}>
                                {eventsEditOn ? "FINISH" : "MODIFY"}
                            </button>
                        }
                    </div>

                    <ul className="list">
                        {
                            state.events.map(event =>
                                <LineItem
                                    onTextUpdate={(text) => dispatch(UPDATE_EVENT(event.id, text))}
                                    displayEdit={eventsEditOn}
                                    text={event.name}
                                    key={event.id}
                                    onDelete={() => dispatch(REMOVE_EVENT(event.id))} />)
                        }
                    </ul>
                </div>

                <div className="section">
                    <div>
                        <h2>Missions</h2>
                    </div>

                    <ItemInput
                        id={"new-mission-form"}
                        text={newMissionText}
                        onSubmit={onNewMissionSubmit}
                        onChange={(value) => setNewMissionText(value)}
                        placeholder={"Eg. Biscuit Delivery"}>
                    </ItemInput>

                    <div>
                        <input
                            id="no-progress-indicator"
                            checked={progressChecked}
                            onChange={({ target }) => setProgressChecked(target.checked)}
                            type="checkbox" />
                        <label htmlFor="no-progress-indicator">Include Progress Markers</label>
                    </div>

                    <div className="edit-list-btn-container">
                        {
                            (state.missions.length > 0) &&
                            <button
                                className="textless-btn item-edit-btn"
                                onClick={() => setMissionsEditOn(prev => !prev)}>
                                {missionsEditOn ? "FINISH" : "MODIFY"}
                            </button>
                        }
                    </div>

                    <ul className="list">
                        {
                            state.missions.map(mission =>
                                <LineItem
                                    onTextUpdate={(text) => dispatch(UPDATE_MISSION(mission.id, text))}
                                    text={mission.name}
                                    key={mission.id}
                                    displayEdit={missionsEditOn}
                                    onDelete={() => dispatch(REMOVE_MISSION(mission.id))}>
                                    {/* Mission markers */}
                                    <>
                                        <p className="mission-day">Day {mission.day}</p>
                                        {
                                            (mission.progress !== -1) &&
                                            <div className="mission-progress-container">
                                                <button
                                                    disabled={(mission.progress <= 0)}
                                                    onClick={(e) => dispatch(DECREMENT_MISSION_PROGRESS(mission.id))}>
                                                    <span className="material-symbols-outlined">
                                                        remove
                                                    </span>
                                                </button>

                                                <div className={`mission-progress ${mission.progress === 1 ? "active" : ""}`}></div>
                                                <div className={`mission-progress ${mission.progress === 2 ? "active" : ""}`}></div>
                                                <div className={`mission-progress ${mission.progress === 3 ? "active" : ""}`}></div>

                                                <button
                                                    disabled={(mission.progress >= 3)}
                                                    onClick={(e) => dispatch(INCREMENT_MISSION_PROGRESS(mission.id))}>
                                                    <span className="material-symbols-outlined">
                                                        add
                                                    </span>
                                                </button>
                                            </div>
                                        }
                                    </>
                                </LineItem>)
                        }
                    </ul>
                </div>

                <div className="section">
                    <div>
                        <div>
                            <h2>Rewards</h2>
                        </div>

                        <ItemInput
                            id={"new-reward-form"}
                            text={newRewardText}
                            onChange={(value) => setNewRewardText(value)}
                            placeholder={"eg. Carbon Rod"}
                            onSubmit={onNewRewardSubmit} />

                        <div>
                            {
                                (state.rewards.length > 0) &&
                                <button
                                    className="textless-btn item-edit-btn"
                                    onClick={(e) => setRewardsEditOn(prev => !prev)}>
                                    {rewardsEditOn ? "FINISH" : "MODIFY"}
                                </button>
                            }
                        </div>

                        <ul className="list">
                            {
                                state.rewards.map(reward =>
                                    <LineItem
                                        onTextUpdate={(text) => dispatch(UPDATE_REWARDS(reward.id, text))}
                                        displayEdit={rewardsEditOn}
                                        text={reward.name}
                                        key={reward.id}
                                        onDelete={() => dispatch(REMOVE_REWARDS(reward.id))} />)
                            }
                        </ul>
                    </div>
                </div>

                <div className="section options">
                    <h2>Options</h2>

                    <button
                        onClick={handleExportFile}
                        className="textless-btn fake-textless-btn">
                        Save Campaign
                    </button>

                    <div className="import-campaign-container">
                        <label className="textless-btn" htmlFor="import-campaign">Import Campaign</label>
                        <input
                            onChange={handleFileChange}
                            id="import-campaign"
                            accept=".txt, .json"
                            type="file" />
                    </div>
                </div>

                <p>
                    A digital campaign tracker for Earthborne Rangers I quickly cobbled together. It's recomended you save your campaign regularly just in case your browser deletes local storage or if you want to swap between multiple campaigns (I might add a campaign select page later).
                    Works best in a Chromium-based browser.
                </p>

                <p>I am in no way connected with Earthborne Games, I just think the game is neat.</p>
                <p>- <a href="https://github.com/coreyRalli">Corey Ralli</a></p>
            </div>
        </>
    )
}

export default Tracker;