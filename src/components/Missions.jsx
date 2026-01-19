import { useState } from "react";
import { DECREMENT_MISSION_PROGRESS, INCREMENT_MISSION_PROGRESS, REMOVE_MISSION, UPDATE_MISSION, ADD_MISSION, SET_MISSION_COMPLETE } from "../reducer/actions"
import ItemInput from "./iteminput";
import LineItem from "./LineItem";

const Missions = ({ state, dispatch }) => {
    const [newMissionText, setNewMissionText] = useState("");
    const [missionsEditOn, setMissionsEditOn] = useState(false);
    const [progressChecked, setProgressChecked] = useState(true);

    const onNewMissionSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_MISSION(newMissionText, progressChecked ? 0 : -1));
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
                            canMarkComplete
                            complete={mission.complete}
                            onCheckChange={(checked) => dispatch(SET_MISSION_COMPLETE(mission.id, checked))}
                            checkId={`mission-${mission.id}-complete`}
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
        </section>
    )
}

export default Missions;