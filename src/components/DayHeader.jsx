import { useState } from "react";
import { CAMPAIGNS, generateArcologyWeather, generateWeather, LOCATIONS, LOCATIONS_LOTA, PATHS, PATHS_LOTA } from "../data";
import { CHANGE_LOCATION, CHANGE_TERRIAN, DECREMENT_DAY, INCREMENT_DAY, UPDATE_CAMPAIGN, UPDATE_NOTE } from "../reducer/actions";
import Select from "./Select"

const DayHeader = ({ state, dispatch }) => {
    const [showCampaignEdit, setShowCampaignEdit] = useState(false);
    const [showCampaignNoteEdit, setShowCampaignNoteEdit] = useState(false);
    const [noteUpdateText, setNoteUpdateText] = useState("");
    const [tempCampaign, setTempCampaign] = useState(CAMPAIGNS[0]);

    const maxDayDisabled = () => {
        if (state.campaign === CAMPAIGNS[0])
            return (state.day >= 45);

        return (state.day >= 30);
    }

    const onClickUpdateCampaignNote = () => {
        setNoteUpdateText(state.notes[state.day - 1].note);
        setShowCampaignNoteEdit(true);
    }

    const onIncrementDayClick = () => {
        setShowCampaignNoteEdit(false);
        dispatch(INCREMENT_DAY());
    }

    const onDecrementDayClick = () => {
        setShowCampaignNoteEdit(false);
        dispatch(DECREMENT_DAY());
    }

    const onNoteUpdateSubmit = (e) => {
        e.preventDefault();
        dispatch(UPDATE_NOTE(noteUpdateText));
        setShowCampaignNoteEdit(false);
    }

    const handleSetNewCampaignClick = () => {
        dispatch(UPDATE_CAMPAIGN(tempCampaign));
        setShowCampaignEdit(false);
    }

    return (
        <header className="header">
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
                    onClick={onDecrementDayClick}
                    disabled={state.day <= 1}>
                    <span className="material-symbols-outlined">arrow_left</span>
                </button>
                <p>{state.day}</p>
                <button
                    onClick={onIncrementDayClick}
                    disabled={maxDayDisabled()}>
                    <span className="material-symbols-outlined">arrow_right</span>
                </button>
            </div>
            <div className="weather-report">
                <p>{(state.campaign === CAMPAIGNS[1]) ? "(Valley)" : ""} {generateWeather(state.day, state.campaign)}</p>

                {
                    (state.campaign === CAMPAIGNS[1]) &&
                    <div className="weather-divider">
                        <p>(Arcology) {generateArcologyWeather(state.day)}</p>
                    </div>
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
                {
                    (showCampaignNoteEdit) ?
                        <div>
                            <form
                                className="campaign-note-container"
                                onSubmit={onNoteUpdateSubmit}>
                                <input
                                    value={noteUpdateText}
                                    onChange={({ target }) => setNoteUpdateText(target.value)}
                                    id="daily-note"
                                    type="text"
                                    placeholder={"Campaign Guide, Ranger Report Modifiers Etc."} />
                                <button
                                    type="submit"
                                    className="textless-btn">
                                    UPDATE
                                </button>
                            </form>
                        </div> :
                        <div className="campaign-note-container">
                            {
                                (state.notes[state.day - 1].note !== "") &&
                                <p>
                                    {state.notes[state.day - 1].note}
                                </p>
                            }

                            <button
                                onClick={() => onClickUpdateCampaignNote()}
                                className="textless-btn">
                                {state.notes[state.day - 1].note === "" ? "ADD NOTE" : "EDIT"}
                            </button>
                        </div>
                }
            </div>
        </header>
    )
}

export default DayHeader;