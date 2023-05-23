import React from "react";

const TextArea = ({
    value,
    setValue,
    nameKey,
    type,
    title,
    invalidFields,
    setInvalidFields =()=>{},
}) => {

    return (
        <div className="w-full text-sm text-gray-700 mb-2">
            {title && <label>{title}</label>}
            <textarea
                className="px-4 py-2 rounded-sm border w-full mt-2 text-sm placeholder:text-gray-300"
                placeholder={title}
                value={value}
                onChange={(e) =>
                    setValue((prev) => ({ ...prev, [nameKey]: e.target.value }))
                }
                onFocus={()=> setInvalidFields([])}
            />
           { invalidFields?.some((field => field.name === nameKey)) &&  <small className="text-main italic">{invalidFields?.find((field)=>field.name ===nameKey).mes}</small>}
        </div>
    );
};

export default TextArea;
