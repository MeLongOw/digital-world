import React from "react";
import icons from "../../../utils/icons";

const { MdModeEdit } = icons;

const EditButton = ({ handleEdit = () => {} }) => {
    return (
        <button
            className="h-[35px] aspect-square border bg-green-500 rounded-md text-white flex justify-center items-center hover:cursor-pointer"
            onClick={()=> handleEdit()}
        >
            <MdModeEdit size={20} />
        </button>
    );
};

export default EditButton;
