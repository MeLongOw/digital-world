import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import icons from "../utils/icons";
import path from "../utils/path";

const { TfiMenu } = icons;

const Sidebar = () => {
    const { categories } = useSelector((state) => state.app);

    return (
        <div className="flex flex-col border max-h-[438px] max-md:hidden">
            <div className="flex text-[16px] items-center px-5 py-[10px] bg-main text-white font-semibold">
                <span className="mr-3 flex items-center justify-center">
                    <TfiMenu size={18} />
                </span>
                <span>ALL COLECTIONS</span>
            </div>
            <div className="flex flex-col overflow-y-scroll"    >
                {categories?.map((item) => (
                    <NavLink
                        key={item.title}
                        to={`/${path.PRODUCTS}/${item.title.toLowerCase()}`}
                        className={({ isActive }) => {
                            const style =
                                "px-5 pt-[15px] pb-[14px] text-sm hover:text-main";
                            return isActive
                                ? `bg-main text-white ${style}`
                                : `${style}`;
                        }}
                    >
                        {<span>{`${item.title} (${item.productCount})`}</span>}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
