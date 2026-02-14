import { useContext, useState } from "react";
import { CAMPAIGNS, generateArcologyWeather, generateWeather, LOCATIONS, LOCATIONS_LOTA, PATHS, PATHS_LOTA } from "../data";
import Select from "./Select"
import db, { CHANGE_CAMPAIGN, CHANGE_LOCATION, CHANGE_NOTE, CHANGE_TERRAIN, DECREMENT_DAY, INCREMENT_DAY } from '../database/db';
import { AppContext } from "../App";
import { useLiveQuery } from "dexie-react-hooks";

const DayHeader = () => {
    const [showCampaignEdit, setShowCampaignEdit] = useState(false);
    const [showCampaignNoteEdit, setShowCampaignNoteEdit] = useState(false);
    const [noteUpdateText, setNoteUpdateText] = useState("");
    const [tempCampaign, setTempCampaign] = useState(CAMPAIGNS[0]);

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

    const maxDayDisabled = () => {
        if (campaign.campaign === CAMPAIGNS[0])
            return (campaign.day >= 45);

        return (campaign.day >= 30);
    }

    const onClickUpdateCampaignNote = () => {
        setNoteUpdateText(campaign.note.note);
        setShowCampaignNoteEdit(true);
    }

    const onIncrementDayClick = () => {
        setShowCampaignNoteEdit(false);
        INCREMENT_DAY(campaign.id, campaign.day);
    }

    const onDecrementDayClick = () => {
        setShowCampaignNoteEdit(false);
        DECREMENT_DAY(campaign.id, campaign.day);
    }

    const onNoteUpdateSubmit = (e) => {
        e.preventDefault();
        CHANGE_NOTE(campaign.note.id, noteUpdateText);
        // TODO: Come up with a cleaner way of handling this

        setShowCampaignNoteEdit(false);
    }

    const handleChangeCampaignClick = () => {
        setTempCampaign(campaign.campaign);
        setShowCampaignEdit(true);
    }

    const handleSetNewCampaignClick = () => {
        if (tempCampaign !== campaign.campaign) {
            // TODO: Create in-page blocking UI rather than use confirm
            if (window.confirm("Do you want to change campaigns? All daily notes will be deleted!"))
                CHANGE_CAMPAIGN(campaign.id, tempCampaign);
        }

        setShowCampaignEdit(false);
    }

    return (
        <header className="header">
            <h1>Campaign Tracker</h1>

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
                        {campaign.campaign}
                        <button
                            onClick={handleChangeCampaignClick}
                            className="textless-btn">
                            CHANGE
                        </button>
                    </p>
            }

            <p>DAY</p>
            <div className="day-selector-container">
                <button
                    onClick={onDecrementDayClick}
                    disabled={campaign.day <= 1}>
                    <span className="material-symbols-outlined">arrow_left</span>
                </button>
                <p>{campaign.day}</p>
                <button
                    onClick={onIncrementDayClick}
                    disabled={maxDayDisabled()}>
                    <span className="material-symbols-outlined">arrow_right</span>
                </button>
            </div>
            <div className="weather-report">
                <p>{(campaign.campaign === CAMPAIGNS[1]) ? "(Valley)" : ""} {generateWeather(campaign.day, campaign.campaign)}</p>

                {
                    (campaign.campaign === CAMPAIGNS[1]) &&
                    <div className="weather-divider">
                        <p>(Arcology) {generateArcologyWeather(campaign.day)}</p>
                    </div>
                }
            </div>

            <Select
                options={(campaign.campaign === CAMPAIGNS[1]) ? [...LOCATIONS_LOTA, ...LOCATIONS] : LOCATIONS}
                value={campaign.location}
                id={"location-select"}
                onChange={(value) => CHANGE_LOCATION(campaign.id, value)}
                label={"Location"}
                initOptionText={"Select a location"} />

            <Select
                options={(campaign.campaign === CAMPAIGNS[1]) ? [...PATHS_LOTA, ...PATHS] : PATHS}
                value={campaign.terrain}
                id={"terrain-select"}
                onChange={(value) => CHANGE_TERRAIN(campaign.id, value)}
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
                                (campaign.note.note !== "") &&
                                <p>
                                    {campaign.note.note}
                                </p>
                            }

                            <button
                                onClick={() => onClickUpdateCampaignNote()}
                                className="textless-btn">
                                {campaign.note.note === "" ? "ADD NOTE" : "EDIT"}
                            </button>
                        </div>
                }
            </div>
        </header>
    )
}

export default DayHeader;