import { useState } from "react";
import { ADD_EVENT, REMOVE_EVENT, UPDATE_EVENT } from "../reducer/actions";
import ItemInput from "./iteminput";
import LineItem from "./LineItem";

const Events = ({ state, dispatch }) => {
    const [newEventText, setNewEventText] = useState("");
    const [eventsEditOn, setEventsEditOn] = useState(false);

    const onNewEventSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_EVENT(newEventText));
        setNewEventText("");
    }

    return (
        <section className="section">
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
        </section>
    )
}

export default Events;