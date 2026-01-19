import { useState } from "react";
import ItemInput from "./iteminput";
import LineItem from "./LineItem";
import { useLiveQuery } from "dexie-react-hooks";
import db, { ADD_REWARDS, UPDATE_REWARDS, REMOVE_REWARDS } from '../database/db';

const Rewards = ({ id }) => {
    const rewards = useLiveQuery(async () => {
        const r = await db.rewards.where("campaignId").equals(id).toArray();

        return r;
    }, []);

    const [newRewardText, setNewRewardText] = useState("");
    const [rewardsEditOn, setRewardsEditOn] = useState(false);

    if (!rewards)
        return null;


    const onNewRewardSubmit = (e) => {
        e.preventDefault();
        ADD_REWARDS(id, newRewardText);
        setNewRewardText("");
    }

    return (
        <section className="section">
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
                        (rewards.length > 0) &&
                        <button
                            className="textless-btn item-edit-btn"
                            onClick={(e) => setRewardsEditOn(prev => !prev)}>
                            {rewardsEditOn ? "FINISH" : "MODIFY"}
                        </button>
                    }
                </div>

                <ul className="list">
                    {
                        rewards.map(reward =>
                            <LineItem
                                onTextUpdate={(text) => UPDATE_REWARDS(reward.id, text)}
                                displayEdit={rewardsEditOn}
                                text={reward.name}
                                key={reward.id}
                                onDelete={() => REMOVE_REWARDS(reward.id)} />)
                    }
                </ul>
            </div>
        </section>
    )
}

export default Rewards;