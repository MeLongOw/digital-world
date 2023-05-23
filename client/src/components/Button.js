import React, { memo } from "react";

const Button = ({
    name,
    handleClick = ()=>{},
    className,
    backgroundColor = "bg-main",
    iconsBefore,
    iconsAfter,
    rounded = false,
}) => {
    return (
        <div
            type="button"
            className={
                className
                    ? className
                    : `px-4 py-2 ${
                          rounded && "rounded-md"
                      } text-white font-semibold hover:cursor-pointer w-full flex justify-center items-center ${backgroundColor}`
            }
            onClick={() => {
                handleClick();
            }}
        >
            {iconsBefore && <div>{iconsBefore}</div>}
            <span className="mx-2">{name}</span>
            {iconsAfter && <div>{iconsAfter}</div>}
        </div>
    );
};

export default memo(Button);
