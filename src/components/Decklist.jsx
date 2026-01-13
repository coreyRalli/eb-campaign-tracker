import { useReducer, useState } from 'react';
import { BACKGROUNDS, PERSONALITIES_AWA, PERSONALITIES_FIT, PERSONALITIES_FOC, PERSONALITIES_SPI, SPECIALITIES } from '../data';
import ItemInput from './iteminput';
import Select from './Select';
import reducer, { initialState } from '../reducer/decklist-reducer';
import LineItem from './LineItem';
import { REMOVE_BACKGROUND_CARD, REMOVE_DISPLACED_CARD, REMOVE_OUTSIDE_INTEREST_CARD, REMOVE_SPECIALITY_CARD, SET_AWA, SET_AWA_PERSONALITY, SET_FIT, SET_FIT_PERSONALITY, SET_FOC, SET_FOC_PERSONALITY, SET_SPI_PERSONALITY, UPDATE_BACKGROUND_CARD, UPDATE_DISPLACED_CARD, UPDATE_OUTSIDE_INTEREST_CARD, UPDATE_SPECIALITY_CARD } from '../reducer/decklist-actions';
import ModifyButton from './ModifyButton';

const AtributeSlider = ({ id, label, value, onChange }) => {
    <div>
        <label htmlFor={id}>{label}</label>
        <input
            list='steps'
            onChange={({ target }) => onChange(target.value)}
            type='range'
            id={id}
            value={value}
            min={1}
            max={1}
            step={1} />
    </div>
}

