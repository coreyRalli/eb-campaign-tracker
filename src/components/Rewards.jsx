import { useState } from "react";
import { ADD_REWARDS, REMOVE_REWARDS, UPDATE_REWARDS } from "../reducer/actions";
import ItemInput from "./iteminput";
import LineItem from "./LineItem";

const Rewards = ({ state, dispatch }) => {
    const [newRewardText, setNewRewardText] = useState("");
    const [rewardsEditOn, setRewardsEditOn] = useState(false);

    const onNewRewardSubmit = (e) => {
        e.preventDefault();
        dispatch(ADD_REWARDS(newRewardText));
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
        </section>
    )
}

export default Rewards;