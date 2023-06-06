import React, { useEffect } from "react";

const InputNumberProduct = ({
    number = 1,
    setNumber = () => {},
    available,
}) => {
    const handleDownNum = () => {
        if (number > 1) {
            setNumber((prev) => prev - 1);
        }
    };
    const handleUpNum = () => {
        if (number < available) setNumber((prev) => prev + 1);
    };
    useEffect(() => {
        setNumber(1);
    }, [available, setNumber]);

    return (
        <div className={`flex bg-gray-200 h-[40px] w-[112px] justify-center`}>
            <button
                className="border-black border-r text-center font-base flex-3"
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
                        setNumber(e.target.value);
                    }}
                />
            </div>
            <button
                className="border-black border-l text-center font-base flex-3"
                onClick={() => {
                    handleUpNum();
                }}
            >
                +
            </button>
        </div>
    );
};

export default InputNumberProduct;
