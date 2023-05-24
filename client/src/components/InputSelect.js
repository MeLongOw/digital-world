import React from "react";
import Select from "react-select";

const InputSelect = ({
    setValue,
    nameKey,
    title,
    defaultValue,
    invalidFields,
    selectOptions,

    setInvalidFields = () => {},
}) => {
    return (
        <div className="w-full text-sm text-gray-700 mb-2">
            {title && <label>{title}</label>}
            <Select
                defaultValue={defaultValue}
                isMulti
                name="colors"
                options={selectOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(array) => {
                    setValue((prev) => ({
                        ...prev,
                        [nameKey]: array.map((item) => item.value),
                    }));
                }}
                onFocus={() => setInvalidFields([])}
            />
            {invalidFields?.some((field) => field.name === nameKey) && (
                <small className="text-main italic">
                    {invalidFields?.find((field) => field.name === nameKey).mes}
                </small>
            )}
        </div>
    );
};

export default InputSelect;
