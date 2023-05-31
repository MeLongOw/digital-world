import React from "react";
import SortableImage from "../pages/private/components/SortableImage";

const InputFile = ({
    images,
    nameKey,
    type,
    title,
    setValue,
    invalidFields,
    multiple = false,
    setInvalidFields = () => {},
}) => {
    const changeHandler = (e) => {
        const selectedFile = Array.from(e.target.files);
        setValue((prev) => ({ ...prev, [nameKey]: selectedFile }));
    };

    const handleRemoveImage = (index) => {
        images?.splice(index, 1);
        setValue((prev) => ({ ...prev, images: images }));
    };
    return (
        <div className="w-full text-sm text-gray-700 mb-2">
            {title && <label>{title}</label>}
            <input
                accept="image/png, image/gif, image/jpeg"
                type={type || "text"}
                className="px-4 py-2 rounded-md border w-full mt-2 text-sm placeholder:text-gray-300"
                placeholder={title}
                onChange={changeHandler}
                onFocus={() => setInvalidFields([])}
                multiple={multiple}
            />
            {invalidFields?.some((field) => field.name === nameKey) && (
                <small className="text-main italic">
                    {invalidFields?.find((field) => field.name === nameKey).mes}
                </small>
            )}
            <div className="flex flex-wrap mx-[-8px]">
                {/* {images?.map((imageURL, index) => (
                    <div className="w-1/4 p-2 relative">
                        <img
                            className="aspect-square p-2 border object-contain"
                            key={imageURL}
                            alt="item"
                            src={imageURL}
                        />
                        <button
                            className="text-main rounded-full bg-white absolute top-1 right-1"
                            onClick={() => handleRemoveImage(index)}
                        >
                            <IoMdRemoveCircle size={20} />
                        </button>
                    </div>
                ))}
                <DragImages images={images} setImages={setValue} /> */}
                {!!images?.length && <SortableImage images={images} setImages={setValue} />}
            </div>
        </div>
    );
};

export default InputFile;
