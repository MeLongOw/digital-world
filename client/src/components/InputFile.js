import React from "react";

const InputFile = ({
    nameKey,
    type,
    title,
    value,
    setValue,
    invalidFields,
    multiple = false,
    setInvalidFields = () => {},
}) => {
    const changeHandler = (e) => {
        const selectedFile = Array.from(e.target.files);
        setValue((prev) => ({ ...prev, [nameKey]: selectedFile }));
    };
    return (
        <div className="w-full text-sm text-gray-700 mb-2">
            {title && <label>{title}</label>}
            <input
                type={type || "text"}
                className="px-4 py-2 rounded-md border w-full mt-2 text-sm placeholder:text-gray-300"
                placeholder={title}
                onChange={changeHandler}
                onFocus={() => setInvalidFields([])}
                value={value}
                multiple={multiple}
            />
            {invalidFields?.some((field) => field.name === nameKey) && (
                <small className="text-main italic">
                    {invalidFields?.find((field) => field.name === nameKey).mes}
                </small>
            )}
        </div>
    );
};

export default InputFile;
