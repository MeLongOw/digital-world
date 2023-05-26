import React, { useEffect, useState } from "react";
import icons from "../utils/icons";

const { IoMdAddCircleOutline, IoMdRemoveCircleOutline } = icons;

const InputVariants = ({
    value = [],
    setValue,
    nameKey,
    type,
    title,
    invalidFields,
    setInvalidFields = () => {},
}) => {
    const [valueCopy, setValueCopy] = useState(
        JSON.parse(JSON.stringify(value))
    );
    console.log({ valueCopy });
    const [fieldCount, setFieldCount] = useState(
        valueCopy.length > 0 ? valueCopy.length : 1
    );
    const [field, setField] = useState([]);

    const handleAddField = (index) => {
        valueCopy.splice(index + 1, 0, { label: "", variants: [""] });
        setValueCopy(valueCopy);
        setValue((prev) => ({
            ...prev,
            [nameKey]: [...valueCopy],
        }));
        setFieldCount((prev) => prev + 1);
    };

    const handleRemoveField = (indexField, indexVariants) => {
        if (valueCopy[0].variants.length > 0 && valueCopy.length > 1) {
            valueCopy[indexField].variants.splice(indexVariants, 1);
            if (valueCopy[indexField].variants.length === 0) {
                valueCopy.splice(indexField, 1);
                setFieldCount((prev) => {
                    return prev - 1;
                });
            }

            setValueCopy(valueCopy);
            setValue((prev) => ({
                ...prev,
                [nameKey]: [...valueCopy],
            }));
        }
    };

    useEffect(() => {
        setField(Array.from({ length: fieldCount }, (_, i) => i + 1));
    }, [fieldCount]);

    return (
        <div className="w-full text-sm text-gray-700 mb-2">
            {title && <label>{title}</label>}

            {field.map((_, indexField) =>
                valueCopy[indexField]?.variants?.map((el, indexVariants) => (
                    <div
                        className="flex items-center mt-2"
                        key={`${indexField}-${indexVariants}`}
                    >
                        <input
                            className="px-4 py-2 flex-1 rounded-md border w-full text-sm placeholder:text-gray-300 mr-4"
                            placeholder={`Label`}
                            value={valueCopy[indexField]?.label ?? ''}
                            onChange={(e) => {
                                setValue((prev) => {
                                    valueCopy[indexField].label =
                                        e.target.value;
                                    return {
                                        ...prev,
                                        [nameKey]: [...valueCopy],
                                    };
                                });
                            }}
                        />
                        <input
                            type={type || "text"}
                            className="px-4 py-2 flex-4 rounded-md border w-full text-sm placeholder:text-gray-300"
                            placeholder={`${title}`}
                            value={el}
                            onChange={(e) =>
                                setValue((prev) => {
                                    valueCopy[indexField].variants[
                                        indexVariants
                                    ] = e.target.value;
                                    return {
                                        ...prev,
                                        [nameKey]: [...valueCopy],
                                    };
                                })
                            }
                            onFocus={() => setInvalidFields([])}
                        />
                        <button className="ml-2">
                            <IoMdAddCircleOutline
                                size={20}
                                onClick={() => handleAddField(indexField)}
                                className="hover:text-main"
                            />
                        </button>
                        <button className="ml-2">
                            <IoMdRemoveCircleOutline
                                size={20}
                                onClick={() =>
                                    handleRemoveField(indexField, indexVariants)
                                }
                                className="hover:text-main"
                            />
                        </button>
                    </div>
                ))
            )}
            {invalidFields?.some((field) => field.name === nameKey) && (
                <small className="text-main italic">
                    {invalidFields?.find((field) => field.name === nameKey).mes}
                </small>
            )}
        </div>
    );
};

export default InputVariants;
