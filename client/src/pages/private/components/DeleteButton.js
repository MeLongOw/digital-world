import React, { useState } from "react";
import icons from "../../../utils/icons";

const { RiDeleteBin5Line, AiOutlineLoading } = icons;

const DeleteButton = ({
    height = "35px",
    disabled = false,
    handleDelete = async () => {},
}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <button
            className={`h-[${height}] aspect-square flex-shrink-0 border rounded-md flex justify-center 
            items-center hover:cursor-pointer bg-white disabled:opacity-25 disabled:cursor-default`}
            onClick={async () => {
                setIsLoading(true);
                const isSuccess = await handleDelete();
                if (isSuccess) {
                    setIsLoading(false);
                }   
            }}
            disabled={disabled}
        >
            {isLoading ? (
                <AiOutlineLoading className="animate-spin" />
            ) : (
                <RiDeleteBin5Line size={20} />
            )}
        </button>
    );
};

export default DeleteButton;
