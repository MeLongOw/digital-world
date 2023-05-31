import React from "react";

import icons from "../../../utils/icons";

const { IoMdRemoveCircle } = icons;

const Photo = ({ index, onClick, photo }) => {
    const { src } = photo;
    const handleClick = (event) => {
        onClick(event, { photo, index });
    };

    const handleRemoveImage = (index) => {
        // images?.splice(index, 1);
        // setValue((prev) => ({ ...prev, images: images }));
    };
    return (
        <div className="w-1/4 p-2 relative hover:cursor-move">
            <img
                src={src}
                className="aspect-square p-2 border object-contain"
                key={index}
                alt="item"
                onClick={onClick ? handleClick : null}
            />
            <button
                className="text-main rounded-full bg-white absolute top-1 right-1"
                onClick={() => handleRemoveImage(index)}
            >
                <IoMdRemoveCircle size={20} />
            </button>
        </div>

        // <img
        //   style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        //   {...photo}
        //   onClick={onClick ? handleClick : null}
        //   alt="img"
        // />
    );
};

export default Photo;
