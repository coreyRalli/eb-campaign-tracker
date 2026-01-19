import { useState } from "react";
import LineItem from "./LineItem";
import ItemInput from "./iteminput";
import { useLiveQuery } from "dexie-react-hooks";
import db, { ADD_RANGER, REMOVE_RANGER, UPDATE_RANGER } from '../database/db';

const Rangers = ({ id }) => {
    const rangers = useLiveQuery(async () => {
        const e = db.rangers.where("campaignId").equals(id).toArray();

        return e;
    }, [])

    const [showRangerEdit, setShowRangerEdit] = useState(false);
    const [newRangerText, setNewRangerText] = useState("");

    if (!rangers)
        return null;

    const onNewRangerSubmit = (e) => {
        e.preventDefault();
        ADD_RANGER(id, newRangerText);
        setNewRangerText("");
    }

    return (
        <section className="section">
            <div>
                <h2>Rangers</h2>
            </div>

            {
                !showRangerEdit ?
                    <p>
                        {(rangers.length > 0) ? rangers.map(r => r.name).join(", ") : "No Rangers Added"}
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
                                rangers.map(ranger =>
                                    <LineItem
                                        onTextUpdate={(value) => UPDATE_RANGER(ranger.id, value)}
                                        displayEdit={showRangerEdit}
                                        text={ranger.name}
                                        key={ranger.id}
                                        onDelete={() => REMOVE_RANGER(ranger.id)} />)
                            }
                        </ul>

                        <button className="textless-btn" onClick={(e) => setShowRangerEdit(false)}>
                            FINISH
                        </button>
                    </>
            }
        </section>
    )
}

export default Rangers;