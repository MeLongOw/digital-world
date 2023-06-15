import React from "react";
import icons from "../../../utils/icons";

const { BsBell, RxAvatar, AiOutlineMenu } = icons;

const Header = ({ isHideSideBar, setIsHideSideBar }) => {
    return (
        <div className="h-[76px] border-b w-full flex justify-between items-center p-[28px]">
            <div>
                <div
                    className="border rounded-md w-10 h-10 flex items-center justify-center mr-2 hover:bg-gray-200 hover:cursor-pointer"
                    onClick={() => setIsHideSideBar(!isHideSideBar)}
                >
                    <AiOutlineMenu />
                </div>
            </div>
            <div className="flex">
                <div className="border rounded-md w-10 h-10 flex items-center justify-center mr-2 hover:bg-gray-200 hover:cursor-pointer">
                    <BsBell />
                </div>
                <div className="border rounded-md w-10 h-10 flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer">
                    <RxAvatar />
                </div>
            </div>
        </div>
    );
};

export default Header;
