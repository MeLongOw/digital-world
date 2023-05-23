import React, { useState } from "react";
import icons from "../../../utils/icons";

const { RiDeleteBin5Line, AiOutlineLoading } = icons;

const DeleteButton = ({ handleDelete = async () => {} }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div
            className="h-[35px] w-[35px] border rounded-md flex justify-center items-center hover:cursor-pointer "
            onClick={async () => {
                setIsLoading(true);
                const isSuccess = await handleDelete();
                console.log({ isSuccess });
                if (isSuccess) {
                    setIsLoading(false);
                }
            }}
        >
            {isLoading ? (
                <AiOutlineLoading className="animate-spin" />
            ) : (
                <RiDeleteBin5Line size={20} />
            )}
        </div>
    );
};

export default DeleteButton;
