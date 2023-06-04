import React from "react";
import Button from "../../../components/Button";
import icons from "../../../utils/icons";

const { AiOutlineClose } = icons;

const Modal = ({
    isModalOpen = true,
    handleSubmit =  () => {},
    handleCancel = () => {},
    isEdit = false,
    children,
}) => {

    const handleCloseModal = () => {
        handleCancel(false);
    };

    return (
        isModalOpen && (
            <div
                className="fixed top-0 bottom-0 left-0 right-0 bg-overlay flex justify-center items-center"
                onClick={() => handleCancel(false)}
            >
                <div
                    className="w-[700px] max-h-[800px] overflow-y-auto bg-white justify-center items-center rounded-xl p-5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between">
                        <span className="mb-4 font-semibold text-lg">
                            {isEdit ? "Edit" : "Add New"}
                        </span>
                        <span
                            onClick={handleCloseModal}
                            className="hover:cursor-pointer"
                        >
                            <AiOutlineClose
                                size={20}
                                onClick={() => {
                                    handleCancel(false);
                                }}
                            />
                        </span>
                    </div>
                    {children}

                    <div className="flex justify-end mt-4">
                        <div className="flex">
                            <Button
                                name='OK'
                                rounded
                                handleClick={handleSubmit}  
                            />
                        </div>
                        <button
                            className="border rounded-md ml-4 p-2 h-10"
                            onClick={() => {
                                handleCancel(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default Modal;
