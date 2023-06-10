import React from "react";
import { navigation } from "../utils/constants";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <div className="max-w-main max-xl:px-3 w-full h-[48px] py-2 border-y  text-sm flex items-center">
            {navigation.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.id}
                    className={({ isActive }) =>
                        isActive
                            ? "md:pr-12 max-md:flex-1 max-md:text-center  hover:text-main text-main"
                            : "md:pr-12 max-md:flex-1 max-md:text-center  hover:text-main"
                    }
                >
                    {item.value}
                </NavLink>
            ))}
        </div>
    );
};

export default Navigation;
