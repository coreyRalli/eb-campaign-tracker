import { useContext, useState } from "react";
import ItemInput from "./iteminput";
import LineItem from "./LineItem";
import { useLiveQuery } from "dexie-react-hooks";
import db, { INCREMENT_MISSION_PROGRESS, DECREMENT_MISSION_PROGRESS, SET_MISSION_COMPLETE, ADD_MISSION, UPDATE_MISSION, REMOVE_MISSION } from '../database/db';
import { AppContext } from "../App";
import { CAMPAIGNS } from "../data";

const Missions = ({ campaign }) => {
    const { campaignId } = useContext(AppContext);

    const missions = useLiveQuery(async () => {
        const e = await db.missions.where("campaignId").equals(campaign.id).toArray();

        return e;
    }, [campaignId])

    const [newMissionText, setNewMissionText] = useState("");
    const [missionsEditOn, setMissionsEditOn] = useState(false);
    const [progressChecked, setProgressChecked] = useState(true);

    if (!missions)
        return null;

    const onNewMissionSubmit = (e) => {
        e.preventDefault();
        ADD_MISSION(campaign.id, newMissionText, progressChecked ? 0 : -1, campaign.day, campaign.campaign);
        setNewMissionText("");
    }

    return (
        <section className="section">
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

            <div className="progress-marker-option">
                <input
                    id="no-progress-indicator"
                    checked={progressChecked}
                    onChange={({ target }) => setProgressChecked(target.checked)}
                    type="checkbox" />
                <label htmlFor="no-progress-indicator">Include Progress Markers</label>
            </div>

            <div className="edit-list-btn-container">
                {
                    (missions.length > 0) &&
                    <button
                        className="textless-btn item-edit-btn"
                        onClick={() => setMissionsEditOn(prev => !prev)}>
                        {missionsEditOn ? "FINISH" : "MODIFY"}
                    </button>
                }
            </div>

            <ul className="list">
                {
                    missions.map(mission =>
                        <LineItem
                            onTextUpdate={(text) => UPDATE_MISSION(mission.id, text)}
                            text={mission.name}
                            key={mission.id}
                            displayEdit={missionsEditOn}
                            canMarkComplete
                            complete={mission.complete}
                            onCheckChange={(checked) => SET_MISSION_COMPLETE(mission.id, checked)}
                            checkId={`mission-${mission.id}-complete`}
                            onDelete={() => REMOVE_MISSION(mission.id)}>
                            {/* Mission markers */}
                            <>
                                <p className="mission-day">
                                    Day {mission.day} <span>{(mission.campaign === CAMPAIGNS[1] ? "(LOTA)" : "")}</span>
                                </p>
                                {
                                    (mission.progress !== -1 && !mission.complete) &&
                                    <div className="mission-progress-container">
                                        <button
                                            disabled={(mission.progress <= 0)}
                                            onClick={(e) => DECREMENT_MISSION_PROGRESS(mission.id, mission.progress)}>
                                            <span className="material-symbols-outlined">
                                                remove
                                            </span>
                                        </button>

                                        <div className={`mission-progress ${mission.progress === 1 ? "active" : ""}`}></div>
                                        <div className={`mission-progress ${mission.progress === 2 ? "active" : ""}`}></div>
                                        <div className={`mission-progress ${mission.progress === 3 ? "active" : ""}`}></div>

                                        <button
                                            disabled={(mission.progress >= 3)}
                                            onClick={(e) => INCREMENT_MISSION_PROGRESS(mission.id, mission.progress)}>
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
        </section>
    )
}

export default Missions;