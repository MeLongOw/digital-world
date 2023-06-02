import React from "react";

const InputNumberCart = ({ number = 1, handleUpdateCart = () => {} }) => {
    const handleDownNum = () => {
        if (number > 1) {
            handleUpdateCart(+number - 1);
        }
    };
    const handleUpNum = () => {
        handleUpdateCart(+number + 1);
    };

    return (
        <div
            className={`flex bg-transparent border border-gray-600 h-[23px] w-[70px] justify-center`}
        >
            <button
                className="border-gray-600 border-r text-center font-base flex-3"
                onClick={() => {
                    handleDownNum();
                }}
            >
                -
            </button>
            <div className="flex-8">
                <input
                    className="w-full h-full text-center text-base bg-transparent"
                    type="number"
                    value={number}
                    onChange={(e) => {
                        handleUpdateCart(e.target.value);
                    }}
                />
            </div>
            <button
                className="border-gray-600 border-l text-center font-base flex-3"
                onClick={() => {
                    handleUpNum();
                }}
            >
                +
            </button>
        </div>
    );
};

export default InputNumberCart;
