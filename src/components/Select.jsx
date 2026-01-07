const Select = ({ options, value, onChange, label, id, initOptionText }) =>
    <div className="select-field">
        <label htmlFor={id}>{label}</label>
        <select
            value={value}
            onChange={({ target }) => onChange(target.value)}
            id={id}>
            <option value={""}>{initOptionText}</option>
            {options.map(item => (<option key={item} value={item}>{item}</option>))}
        </select>
    </div>;

export default Select;