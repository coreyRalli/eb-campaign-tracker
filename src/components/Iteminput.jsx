const ItemInput = ({ text, onChange, onSubmit, placeholder, id, children }) =>
    <form
        className="new-item-form"
        onSubmit={onSubmit}>
        <input
            id={id}
            type="text"
            onChange={({ target }) => onChange(target.value)}
            value={text}
            placeholder={placeholder} />
        <button
            disabled={(text === "")}>
            Add
        </button>

        {children}
    </form>

export default ItemInput;