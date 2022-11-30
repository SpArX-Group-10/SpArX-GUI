const selectorCreator = (name, value, enums, callback) => {
    let options = Object.entries(enums).map(([key, value]) => (
        <option key={name + value} value={value}>
            {key}
        </option>
    ));
    return (
        <div>
            {name + ": "}
            <select value={value} onChange={(e) => callback(e.target.value)}>
                {options}
            </select>
        </div>
    );
};

const numericInputCreator = (name, value, callback, parser) => {
    return (
        <div>
            {name + ": "}
            <input type="number" value={value} onChange={(e) => callback(parser(e.target.value))} />
        </div>
    );
};

export { selectorCreator, numericInputCreator };
