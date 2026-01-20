import { useContext, useState } from "react";
import ItemInput from "./iteminput";
import LineItem from "./LineItem";
import { useLiveQuery } from "dexie-react-hooks";
import db, { ADD_EVENT, UPDATE_EVENT, REMOVE_EVENT } from "../database/db";
import { AppContext } from "../App";

const Events = () => {
    const { campaignId } = useContext(AppContext);
    
    const events = useLiveQuery(async () => {
        const e = await db.events.where("campaignId").equals(campaignId).toArray();

        return e;
    }, [campaignId])

    const [newEventText, setNewEventText] = useState("");
    const [eventsEditOn, setEventsEditOn] = useState(false);

    if (!events)
        return null;

    const onNewEventSubmit = (e) => {
        e.preventDefault();
        ADD_EVENT(campaignId, newEventText);
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
                    (events.length > 0) &&
                    <button
                        className="textless-btn item-edit-btn"
                        onClick={() => setEventsEditOn(prev => !prev)}>
                        {eventsEditOn ? "FINISH" : "MODIFY"}
                    </button>
                }
            </div>

            <ul className="list">
                {
                    events.map(event =>
                        <LineItem
                            onTextUpdate={(text) => UPDATE_EVENT(event.id, text)}
                            displayEdit={eventsEditOn}
                            text={event.note}
                            key={event.id}
                            onDelete={() => REMOVE_EVENT(event.id)} />)
                }
            </ul>
        </section>
    )
}

export default Events;