const Decklist = ({ ranger }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [newBackgroundText, setNewBackgroundText] = useState("");
    const [newSpecialityText, setNewSpecialityText] = useState("");
    const [newOutsideInterestText, setNewOutsideInterestText] = useState("");
    const [newDisplacedText, setNewDisplacedText] = useState("");

    const [backgroundEditOn, setBackgroundEditOn] = useState(false);
    const [specialityEditOn, setSpecialityEditOn] = useState(false);
    const [outsideInterestEditOn, setOutsideInterestOn] = useState(false);
    const [displacedEditOn, setDisplacedEditOn] = useState(false);

    useEffect(() => {
        const rangerDeck = localStorage.getItem(`ranger-${ranger.id}`);
        if (rangerDeck) {
            const data = JSON.parse(rangerDeck);

            dispatch({ type: 'hydrate', payload: { data } });
        }
    }, [])

    useEffect(() => {
        if (state !== initialState)
            localStorage.setItem(`ranger-${ranger.id}`, JSON.stringify(state));
    }, [state]);

    const onNewBackgroundSubmit = (e) => {
        e.preventDefault();
    }
    const onNewSpecialitySubmit = (e) => {
        e.preventDefault();
    }
    const onNewOutsideInterestSubmit = (e) => {
        e.preventDefault();
    }
    const onNewDisplacedSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <dialog open>
            <h1>{ranger.name}'s Deck</h1>
            <div className='section'>
                <AtributeSlider
                    id={"awareness-slider"}
                    value={state.aspect[0]}
                    label={"Awareness (AWA)"}
                    onChange={(value) => dispatch(SET_AWA(value))} />

                <AtributeSlider
                    id={"spirit-slider"}
                    value={state.aspect[1]}
                    label={"Spirit (SPI)"}
                    onChange={(value) => dispatch(SET_SPI(value))} />

                <AtributeSlider
                    id={"fitness-awareness-slider"}
                    value={state.aspect[2]}
                    label={"Fitness (FIT)"}
                    onChange={(value) => dispatch(SET_FIT(value))} />

                <AtributeSlider
                    id={"focus-awareness-slider"}
                    value={state.aspect[3]}
                    label={"Focus (FOC)"}
                    onChange={(value) => dispatch(SET_FOC(value))} />

                <datalist id='steps'>
                    <option value={1} />
                    <option value={2} />
                    <option value={3} />
                    <option value={4} />
                </datalist>
            </div>

            <div className='section'>
                <p>Personalities</p>

                <Select
                    label={"Awareness"}
                    value={state.personality[0]}
                    id={"per-select-awa"}
                    options={PERSONALITIES_AWA}
                    onChange={(value) => dispatch(SET_AWA_PERSONALITY(value))} />

                <Select
                    label={"Spirit"}
                    id={"per-select-spi"}
                    value={state.personality[1]}
                    options={PERSONALITIES_SPI}
                    onChange={(value) => dispatch(SET_SPI_PERSONALITY(value))} />

                <Select
                    label={"Fitness"}
                    id={"per-select-fit"}
                    options={PERSONALITIES_FIT}
                    value={state.personality[2]}
                    onChange={(value) => dispatch(SET_FIT_PERSONALITY(value))} />

                <Select
                    label={"Focus"}
                    id={"per-select-foc"}
                    options={PERSONALITIES_FOC}
                    value={state.personality[3]}
                    onChange={(value) => dispatch(SET_FOC_PERSONALITY(value))} />
            </div>

            <div className='section'>
                <Select options={BACKGROUNDS} label={"Background"} />
                <ItemInput
                    id={"new-background-card"}
                    text={newBackgroundText}
                    onChange={(value) => setNewBackgroundText(value)}
                    placeholder={"eg. Meditation Pillow"}
                    onSubmit={onNewBackgroundSubmit} />

                {
                    (state.backgrounds.length > 0) &&
                    <ModifyButton
                        editModeOn={backgroundEditOn}
                        onClick={() => setBackgroundEditOn(prev => !prev)} />
                }

                <ul className='list'>
                    {
                        state.backgrounds.map(background =>
                            <LineItem
                                onTextUpdate={(text) => dispatch(UPDATE_BACKGROUND_CARD(background.id, text))}
                                displayEdit={backgroundEditOn}
                                text={background.name}
                                key={background.id}
                                onDelete={() => dispatch(REMOVE_BACKGROUND_CARD(background.id))} />)
                    }
                </ul>
            </div>

            <div className='section'>
                <Select options={SPECIALITIES} label={"Speciality"} />
                <ItemInput
                    id={"new-background-card"}
                    text={newSpecialityText}
                    onChange={(value) => setNewSpecialityText(value)}
                    placeholder={"eg. Pokodo The Ferrit"}
                    onSubmit={onNewSpecialitySubmit} />

                {
                    (state.specialities.length > 0) &&
                    <ModifyButton
                        editModeOn={specialityEditOn}
                        onClick={() => setSpecialityEditOn(prev => !prev)} />
                }

                <ul className='list'>
                    {
                        state.specialities.map((sc) => (
                            <LineItem
                                onTextUpdate={(text) => dispatch(UPDATE_SPECIALITY_CARD(sc.id, text))}
                                displayEdit={specialityEditOn}
                                text={sc.name}
                                key={sc.id}
                                onDelete={() => dispatch(REMOVE_SPECIALITY_CARD(sc.id))} />
                        ))
                    }
                </ul>
            </div>

            <div className='section'>
                <p>Outside Interest/Malady/Reward Cards</p>
                <ItemInput
                    id={"new-oi-card"}
                    text={newOutsideInterestText}
                    onChange={(value) => setNewOutsideInterestText(value)}
                    placeholder={"eg. Lingering Injury"}
                    onSubmit={onNewOutsideInterestSubmit} />

                {
                    (state.outsideInterests.length > 0) &&
                    <ModifyButton
                        editModeOn={outsideInterestEditOn}
                        onClick={() => setOutsideInterestOn(prev => !prev)} />
                }

                <ul className='list'>
                    {
                        state.outsideInterests.map((oic) => (
                            <LineItem
                                onTextUpdate={(text) => dispatch(UPDATE_OUTSIDE_INTEREST_CARD(oic.id, text))}
                                displayEdit={outsideInterestEditOn}
                                text={oic.name}
                                key={oic.id}
                                onDelete={() => dispatch(REMOVE_OUTSIDE_INTEREST_CARD(oic.id))} />
                        ))
                    }
                </ul>
            </div>

            <div className='section'>
                <p>Displaced Cards</p>
                <ItemInput
                    id={"new-background-card"}
                    text={newDisplacedText}
                    onChange={(value) => setNewDisplacedText(value)}
                    placeholder={"eg. Pokodo The Ferrit"}
                    onSubmit={onNewDisplacedSubmit} />

                {
                    (state.outsideInterests.length > 0) &&
                    <ModifyButton
                        editModeOn={displacedEditOn}
                        onClick={() => setDisplacedEditOn(prev => !prev)} />
                }

                <ul className='list'>
                    {
                        state.displaced.map((dc) => (
                            <LineItem
                                onTextUpdate={(text) => dispatch(UPDATE_DISPLACED_CARD(dc.id, text))}
                                displayEdit={displacedEditOn}
                                text={dc.name}
                                key={dc.id}
                                onDelete={() => dispatch(REMOVE_DISPLACED_CARD(dc.id))} />
                        ))
                    }
                </ul>
            </div>

            <form method='dialog'>
                <button>Close</button>
            </form>
        </dialog>
    )
}

export default Decklist;