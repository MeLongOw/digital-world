import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import icons from "../utils/icons";
import path from "../utils/path";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const { TfiMenu } = icons;

const Sidebar = () => {
    const { categories } = useSelector((state) => state.app);

    return (
        <div className="flex flex-col border max-h-[438px] h-full max-md:hidden">
            <div className="flex text-[16px] items-center px-5 py-[10px] bg-main text-white font-semibold">
                <span className="mr-3 flex items-center justify-center">
                    <TfiMenu size={18} />
                </span>
                <span>ALL COLECTIONS</span>
            </div>
            <div className="flex flex-col overflow-y-scroll">
                {categories ? (
                    categories?.map((item) => (
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
                            {
                                <span>{`${item.title} (${item.productCount})`}</span>
                            }
                        </NavLink>
                    ))
                ) : (
                    <Skeleton
                        count={9}
                        width="70%"
                        className="mx-5 mt-[15px] mb-[12px]"
                    />
                )}
            </div>
        </div>
    );
};

export default Sidebar;
