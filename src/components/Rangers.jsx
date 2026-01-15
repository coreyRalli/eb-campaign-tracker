import { useState } from "react";
import { ADD_RANGER, REMOVE_RANGER, UPDATE_RANGER } from "../reducer/actions";
import LineItem from "./LineItem";
import ItemInput from "./iteminput";

const Rangers = ({ state, dispatch }) => {
    const [showRangerEdit, setShowRangerEdit] = useState(false);
    const [newRangerText, setNewRangerText] = useState("");

    const onNewRangerSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_RANGER(newRangerText));
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
                                        onTextUpdate={(value) => dispatch(UPDATE_RANGER(ranger.id, value))}
                                        displayEdit={showRangerEdit}
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
        </section>
    )
}

export default Rangers;