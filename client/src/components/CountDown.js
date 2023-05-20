import React, { useEffect, useState } from "react";

const CountDown = ({ action = () => {} }) => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    useEffect(() => {
        const getTime = new Date();
        setHours(23 - +getTime.getHours());
        setMinutes(59 - +getTime.getMinutes());
        setSeconds(60 - +getTime.getSeconds());
    }, []);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds((prev) => prev - 1);
            } else {
                if (minutes > 0) {
                    setMinutes((prev) => prev - 1);
                    setSeconds(59);
                } else {
                    if (hours > 0) {
                        setHours((prev) => prev - 1);
                        setMinutes(59);
                        setSeconds(59);
                    } else {
                        action();
                        setHours(24);
                    }
                }
            }
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [seconds, minutes, hours]);
    return (
        <div className="flex gap-2 justify-center">
            <div className="w-[30%] h-[60px] flex flex-col justify-center items-center bg-[#f4f4f4] rounded-sm gap 2">
                <span className="text-[18px] font-semibold text-gray-800">
                    {hours}
                </span>
                <span className="text-xs text-gray-700">Hours</span>
            </div>
            <div className="w-[30%] h-[60px] flex flex-col justify-center items-center bg-[#f4f4f4] rounded-sm gap 2">
                <span className="text-[18px] font-semibold text-gray-800">
                    {minutes}
                </span>
                <span className="text-xs text-gray-700">Minutes</span>
            </div>
            <div className="w-[30%] h-[60px] flex flex-col justify-center items-center bg-[#f4f4f4] rounded-sm gap 2">
                <span className="text-[18px] font-semibold text-gray-800">
                    {seconds}
                </span>
                <span className="text-xs text-gray-700">Seconds</span>
            </div>
        </div>
    );
};

export default CountDown;
