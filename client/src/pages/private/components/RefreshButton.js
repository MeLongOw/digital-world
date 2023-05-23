import React, { useState } from "react";
import icons from "../../../utils/icons";

const { IoMdRefresh } = icons;

const RefreshButton = ({ handleClick = () => {} }) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div>
            <IoMdRefresh
                size={32}
                onClick={() => {
                    setIsLoading(true);
                    const isSucces = handleClick();
                    if (isSucces)
                        setTimeout(() => {
                            setIsLoading(false);
                        }, 1000);
                }}
                className={`ml-5 ${
                    isLoading && "animate-spin"
                } hover:cursor-pointer`}
            />
        </div>
    );
};

export default RefreshButton;
