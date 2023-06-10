import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../utils/icons";

const { FaCheck } = icons;

const SelectOption = ({ icon, onClick = () => {}, productId, path }) => {
    const [showIconSuccess, setShowIconSuccess] = useState(false);

    const handleClick = async () => {
        const isSuccess = await onClick(productId);
        if (isSuccess) {
            setShowIconSuccess(true);
            setTimeout(() => {
                setShowIconSuccess(false);
            }, 1000);
        }
    };

    return (
        <Link
            onClick={(e) => {
                e.stopPropagation();
                handleClick();
            }}
            to={path}
            className="w-10 h-10 bg-white rounded-full border flex items-center shadow-sm justify-center 
         hover:bg-gray-800 hover:text-white hover:border-gray-800 cursor-pointer"
        >
            {showIconSuccess ? <FaCheck /> : icon}
        </Link>
    );
};

export default SelectOption;
