import React from "react";
import icons from "../../../utils/icons";

const { MdModeEdit } = icons;

const EditButton = ({ handleEdit = () => {} }) => {
    return (
        <div
            className="h-[35px] w-[35px] border bg-green-500 rounded-md text-white flex justify-center items-center hover:cursor-pointer"
            onClick={()=> handleEdit()}
        >
            <MdModeEdit size={20} />
        </div>
    );
};

export default EditButton;
