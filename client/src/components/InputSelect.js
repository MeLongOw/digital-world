import React from "react";
import Select from "react-select";

const InputSelect = ({
    isMulti = true,
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
            {title && <label className='flex mb-[10px]'>{title}</label>}
            <Select
                defaultValue={defaultValue}
                isMulti={isMulti}
                name="colors"
                options={selectOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(data) => {
                    setValue((prev) =>
                        isMulti
                            ? {
                                  ...prev,
                                  [nameKey]: data.map((item) => item.value),
                              }
                            : {
                                  ...prev,
                                  [nameKey]: data.value,
                              }
                    );
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
