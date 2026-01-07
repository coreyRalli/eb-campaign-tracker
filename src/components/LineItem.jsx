import { useState } from 'react';

const LineItem = ({ text, onDelete, displayEdit, children, onTextUpdate }) => {
    const [isEditingText, setIsEditingText] = useState(false);
    const [textInput, setTextInput] = useState(text);

    return (<>
        <li>
            <div className="line-item">
                {
                    (!isEditingText) &&
                    <span>{text}</span>
                }

                {
                    (displayEdit && !isEditingText) &&
                    <>
                        <button onClick={() => {
                            setTextInput(text);
                            setIsEditingText(true);
                        }}>
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => onDelete()}>
                            <span className="material-symbols-outlined delete">delete</span>
                        </button>
                    </>
                }

                {
                    (displayEdit && isEditingText) &&
                    <div className="item-modification-input">
                        <input
                            type="text"
                            value={textInput}
                            onChange={({ target }) => setTextInput(target.value)} />
                        <button
                            disabled={textInput === ""}
                            onClick={() => {
                                if (onTextUpdate)
                                    onTextUpdate(textInput);

                                setIsEditingText(false);
                            }}>
                            <span className="material-symbols-outlined">check</span>
                        </button>
                        <button
                            onClick={(e) => setIsEditingText(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                }
            </div>
            {children}
        </li>
    </>)
}

export default LineItem;