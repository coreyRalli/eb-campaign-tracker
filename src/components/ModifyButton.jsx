const ModifyButton = ({ editModeOn, onClick }) => {
    <div>
        <button
            className="textless-btn item-edit-btn"
            onClick={(e) => onClick()}>
            {editModeOn ? "FINISH" : "MODIFY"}
        </button>
    </div>
}

export default ModifyButton;